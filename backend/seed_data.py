#!/usr/bin/env python
"""
Seed baseline data for production/local environments.
Safe to run multiple times (idempotent).
"""

import os
from decimal import Decimal

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402
from inventory.models import InventoryLog  # noqa: E402
from orders.models import Order, OrderItem  # noqa: E402
from products.models import Category, Product  # noqa: E402


def seed_users():
    user_model = get_user_model()
    customer, _ = user_model.objects.get_or_create(
        email="customer@urojo.com",
        defaults={
            "full_name": "Default Customer",
            "phone_number": "0000000000",
            "role": "customer",
            "is_staff": False,
            "is_superuser": False,
        },
    )
    if not customer.has_usable_password():
        customer.set_password("12345678")
        customer.save(update_fields=["password"])
    return customer


def seed_catalog():
    category_data = [
        ("Books", "Educational and reference books"),
        ("Stationery", "Office and school stationery"),
        ("Electronics", "Small daily-use electronics"),
    ]
    categories = {}
    for name, description in category_data:
        category, _ = Category.objects.update_or_create(
            name=name,
            defaults={"description": description},
        )
        categories[name] = category

    product_data = [
        ("Biology Secondary", "Books", Decimal("25.00"), 40),
        ("Bookkeeping Secondary", "Books", Decimal("22.50"), 30),
        ("A4 Exercise Book", "Stationery", Decimal("1.50"), 200),
        ("Scientific Calculator", "Electronics", Decimal("18.00"), 50),
    ]
    products = {}
    for name, category_name, price, stock_qty in product_data:
        product, _ = Product.objects.update_or_create(
            name=name,
            defaults={
                "category": categories[category_name],
                "description": f"{name} product item",
                "price": price,
                "stock_quantity": stock_qty,
                "is_available": True,
            },
        )
        products[name] = product
    return products


def seed_inventory(products):
    for product in products.values():
        InventoryLog.objects.get_or_create(
            product=product,
            quantity_added=product.stock_quantity,
            quantity_removed=0,
            reason="Initial stock seed",
        )


def seed_orders(customer, products):
    order, _ = Order.objects.get_or_create(
        customer=customer,
        delivery_address="Seed Order Address, Urojo",
        status=Order.Status.PENDING,
        payment_status=Order.PaymentStatus.PENDING,
        defaults={"total_amount": Decimal("0.00")},
    )

    wanted_items = [
        ("Biology Secondary", 1),
        ("A4 Exercise Book", 3),
    ]
    total = Decimal("0.00")
    for product_name, quantity in wanted_items:
        product = products[product_name]
        subtotal = product.price * quantity
        OrderItem.objects.update_or_create(
            order=order,
            product=product,
            defaults={
                "quantity": quantity,
                "price": product.price,
                "subtotal": subtotal,
            },
        )
        total += subtotal

    order.total_amount = total
    order.save(update_fields=["total_amount"])


def main():
    customer = seed_users()
    products = seed_catalog()
    seed_inventory(products)
    seed_orders(customer, products)
    print("Seed complete: users, categories, products, inventory, orders.")


if __name__ == "__main__":
    main()
