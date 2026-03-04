from django.db import models

# Create your models here.


class InventoryLog(models.Model):
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='inventory_logs')
    quantity_added = models.IntegerField(default=0)
    quantity_removed = models.IntegerField(default=0)
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"InventoryLog #{self.pk}"
