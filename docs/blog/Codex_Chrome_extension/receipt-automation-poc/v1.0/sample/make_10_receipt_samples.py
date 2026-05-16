from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import random

OUT_DIR = Path(__file__).parent
W, H = 760, 1180

FONT_CANDIDATES = [
    r'C:\Windows\Fonts\malgun.ttf',
    r'C:\Windows\Fonts\malgunbd.ttf',
    r'C:\Windows\Fonts\consola.ttf',
]
font_path = next((p for p in FONT_CANDIDATES if Path(p).exists()), None)
bold_path = r'C:\Windows\Fonts\malgunbd.ttf' if Path(r'C:\Windows\Fonts\malgunbd.ttf').exists() else font_path
mono_path = r'C:\Windows\Fonts\consola.ttf' if Path(r'C:\Windows\Fonts\consola.ttf').exists() else font_path

font = ImageFont.truetype(font_path, 27) if font_path else ImageFont.load_default()
small = ImageFont.truetype(font_path, 23) if font_path else ImageFont.load_default()
tiny = ImageFont.truetype(font_path, 20) if font_path else ImageFont.load_default()
bold = ImageFont.truetype(bold_path, 34) if bold_path else font
bold_small = ImageFont.truetype(bold_path, 27) if bold_path else font
mono = ImageFont.truetype(mono_path, 25) if mono_path else small

samples = [
    {
        'file': 'receipt_01_cafe_meeting.png',
        'title': '신용카드 매출전표',
        'merchant': '스타벅스 강남역점',
        'biz': '123-45-67890',
        'address': '서울특별시 강남구 테헤란로 123',
        'phone': '02-1234-5678',
        'date': '2026-05-16 14:32:18',
        'approval': '83749215',
        'card': '신한카드',
        'card_no': '9410-12**-****-3456',
        'items': [('카페 아메리카노 Tall', 2, 4500), ('치즈 베이글', 1, 4500)],
        'account_hint': '회의비',
    },
    {
        'file': 'receipt_02_taxi_transport.png',
        'title': '택시 영수증',
        'merchant': '서울개인택시 27바1234',
        'biz': '214-11-90876',
        'address': '서울특별시 중구 세종대로 110',
        'phone': '1644-1188',
        'date': '2026-05-17 08:45:03',
        'approval': '51290377',
        'card': '현대카드',
        'card_no': '4550-22**-****-1029',
        'items': [('택시 운임', 1, 18200), ('심야/거리 할증', 1, 2800)],
        'account_hint': '국내교통비',
    },
    {
        'file': 'receipt_03_office_supplies.png',
        'title': '구매 영수증',
        'merchant': '오피스디포 선릉점',
        'biz': '220-86-13579',
        'address': '서울특별시 강남구 선릉로 428',
        'phone': '02-555-0182',
        'date': '2026-05-18 11:12:44',
        'approval': '19028463',
        'card': 'KB국민카드',
        'card_no': '3560-88**-****-7712',
        'items': [('A4 복사용지 2박스', 1, 24000), ('볼펜 세트', 3, 3500), ('클리어파일', 5, 1200)],
        'account_hint': '소모품비',
    },
    {
        'file': 'receipt_04_client_lunch.png',
        'title': '카드 매출전표',
        'merchant': '한우정 삼성점',
        'biz': '105-87-24680',
        'address': '서울특별시 강남구 봉은사로 524',
        'phone': '02-6000-7788',
        'date': '2026-05-18 12:58:21',
        'approval': '77412038',
        'card': '삼성카드',
        'card_no': '9440-41**-****-8830',
        'items': [('점심 특선', 4, 18000), ('음료', 4, 2000)],
        'account_hint': '접대비',
    },
    {
        'file': 'receipt_05_promotion_printing.png',
        'title': '신용카드 영수증',
        'merchant': '프린트24 홍대점',
        'biz': '119-03-45671',
        'address': '서울특별시 마포구 와우산로 94',
        'phone': '02-333-2400',
        'date': '2026-05-19 16:20:55',
        'approval': '64281904',
        'card': '롯데카드',
        'card_no': '5520-30**-****-4481',
        'items': [('홍보 리플렛 인쇄', 100, 350), ('코팅', 100, 120)],
        'account_hint': '판촉비',
    },
    {
        'file': 'receipt_06_parking.png',
        'title': '주차요금 영수증',
        'merchant': '코엑스 주차장',
        'biz': '120-81-09876',
        'address': '서울특별시 강남구 영동대로 513',
        'phone': '02-6002-7130',
        'date': '2026-05-20 19:04:10',
        'approval': '90357128',
        'card': '하나카드',
        'card_no': '5155-77**-****-9090',
        'items': [('주차요금 3시간', 1, 14400)],
        'account_hint': '국내교통비',
    },
    {
        'file': 'receipt_07_software_subscription.png',
        'title': '온라인 결제 영수증',
        'merchant': 'Notion Labs Korea',
        'biz': '581-88-01010',
        'address': '서울특별시 종로구 종로 1',
        'phone': '070-0000-0000',
        'date': '2026-05-21 09:10:00',
        'approval': '34810922',
        'card': '비씨카드',
        'card_no': '4000-98**-****-1200',
        'items': [('Team Plan Monthly', 5, 12000)],
        'account_hint': '지급수수료',
    },
    {
        'file': 'receipt_08_delivery_overtime.png',
        'title': '배달 주문 영수증',
        'merchant': '배달의민족 역삼분식',
        'biz': '301-22-33445',
        'address': '서울특별시 강남구 역삼로 221',
        'phone': '0507-1111-2222',
        'date': '2026-05-21 21:38:42',
        'approval': '76104489',
        'card': '우리카드',
        'card_no': '5388-10**-****-6770',
        'items': [('김밥', 6, 4200), ('라면', 3, 5500), ('배달팁', 1, 3000)],
        'account_hint': '복리후생비',
    },
    {
        'file': 'receipt_09_hotel_business_trip.png',
        'title': '숙박 영수증',
        'merchant': '부산비즈니스호텔',
        'biz': '617-81-98765',
        'address': '부산광역시 부산진구 중앙대로 772',
        'phone': '051-808-2000',
        'date': '2026-05-22 07:50:31',
        'approval': '55091836',
        'card': 'NH농협카드',
        'card_no': '9441-70**-****-5011',
        'items': [('객실 1박', 1, 98000), ('조식', 1, 15000)],
        'account_hint': '출장비',
    },
    {
        'file': 'receipt_10_equipment_purchase.png',
        'title': '매출전표',
        'merchant': '하이마트 잠실점',
        'biz': '215-85-67812',
        'address': '서울특별시 송파구 올림픽로 240',
        'phone': '02-420-9000',
        'date': '2026-05-22 15:27:09',
        'approval': '10293847',
        'card': '카카오뱅크카드',
        'card_no': '5365-44**-****-8821',
        'items': [('무선 키보드', 1, 79000), ('무선 마우스', 1, 39000), ('USB-C 허브', 1, 45000)],
        'account_hint': '비품구매',
    },
]


