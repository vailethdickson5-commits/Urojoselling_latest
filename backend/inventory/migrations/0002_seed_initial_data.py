from decimal import Decimal
import os

from django.contrib.auth.hashers import make_password
from django.db import migrations


def seed_initial_data(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    Category = apps.get_model("products", "Category")
    Product = apps.get_model("products", "Product")
    InventoryLog = apps.get_model("inventory", "InventoryLog")
    Order = apps.get_model("orders", "Order")
    OrderItem = apps.get_model("orders", "OrderItem")

    admin_email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "vailethdickson5@gmail.com")
    admin_password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "12345678")
    admin_name = os.environ.get("DJANGO_SUPERUSER_FULL_NAME", "vaileth")

    admin_user, _ = User.objects.get_or_create(
        email=admin_email,
        defaults={
            "full_name": admin_name,
            "phone_number": "",
            "role": "admin",
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
            "password": make_password(admin_password),
        },
    )
    admin_user.full_name = admin_name
    admin_user.role = "admin"
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.password = make_password(admin_password)
    admin_user.save()

    customer, _ = User.objects.get_or_create(
        email="customer@urojo.com",
        defaults={
            "full_name": "Default Customer",
            "phone_number": "0000000000",
            "role": "customer",
            "is_staff": False,
            "is_superuser": False,
            "is_active": True,
            "password": make_password("12345678"),
        },
    )

    books, _ = Category.objects.get_or_create(
        name="Books",
        defaults={"description": "Educational and reference books"},
    )
    stationery, _ = Category.objects.get_or_create(
        name="Stationery",
        defaults={"description": "Office and school stationery"},
    )
    electronics, _ = Category.objects.get_or_create(
        name="Electronics",
        defaults={"description": "Small daily-use electronics"},
    )

    products = [
        ("Biology Secondary", books, Decimal("25.00"), 40),
        ("Bookkeeping Secondary", books, Decimal("22.50"), 30),
        ("A4 Exercise Book", stationery, Decimal("1.50"), 200),
        ("Scientific Calculator", electronics, Decimal("18.00"), 50),
    ]

    product_map = {}
    for name, category, price, stock in products:
        product, _ = Product.objects.get_or_create(
            name=name,
            defaults={
                "category": category,
                "description": f"{name} product item",
                "price": price,
                "stock_quantity": stock,
                "is_available": True,
            },
        )
        product_map[name] = product
        InventoryLog.objects.get_or_create(
            product=product,
            quantity_added=product.stock_quantity,
            quantity_removed=0,
            reason="Initial stock seed",
        )

    order, _ = Order.objects.get_or_create(
        customer=customer,
        delivery_address="Seed Order Address, Urojo",
        status="Pending",
        payment_status="Pending",
        defaults={"total_amount": Decimal("0.00")},
    )

    total = Decimal("0.00")
    order_lines = [("Biology Secondary", 1), ("A4 Exercise Book", 3)]
    for product_name, quantity in order_lines:
        product = product_map[product_name]
        subtotal = product.price * quantity
        OrderItem.objects.get_or_create(
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
    order.save()


def reverse_seed_data(apps, schema_editor):
    # Keep seeded data on rollback to avoid accidental data loss in production.
    return


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
        ("products", "0001_initial"),
        ("orders", "0001_initial"),
        ("inventory", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_initial_data, reverse_seed_data),
    ]
