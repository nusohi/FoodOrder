from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.OrderHome, name='OrderHome'),
    # re_path(r'^(?P<slug>[\w-]+)/', views.article_detail,
    #         name='article-detail'),
]