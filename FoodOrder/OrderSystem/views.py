from django.shortcuts import render
from django.http import HttpResponse
from .models import Food, Foodtype, Order, OrderItem
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
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
        foodList = json.loads(request.POST.get('foodList'))
        table_id = request.POST.get('table')

        # 创建订单
        new_order = Order(table=table_id, is_pay=False)
        new_order.save()
        order_id = new_order.ID

        for food in foodList:
            curFood = Food.objects.get(pk=food['id'])
            price = curFood.price
            sum_price = price * food['amount']
            OrderItem.objects.create(
                orderID=new_order,
                foodID=curFood,
                amount=food['amount'],
                sum_price=sum_price
            )

        return HttpResponse(json.dumps({
            'order_id': order_id
        }))


def QueryOrder(request, order_id):
    try:
        order = Order.objects.get(pk=order_id)
    except:
        return HttpResponse('无此订单！')

    foodList = Food.objects.filter(orderitem__orderID__ID=order_id)

    with connection.cursor() as cursor:
        SELECT_COL = 'OrderSystem_food.ID, OrderSystem_food.title, OrderSystem_orderitem.amount'
        SELECT_COL += ', OrderSystem_orderitem.sum_price '
        SELECT_FROM = 'OrderSystem_food, OrderSystem_orderitem '
        SELECT_WHERE = 'OrderSystem_food.ID=OrderSystem_orderitem.foodID_id '
        SELECT_WHERE += ' and OrderSystem_orderitem.orderID_id={0}'.format(
            order_id)
        cursor.execute(
            f'select {SELECT_COL} from {SELECT_FROM} where {SELECT_WHERE}')
        foodList = cursor.fetchall()
        foodJsonList = []
        for food in foodList:
            foo = {}
            foo['ID'] = food[0]
            foo['title'] = food[1]
            foo['amount'] = food[2]
            foo['sum_price'] = food[3]
            foodJsonList.append(foo)

    return render(
        request,
        'QueryOrder.html',
        {
            'order': order,
            'foodList': foodJsonList,
        }
    )
