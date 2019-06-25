from django.db import models


class Foodtype(models.Model):
    ID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Food(models.Model):
    ID = models.AutoField(primary_key=True)
    title = models.CharField(max_length=20)
    amount = models.IntegerField(default=0)
    price = models.FloatField(default=0)
    cost_time = models.IntegerField(default=0)
    foodType = models.ForeignKey(
        'Foodtype', to_field="ID", on_delete=models.PROTECT)

    def __str__(self):
        return self.title


class Order(models.Model):
    ID = models.AutoField(primary_key=True)
    create_time = models.DateTimeField(auto_now_add=True)
    pay_time = models.DateTimeField(null=True)
    is_pay = models.BooleanField(default=False)
    table_id = models.IntegerField(default=0)
    food_amount=models.IntegerField(default=0)
    total_price = models.FloatField(default=0)

    def __str__(self):
        return 'Order ' + str(self.ID)


class OrderItem(models.Model):
    orderID = models.ForeignKey('Order', on_delete=models.CASCADE)
    foodID = models.ForeignKey('Food', on_delete=models.PROTECT)
    amount = models.IntegerField(default=1)
    sum_price = models.FloatField(default=0)

    def __str__(self):
        return self.foodID.title + ' in Order ' + str(self.orderID.ID)
