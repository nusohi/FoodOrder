from django.contrib import admin
from .models import Food, Foodtype, Order, OrderItem


admin.site.register(Food)
admin.site.register(Foodtype)
admin.site.register(Order)
admin.site.register(OrderItem)
