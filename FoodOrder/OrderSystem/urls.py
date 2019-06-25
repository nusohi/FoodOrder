from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.OrderHome, name='OrderHome'),
    re_path(r'q(?P<order_id>[\d]+)', views.QueryOrder),

]
