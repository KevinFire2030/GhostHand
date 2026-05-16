import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DEFAULT_ROUTE = "/webhook/receipt-account";
const DEFAULT_TIMEOUT_MS = 180000;

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "authorization, content-type");
  res.end(JSON.stringify(payload));
}

function readBody(req, maxBytes = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function cleanBase64(input) {
  const s = String(input || "");
  const comma = s.indexOf(",");
  return comma >= 0 ? s.slice(comma + 1) : s;
}

function extFromMime(mime) {
  if (mime === "image/jpeg" || mime === "image/jpg") return ".jpg";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  return ".png";
}

function parseEnvText(content) {
  const env = {};
  for (const line of String(content || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function loadOpenAiApiKey(cfg) {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  if (!cfg.openaiEnvPath) return null;
  try {
    const env = parseEnvText(await readFile(cfg.openaiEnvPath, "utf8"));
    return env.OPENAI_API_KEY || null;
  } catch {
    return null;
  }
}

function execFilePromise(file, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = execFile(file, args, { windowsHide: true, maxBuffer: 10 * 1024 * 1024, ...opts }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
    if (opts.timeout) {
      child.on("spawn", () => {});
    }
  });
}

function extractTextFromInfer(stdout) {
  const raw = String(stdout || "").trim();
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    const outputText = Array.isArray(parsed.outputs)
      ? parsed.outputs.find((output) => typeof output?.text === "string")?.text
      : null;
    return parsed.text || parsed.output || parsed.description || parsed.result?.text || parsed.content?.[0]?.text || outputText || raw;
  } catch {
    return raw;
  }
}

function extractJsonObject(text) {
  const s = String(text || "").trim();
  try { return JSON.parse(s); } catch {}
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)); } catch {}
  }
  return null;
}

function normalizeRecommendation(parsed, rawText) {
  const account = parsed?.account || parsed?.recommendedAccount || parsed?.category || parsed?.["정산계정"] || parsed?.["추천계정"] || "복리후생비";
  const reason = parsed?.reason || parsed?.rationale || parsed?.message || parsed?.["이유"] || rawText?.slice(0, 800) || "영수증 이미지 분석 결과 업무상 식음료/접대성 지출로 판단했습니다.";
  const confidence = parsed?.confidence ?? parsed?.score ?? parsed?.["신뢰도"] ?? 0.78;
  return { account, recommendedAccount: account, reason, confidence };
}

function fallbackRecommendation(body) {
  const haystack = `${body.fileName || ""} ${body.instruction || ""}`.toLowerCase();
  const accounts = Array.isArray(body.accounts) ? body.accounts : [];
  const pick = (names, fallback) => accounts.find((a) => names.some((n) => String(a).includes(n))) || fallback;
  if (haystack.includes("taxi") || haystack.includes("교통")) return { account: pick(["여비", "교통"], "여비교통비"), reason: "파일명/요청 내용상 교통 관련 영수증으로 판단했습니다.", confidence: 0.55 };
  if (haystack.includes("hotel") || haystack.includes("숙박")) return { account: pick(["여비", "숙박"], "여비교통비"), reason: "파일명/요청 내용상 출장/숙박 관련 영수증으로 판단했습니다.", confidence: 0.55 };
  return { account: pick(["복리", "접대", "회의", "식대"], "복리후생비"), reason: "이미지 분석이 실패해 PoC 안전 기본값으로 식대/복리후생성 지출 계정을 추천했습니다.", confidence: 0.35 };
}

