from django.db import models


class Food(models.Model):
    
    title = models.CharField(max_length=20)
    amount = models.IntegerField(default=0)
    price = models.FloatField(default=0)


    def __str__(self):
        return self.title

