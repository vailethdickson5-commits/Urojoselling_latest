from rest_framework import serializers

from products.models import Product

from .models import InventoryLog


class InventoryLogSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = InventoryLog
        fields = ['id', 'product', 'product_name', 'quantity_added', 'quantity_removed', 'reason', 'created_at']
        read_only_fields = ['id', 'product_name', 'created_at']


class StockAddSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity_added = serializers.IntegerField(min_value=1)
    reason = serializers.CharField(required=False, allow_blank=True)

    def validate_product(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError('Invalid product')
        return value