def won(n):
    return f'{n:,}원'


def draw_receipt(sample):
    img = Image.new('RGB', (W, H), '#f3f0e8')
    d = ImageDraw.Draw(img)
    margin = 55
    paper = (margin, 35, W - margin, H - 35)
    d.rounded_rectangle(paper, radius=18, fill='#fffdf7', outline='#d9d2c3', width=2)

    x = margin + 38
    y = 75

    def center(text, font_obj, yy, fill='#111'):
        bbox = d.textbbox((0, 0), text, font=font_obj)
        tw = bbox[2] - bbox[0]
        d.text(((W - tw) / 2, yy), text, font=font_obj, fill=fill)

    def line(text='', font_obj=font, gap=42, fill='#111'):
        nonlocal y
        d.text((x, y), text, font=font_obj, fill=fill)
        y += gap

    def hr(gap=34):
        nonlocal y
        d.line((x, y, W - margin - 38, y), fill='#b8b0a0', width=2)
        y += gap

    center(sample['title'], bold, y)
    y += 60
    center('RECEIPT / PoC SAMPLE', small, y, '#555')
    y += 52
    hr()

    line(f"가맹점명     {sample['merchant']}")
    line(f"사업자번호   {sample['biz']}")
    line(f"주소         {sample['address']}", small, 36)
    line(f"전화번호     {sample['phone']}")
    hr()

    line(f"거래일시     {sample['date']}")
    line(f"승인번호     {sample['approval']}")
    line(f"카드종류     {sample['card']}")
    line(f"카드번호     {sample['card_no']}")
    line('거래유형     일시불')
    hr()

    line('품목', bold_small)
    subtotal = 0
    for name, qty, price in sample['items']:
        total = qty * price
        subtotal += total
        item_text = f'{name} {qty}개'
        price_text = won(total)
        max_item_len = 20
        if len(item_text) > max_item_len:
            item_text = item_text[:max_item_len]
        line(f'{item_text:<22}{price_text:>12}', small, 38)
    hr()

    supply = round(subtotal / 1.1)
    vat = subtotal - supply
    line(f"공급가액{won(supply):>30}", mono, 38)
    line(f"부가세{won(vat):>32}", mono, 38)
    y += 8
    d.rounded_rectangle((x - 12, y - 8, W - margin - 28, y + 58), radius=10, fill='#f2eee2')
    d.text((x, y), f"합계금액{won(subtotal):>30}", font=bold_small, fill='#111')
    y += 82
    line(f"결제금액{won(subtotal):>30}", bold_small, 48)
    hr()

    line(f"추천계정 힌트 {sample['account_hint']}", tiny, 34, '#777')
    center('감사합니다.', font, y + 10)
    center('샘플 영수증 / PoC 테스트용', small, y + 62, '#777')

    # subtle scan/noise texture after text: use very light lines, no text overwrite issue is acceptable for OCR stress test
    for i in range(0, H, 14):
        d.line((margin + 8, i, W - margin - 8, i), fill=(250, 248, 242), width=1)

    out = OUT_DIR / sample['file']
    img.save(out)

    txt = out.with_suffix('.txt')
    txt.write_text(
        '\n'.join([
            f"file={sample['file']}",
            f"merchant={sample['merchant']}",
            f"business_registration_number={sample['biz']}",
            f"transaction_datetime={sample['date']}",
            f"approval_number={sample['approval']}",
            f"card={sample['card']}",
            f"total_amount={subtotal}",
            f"supply_amount={supply}",
            f"tax_amount={vat}",
            f"account_hint={sample['account_hint']}",
            'items=' + '; '.join([f'{name} x{qty} @{price}' for name, qty, price in sample['items']]),
        ]),
        encoding='utf-8'
    )
    return out


if __name__ == '__main__':
    created = [draw_receipt(sample) for sample in samples]
    for path in created:
        print(path)
