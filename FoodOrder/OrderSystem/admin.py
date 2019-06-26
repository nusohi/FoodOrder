from django.contrib import admin
from .models import Food, Foodtype, Order, OrderItem, Staff, Staff_Table


admin.site.register(Food)
admin.site.register(Foodtype)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Staff)
admin.site.register(Staff_Table)
