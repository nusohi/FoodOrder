from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout


@csrf_exempt
def signup(request):
    if request.method == "GET":
        print('GET SIGN UP page!============================================')
        form = UserCreationForm()
        return render(request, 'signup.html', {
            'form': form,
        })

    elif request.method == "POST":
        return_form = UserCreationForm(request.POST)
        if return_form.is_valid():
            user = return_form.save()
            login(request, user)
            print('注册成功！')
            return redirect('/manage/')
        else:
            form = UserCreationForm()
            print('注册失败！')
            return render(request, 'signup.html', {
                'form': form,
            })


@csrf_exempt
def signin(request):
    form = AuthenticationForm()

    if request.method == "POST":
        return_form = AuthenticationForm(data=request.POST)
        print(return_form)
        if return_form.is_valid():
            user = return_form.get_user()
            login(request, user)
            next_url = request.POST.get('next')
            return redirect(next_url)

    next = request.GET.get('next')
    return render(request, 'signin.html', {
        'form': form,
        'next': next,
    })


@csrf_exempt
def signout(request):
    logout(request)
    return redirect('/')
