
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import openpyxl

app = FastAPI()

# Разрешаем доступ только с Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://telegram-catalog.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_FILE = "Каталог.xlsx"

class Product(BaseModel):
    name: str
    price: Optional[float]
    category: str
    article: Optional[str] = None
    stock: Optional[int] = None
    in_stock: str

def load_products_from_excel(file_path: str) -> List[Product]:
    print(f"Загружаем файл: {file_path}")

    wb = openpyxl.load_workbook(file_path)
    sheet = wb.active

    products = []
    current_category = "Без категории"

    headers = [cell.value for cell in sheet[1]]
    header_map = {h.strip().lower(): idx for idx, h in enumerate(headers) if h}

    for row in sheet.iter_rows(min_row=2):
        name_cell = row[0]
        name = str(name_cell.value).strip() if name_cell.value else ""

        if not name:
            continue

        if name_cell.font and name_cell.font.bold and all(cell.value in [None, "", " "] for cell in row[1:]):
            current_category = name
            continue

        try:
            price_raw = row[header_map.get("цена")].value if "цена" in header_map else None
            article_raw = row[header_map.get("код")].value if "код" in header_map else None
            stock_raw = row[header_map.get("остаток")].value if "остаток" in header_map else None

            price = float(str(price_raw).strip()) if price_raw not in [None, "", " "] else None
            article = str(article_raw).strip() if article_raw not in [None, "", " "] else None
            stock = int(str(stock_raw).strip()) if stock_raw not in [None, "", " "] and str(stock_raw).strip().isdigit() else 0
            in_stock = "В НАЛИЧИИ" if stock > 0 else "НЕТ В НАЛИЧИИ"

            product = Product(
                name=name,
                price=price,
                category=current_category,
                article=article,
                stock=stock,
                in_stock=in_stock
            )
            products.append(product)

        except Exception as e:
            print(f"⚠️ Ошибка при обработке строки '{name}': {e}")
            continue

    print(f"Загружено товаров: {len(products)}")
    return products


@app.get("/products", response_model=List[Product])
def get_products():
    return load_products_from_excel(EXCEL_FILE)

# Trigger redeploy