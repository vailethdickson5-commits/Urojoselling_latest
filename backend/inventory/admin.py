from django.contrib import admin

from .models import InventoryLog


@admin.register(InventoryLog)
class InventoryLogAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "quantity_added", "quantity_removed", "reason", "created_at")
    list_filter = ("created_at",)
    search_fields = ("product__name", "reason")
