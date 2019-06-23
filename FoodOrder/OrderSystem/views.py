from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def OrderHome(request):
    return render(
        request,
        'OrderHome.html'
    )