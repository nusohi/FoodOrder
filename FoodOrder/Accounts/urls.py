from django.urls import path
from . import views


urlpatterns = [
    path('signin/', views.signin),
    path('signup/', views.signup),
    path('signout/', views.signout),
]
