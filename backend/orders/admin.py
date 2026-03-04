from django.contrib import admin

from .models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "total_amount", "status", "payment_status", "created_at")
    list_filter = ("status", "payment_status", "created_at")
    search_fields = ("customer__email", "delivery_address")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price", "subtotal")
    search_fields = ("order__id", "product__name")
