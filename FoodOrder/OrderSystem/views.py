from django.shortcuts import render
from django.http import HttpResponse
from .models import Food, Foodtype


def OrderHome(request):
    foodList = Food.objects.all()
    foodTypeList = Foodtype.objects.all()
    return render(
        request,
        'OrderHome.html',
        {
            'foodList': foodList,
            'foodTypeList': foodTypeList
        }
    )