async function analyzeReceipt(body, cfg) {
  const imageBuffer = Buffer.from(cleanBase64(body.imageBase64), "base64");
  const accountsText = Array.isArray(body.accounts) && body.accounts.length ? body.accounts.join(", ") : "복리후생비, 여비교통비, 접대비, 소모품비, 통신비, 교육훈련비, 광고선전비";
  const prompt = `당신은 한국 법인 경비 처리 담당자입니다. 영수증 이미지를 보고 가장 적절한 정산 계정을 추천하세요.\n\n사용 가능한 계정 후보: ${accountsText}\n\n반드시 아래 JSON만 출력하세요. 설명 문장이나 마크다운 금지.\n{\"account\":\"계정명\",\"reason\":\"추천 이유를 한국어 한 문장으로\",\"confidence\":0.0}\n\n판단 기준: 문구/복사용지/볼펜/파일/사무용품은 소모품비, 택시/기차/항공/주차/교통은 국내교통비 또는 여비교통비, 숙박은 출장비 또는 여비교통비, 홍보물/인쇄/광고는 판촉비, 카페 회의는 회의비, 야근 식대는 복리후생비.`;

  if (String(cfg.model || "").startsWith("openai/")) {
    const apiKey = await loadOpenAiApiKey(cfg);
    if (apiKey) {
      const startedAt = performance.now();
      const model = String(cfg.model).slice("openai/".length);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: 180,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${body.mimeType || "image/png"};base64,${imageBuffer.toString("base64")}`,
                    detail: cfg.imageDetail || "high",
                  },
                },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(cfg.fastTimeoutMs || 12000),
      });
      const rawText = await response.text();
      if (!response.ok) throw new Error(`OpenAI fast vision failed: HTTP ${response.status} ${rawText.slice(0, 300)}`);
      const raw = JSON.parse(rawText);
      const text = raw?.choices?.[0]?.message?.content || rawText;
      const parsed = extractJsonObject(text);
      return {
        ...normalizeRecommendation(parsed, text),
        rawModelText: text,
        analyzer: "openai-fast-vision",
        analyzerModel: cfg.model,
        analyzerElapsedMs: Math.round(performance.now() - startedAt),
      };
    }
  }

  const tmp = await mkdtemp(join(tmpdir(), "openclaw-receipt-"));
  try {
    const imagePath = join(tmp, `receipt${extFromMime(body.mimeType)}`);
    await writeFile(imagePath, imageBuffer);
    const args = ["infer", "image", "describe", "--file", imagePath, "--prompt", prompt, "--json", "--timeout-ms", String(cfg.timeoutMs || DEFAULT_TIMEOUT_MS)];
    if (cfg.model) args.push("--model", cfg.model);
    const cliEntry = process.argv?.[1] || "C:\\Users\\fireman_pro\\AppData\\Roaming\\npm\\node_modules\\openclaw\\dist\\index.js";
    const { stdout } = await execFilePromise(process.execPath, [cliEntry, ...args], { timeout: cfg.timeoutMs || DEFAULT_TIMEOUT_MS });
    const text = extractTextFromInfer(stdout);
    const parsed = extractJsonObject(text);
    return { ...normalizeRecommendation(parsed, text), rawModelText: text, analyzer: "openclaw-infer", analyzerModel: cfg.model || null };
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

export default definePluginEntry({
  id: "receipt-poc-webhook",
  name: "Receipt PoC Webhook",
  description: "Synchronous receipt account recommendation endpoint for the Electron PoC.",
  register(api) {
    const cfg = api.pluginConfig || {};
    const routePath = cfg.routePath || DEFAULT_ROUTE;
    api.registerHttpRoute({
      path: routePath,
      auth: "plugin",
      match: "exact",
      handler: async (req, res) => {
        if (req.method === "OPTIONS") {
          sendJson(res, 204, {});
          return true;
        }
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "method_not_allowed" });
          return true;
        }
        const expected = cfg.token;
        if (expected) {
          const header = req.headers?.authorization || "";
          const token = String(header).replace(/^Bearer\s+/i, "").trim();
          if (token !== expected) {
            sendJson(res, 401, { error: "unauthorized" });
            return true;
          }
        }
        try {
          const raw = await readBody(req);
          const body = raw ? JSON.parse(raw) : {};
          if (!body.imageBase64) {
            sendJson(res, 400, { error: "missing_imageBase64" });
            return true;
          }
          let recommendation;
          try {
            recommendation = await analyzeReceipt(body, cfg);
          } catch (error) {
            api.logger?.warn?.(`receipt-poc-webhook: OpenClaw image analysis failed: ${error?.message || error}`);
            recommendation = { ...fallbackRecommendation(body), analyzerFallback: true, analyzerError: String(error?.message || error) };
          }
          sendJson(res, 200, {
            ok: true,
            type: "receipt_account_recommendation_result",
            fileName: body.fileName || null,
            ...recommendation,
          });
          return true;
        } catch (error) {
          sendJson(res, 400, { error: "bad_request", message: String(error?.message || error) });
          return true;
        }
      },
    });
    api.logger?.info?.(`receipt-poc-webhook: registered ${routePath}`);
  },
});
