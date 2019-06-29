"""FoodOrder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from OrderSystem import views as order_views

urlpatterns = [
    path('', views.home),
    path('admin/', admin.site.urls),
    path('order/', include('OrderSystem.urls')),
    path('food_supplier/', order_views.food_supplier),
    path('micro', views.micro),
    path('manage/', include([
        path('', order_views.manage),
        path('serving_table_list', order_views.getServingTableList),
        path('serving_order_item_list', order_views.getOrderItemList),
        path('staff_charge_table', order_views.set_staff_charge_table),
        path('delive_food', order_views.delive_food),
        path('cook', order_views.cook),
        path('orders', order_views.orders),
        path('staffs', order_views.staffs),
        path('tables', order_views.tables),
        path('foods', order_views.foods),
    ])),
]
