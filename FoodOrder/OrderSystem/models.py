from django.db import models
from datetime import datetime


class Foodtype(models.Model):
    ID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)

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
    food_amount = models.IntegerField(default=0)
    total_price = models.FloatField(default=0)
    table_id = models.IntegerField(default=0)
    staff = models.ForeignKey(
        'Staff', on_delete=models.DO_NOTHING)     # 当时负责的员工

    def __str__(self):
        return 'Order ' + str(self.ID)


class OrderItem(models.Model):
    orderID = models.ForeignKey('Order', on_delete=models.CASCADE)
    foodID = models.ForeignKey('Food', null=True, on_delete=models.SET_NULL)
    amount = models.IntegerField(default=1)
    sum_price = models.FloatField(default=0)
    status = models.IntegerField(default=0, choices=(   # 0-后厨未接单  1-后厨在准备 2-等待上菜 3-上菜完成
        (0, '后厨未接单'), (1, '后厨在准备'), (2, '等待上菜'), (3, '上菜完成')))
    start_cook_time = models.TimeField(null=True)
    end_cook_time = models.TimeField(null=True)

    def __str__(self):
        return self.foodID.title + ' in Order ' + str(self.orderID.ID)


class Staff(models.Model):
    ID = models.AutoField(primary_key=True)         # 员工ID
    citizenID = models.CharField(max_length=20)     # 身份证件号
    name = models.CharField(max_length=10)
    gender = models.CharField(max_length=5, choices=(
        ('male', '男'), ('female', '女')), default='male')
    born_date = models.DateField(null=True)
    phone = models.CharField(max_length=11)
    address = models.CharField(max_length=50,default='')

    def __str__(self):
        return self.name


class Staff_Table(models.Model):
    ID = models.IntegerField(default=0, primary_key=True)
    name = models.CharField(max_length=20)
    staff = models.ForeignKey('Staff', on_delete=models.DO_NOTHING)

    def __str__(self):
        return str(self.ID) + ' ' + self.name
