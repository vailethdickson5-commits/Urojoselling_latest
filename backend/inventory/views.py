from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from accounts.permissions import IsAdminRole
from products.models import Product

from .models import InventoryLog
from .serializers import InventoryLogSerializer, StockAddSerializer


class InventoryAddView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = StockAddSerializer

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product']
        qty = int(serializer.validated_data['quantity_added'])
        reason = serializer.validated_data.get('reason', '')

        product = Product.objects.select_for_update().get(id=product_id)
        product.stock_quantity += qty
        if product.stock_quantity > 0:
            product.is_available = True
        product.save(update_fields=['stock_quantity', 'is_available'])

        log = InventoryLog.objects.create(
            product=product,
            quantity_added=qty,
            quantity_removed=0,
            reason=reason,
        )

        return Response(InventoryLogSerializer(log).data, status=status.HTTP_201_CREATED)


class InventoryLogsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = InventoryLogSerializer

    def get_queryset(self):
        return InventoryLog.objects.select_related('product').all().order_by('-created_at')


# Create your views here.
