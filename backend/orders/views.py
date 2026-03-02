from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminRole

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer, OrderStatusUpdateSerializer


class OrderViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Order.objects.prefetch_related('items__product').select_related('customer').all().order_by('-created_at')

    def get_permissions(self):
        if self.action in {'status'}:
            return [permissions.IsAuthenticated(), IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action == 'status':
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if getattr(user, 'role', None) == 'admin':
            return qs
        return qs.filter(customer=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        output = OrderSerializer(order, context={'request': request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['put'], url_path='status')
    def status(self, request, pk=None):
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(order, context={'request': request}).data)


# Create your views here.
