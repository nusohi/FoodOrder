from django.shortcuts import render
from django.http import HttpResponse
from .models import Food


def OrderHome(request):
    foodList = Food.objects.all()
    return render(
        request,
        'OrderHome.html',
        {
            'foodList': foodList
        }
    )
