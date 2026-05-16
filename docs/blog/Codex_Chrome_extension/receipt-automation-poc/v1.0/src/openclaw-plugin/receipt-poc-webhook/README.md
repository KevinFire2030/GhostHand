# Receipt PoC Webhook Plugin

OpenClaw Gateway startup plugin for the Electron receipt automation PoC.

## Purpose

Provides a synchronous HTTP endpoint:

```text
POST /webhook/receipt-account
```

The Electron app sends a receipt image as base64. The plugin returns a recommended expense account, reason, and confidence.

## Fast path

For demo latency, the plugin supports a direct OpenAI vision call when `config.model` starts with `openai/` and an API key is available.

Recommended config shape:

```json
{
  "plugins": {
    "entries": {
      "receipt-poc-webhook": {
        "enabled": true,
        "config": {
          "routePath": "/webhook/receipt-account",
          "token": "***",
          "model": "openai/gpt-4o-mini",
          "openaiEnvPath": "E:/path/to/.env",
          "fastTimeoutMs": 12000,
          "imageDetail": "high",
          "timeoutMs": 180000
        }
      }
    },
    "load": {
      "paths": ["C:/Users/<you>/.openclaw/plugins/receipt-poc-webhook"]
    }
  }
}
```

If no direct OpenAI API key is available, the plugin falls back to `openclaw infer image describe`.

## Measured result

After switching to `openai/gpt-4o-mini` direct vision path, local webhook test completed in about `2.98s` versus previous `80s+` via the CLI/agent path.

Do not commit real tokens or API keys.
