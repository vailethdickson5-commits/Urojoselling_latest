from rest_framework import permissions, viewsets

from accounts.permissions import IsAdminRole

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ReadOnlyOrAdminWrite(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return IsAdminRole().has_permission(request, view)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyOrAdminWrite]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrAdminWrite]


# Create your views here.
