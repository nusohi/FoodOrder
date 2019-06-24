from django.shortcuts import render
from django.http import HttpResponse
from .models import Food, Foodtype, Order, OrderItem
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def OrderHome(request):
    if request.method == "GET":
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
    elif request.method == "POST":
        orderTxt = request.POST.get('order')
        order = json.loads(orderTxt)
        print(order)

        # 创建订单
        new_order = Order()
        new_order.is_pay = True
        new_order.save()

        for food in order:
            curFood = Food.objects.get(pk=food['id'])
            price = curFood.price
            sum_price = price*food['amount']
            OrderItem.objects.create(
                orderID=new_order,
                foodID=curFood,
                amount=food['amount'],
                sum_price=sum_price
            )

            print('ID:' + str(food['id']) + ' 数量:' + str(food['amount']))
            print(sum_price)

        return HttpResponse({
            'order': order
        })
