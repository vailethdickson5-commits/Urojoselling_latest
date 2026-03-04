from django.urls import path

from .views import InventoryAddView, InventoryLogsView

urlpatterns = [
    path('inventory/add/', InventoryAddView.as_view(), name='inventory-add'),
    path('inventory/logs/', InventoryLogsView.as_view(), name='inventory-logs'),
]
