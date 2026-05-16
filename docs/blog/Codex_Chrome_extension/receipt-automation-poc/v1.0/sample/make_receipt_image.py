from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path(__file__).with_name('credit_card_receipt_sample.png')
W, H = 760, 1180
img = Image.new('RGB', (W, H), '#f3f0e8')
d = ImageDraw.Draw(img)

# Fonts
font_candidates = [
    r'C:\Windows\Fonts\malgun.ttf',
    r'C:\Windows\Fonts\malgunbd.ttf',
    r'C:\Windows\Fonts\consola.ttf',
]
font_path = next((p for p in font_candidates if Path(p).exists()), None)
font_bold_path = r'C:\Windows\Fonts\malgunbd.ttf' if Path(r'C:\Windows\Fonts\malgunbd.ttf').exists() else font_path
font = ImageFont.truetype(font_path, 27) if font_path else ImageFont.load_default()
small = ImageFont.truetype(font_path, 23) if font_path else ImageFont.load_default()
bold = ImageFont.truetype(font_bold_path, 34) if font_bold_path else font
bold_small = ImageFont.truetype(font_bold_path, 27) if font_bold_path else font
mono = ImageFont.truetype(r'C:\Windows\Fonts\consola.ttf', 25) if Path(r'C:\Windows\Fonts\consola.ttf').exists() else small

# Receipt paper
margin = 55
paper = (margin, 35, W - margin, H - 35)
d.rounded_rectangle(paper, radius=18, fill='#fffdf7', outline='#d9d2c3', width=2)

x = margin + 38
y = 75
line_gap = 42

def center(text, font_obj, y, fill='#111'):
    bbox = d.textbbox((0, 0), text, font=font_obj)
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) / 2, y), text, font=font_obj, fill=fill)

def line(text='', font_obj=font, gap=line_gap, fill='#111'):
    global y
    d.text((x, y), text, font=font_obj, fill=fill)
    y += gap

def hr(gap=34):
    global y
    d.line((x, y, W - margin - 38, y), fill='#b8b0a0', width=2)
    y += gap

center('신용카드 매출전표', bold, y)
y += 60
center('CREDIT CARD RECEIPT', small, y, '#555')
y += 52
hr()

line('가맹점명     스타벅스 강남역점', font)
line('사업자번호   123-45-67890', font)
line('주소         서울특별시 강남구 테헤란로 123', small, 36)
line('전화번호     02-1234-5678', font)
hr()

line('거래일시     2026-05-16 14:32:18', font)
line('승인번호     83749215', font)
line('카드종류     신한카드', font)
line('카드번호     9410-12**-****-3456', font)
line('거래유형     일시불', font)
hr()

line('품목', bold_small)
line('카페 아메리카노 Tall 2개        9,000원', small, 38)
line('치즈 베이글 1개                 4,500원', small, 38)
hr()

line('공급가액                         12,273원', mono, 38)
line('부가세                            1,227원', mono, 38)
y += 8
d.rounded_rectangle((x - 12, y - 8, W - margin - 28, y + 58), radius=10, fill='#f2eee2')
d.text((x, y), '합계금액                         13,500원', font=bold_small, fill='#111')
y += 82
line('결제금액                         13,500원', bold_small, 48)
hr()

center('감사합니다.', font, y)
y += 52
center('샘플 영수증 / PoC 테스트용', small, y, '#777')

# Add subtle scan/noise texture
for i in range(0, H, 14):
    d.line((margin + 8, i, W - margin - 8, i), fill=(250, 248, 242), width=1)

img.save(out)
print(out)
