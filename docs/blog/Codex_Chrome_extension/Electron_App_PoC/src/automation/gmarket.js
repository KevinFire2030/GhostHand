const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const SORT_OPTIONS = {
  review: {
    label: "상품평 많은순",
    selector: "div.box__control-area li:nth-of-type(5) > a",
    expectedQuery: "s=13"
  }
};

async function ensureOutputDir() {
  const outDir = path.join(__dirname, "..", "..", "output");
  await fs.mkdir(outDir, { recursive: true });
  return outDir;
}

async function emit(onStep, message, detail = {}) {
  const step = {
    time: new Date().toISOString(),
    message,
    ...detail
  };
  if (typeof onStep === "function") {
    onStep(step);
  }
}

async function waitForSearchBox(page, onStep, { visibleBrowser }) {
  const searchBox = page.locator("#form__search-keyword");

  try {
    await searchBox.waitFor({ state: "visible", timeout: 15000 });
    return searchBox;
  } catch (error) {
    const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
    const isBotCheck =
      bodyText.includes("봇 확인") ||
      bodyText.includes("간단한 확인") ||
      bodyText.includes("Just a moment");

    if (!isBotCheck) {
      throw error;
    }

    if (!visibleBrowser) {
      throw new Error(
        "G마켓 봇 확인 화면이 표시되었습니다. 앱에서 '자동화 브라우저 창 보이기'를 켜고 사용자가 확인을 완료해야 합니다."
      );
    }

    await emit(onStep, "G마켓 봇 확인 화면이 표시되었습니다. 열린 브라우저 창에서 확인을 완료하면 자동으로 이어갑니다.");
    await searchBox.waitFor({ state: "visible", timeout: 180000 });
    return searchBox;
  }
}

async function runGmarketAutomation({
  keyword = "무선 마우스",
  sortMode = "review",
  visibleBrowser = true,
  onStep
} = {}) {
  const sort = SORT_OPTIONS[sortMode] || SORT_OPTIONS.review;
  let browser;

  try {
    await emit(onStep, "자동화 브라우저를 실행합니다.");
    browser = await chromium.launch({
      headless: !visibleBrowser,
      args: ["--window-size=1280,900"]
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      acceptDownloads: true
    });
    const page = await context.newPage();

    await emit(onStep, "G마켓에 접속합니다.", { url: "https://www.gmarket.co.kr/" });
    await page.goto("https://www.gmarket.co.kr/", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    await emit(onStep, "검색어를 입력합니다.", { keyword });
    const searchBox = await waitForSearchBox(page, onStep, { visibleBrowser });
    await searchBox.fill(keyword);

    await emit(onStep, "검색을 실행합니다.");
    await Promise.all([
      page.waitForURL("**/n/search**", { timeout: 30000 }).catch(() => null),
      page.locator("div.box__head-search button").first().click()
    ]);
    await page.waitForLoadState("domcontentloaded", { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(1500);

    const searchUrl = page.url();
    await emit(onStep, "검색 결과 페이지를 확인했습니다.", {
      url: searchUrl,
      title: await page.title()
    });

    await emit(onStep, "정렬 목록을 엽니다.");
    const sortButton = page.locator("div.box__sort-control-selected > button").first();
    await sortButton.waitFor({ state: "visible", timeout: 20000 });
    await sortButton.click();

    await emit(onStep, `${sort.label} 정렬 옵션을 클릭합니다.`);
    const sortOption = page.locator(sort.selector).first();
    await sortOption.waitFor({ state: "visible", timeout: 10000 });
    await sortOption.click();
    await page.waitForLoadState("domcontentloaded", { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2500);

    const finalUrl = page.url();
    const finalTitle = await page.title();
    const decodedUrl = decodeURIComponent(finalUrl);
    const success =
      finalUrl.includes("/n/search") &&
      decodedUrl.includes(keyword.replace(/\s+/g, "+")) &&
      finalUrl.includes(sort.expectedQuery);

    const outputDir = await ensureOutputDir();
    const screenshotPath = path.join(outputDir, `gmarket-result-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await emit(onStep, success ? "정렬 적용을 확인했습니다." : "정렬 적용 확인이 불완전합니다.", {
      finalUrl,
      finalTitle,
      screenshotPath
    });

    return {
      success,
      keyword,
      sortLabel: sort.label,
      finalUrl,
      finalTitle,
      screenshotPath,
      note: "상품 상세, 장바구니, 구매 단계는 실행하지 않았습니다."
    };
  } catch (error) {
    await emit(onStep, "자동화 실행 중 오류가 발생했습니다.", {
      error: error.message
    });
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  runGmarketAutomation
};
