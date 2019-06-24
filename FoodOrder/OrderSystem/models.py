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
    foodTypeID = models.ForeignKey(
        'Foodtype', to_field="ID", on_delete=models.PROTECT)

    def __str__(self):
        return self.title
