from django.db import transaction
from rest_framework import serializers

from inventory.models import InventoryLog
from products.models import Product

from .models import Order, OrderItem


class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'price', 'subtotal', 'product_name']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'total_amount',
            'delivery_address',
            'delivery_latitude',
            'delivery_longitude',
            'status',
            'payment_status',
            'created_at',
            'updated_at',
            'items',
        ]
        read_only_fields = ['id', 'customer', 'total_amount', 'status', 'payment_status', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'delivery_address', 'delivery_latitude', 'delivery_longitude', 'items']
        read_only_fields = ['id']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Order must contain at least one item')
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        customer = getattr(request, 'user', None)

        product_ids = [item['product'] for item in items_data]
        products = (
            Product.objects.select_for_update()
            .filter(id__in=product_ids)
            .select_related('category')
        )
        products_by_id = {p.id: p for p in products}

        missing = [pid for pid in product_ids if pid not in products_by_id]
        if missing:
            raise serializers.ValidationError({'items': f'Invalid product ids: {missing}'})

        order = Order.objects.create(customer=customer, total_amount=0, **validated_data)

        total = 0
        for item in items_data:
            product = products_by_id[item['product']]
            qty = int(item['quantity'])

            if not product.is_available or product.stock_quantity < qty:
                raise serializers.ValidationError({'items': f'Insufficient stock for product {product.id}'})

            price = product.price
            subtotal = price * qty
            total += subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price=price,
                subtotal=subtotal,
            )

            product.stock_quantity -= qty
            if product.stock_quantity <= 0:
                product.stock_quantity = 0
                product.is_available = False
            product.save(update_fields=['stock_quantity', 'is_available'])

            InventoryLog.objects.create(
                product=product,
                quantity_added=0,
                quantity_removed=qty,
                reason=f'Order #{order.pk}',
            )

        order.total_amount = total
        order.save(update_fields=['total_amount'])
        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'payment_status']
