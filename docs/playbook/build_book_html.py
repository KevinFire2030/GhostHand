from pathlib import Path
import markdown

root = Path(r"E:\ax\PRJs\GhostHand\docs\playbook")
md_path = root / "내 스마트폰에서 돌아가는 AI 비서_v1.0.md"
html_path = root / "내 스마트폰에서 돌아가는 AI 비서_v1.0.html"

text = md_path.read_text(encoding="utf-8")
body = markdown.markdown(text, extensions=["tables", "fenced_code"])
html = f"""<html>
<head>
<meta charset=\"utf-8\">
<style>
body {{ font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 900px; margin: 40px auto; line-height: 1.7; color: #111; }}
h1, h2, h3 {{ page-break-after: avoid; }}
pre {{ background: #f6f8fa; padding: 12px; overflow: auto; white-space: pre-wrap; }}
code {{ font-family: Consolas, monospace; }}
hr {{ margin: 32px 0; }}
</style>
</head>
<body>
{body}
</body>
</html>"""
html_path.write_text(html, encoding="utf-8")
print(html_path)
