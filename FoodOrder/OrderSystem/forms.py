from .models import Food, Foodtype, Staff, Staff_Table, Order, OrderItem
from django import forms

class FoodtypeForm(forms.ModelForm):
    class Meta:
        model = Foodtype
        fields = "__all__"

class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = "__all__"


class StaffForm(forms.ModelForm):
    class Meta:
        model = Staff
        fields = "__all__"

class Staff_TableForm(forms.ModelForm):
    class Meta:
        model = Staff_Table
        fields = "__all__"

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = "__all__"

class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = "__all__"
