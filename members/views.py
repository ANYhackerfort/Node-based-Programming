from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import logout, login, authenticate
from rest_framework.decorators import api_view
from django.conf import settings

def home(request):
    return HttpResponse('<h1>Login Page</h1')

@api_view(['POST'])
def register(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/username/')
    form = UserCreationForm(request.POST)
    if form.is_valid():
        form.save()
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return HttpResponseRedirect('/username/')  # Redirect to home page or another target page
        else:
            return HttpResponse("Authentication failed after registration.")

    return HttpResponse("User is not authenticated.")  

def logout_user(request):
    logout(request)
    return HttpResponse('<h1>Logged out!</h1>')

@api_view(['GET'])
def get_username(request):
    print('hi')
    if request.user.is_authenticated:
        print("sdf")
        # Return the username of the authenticated user
        print(request.user.username)
        return JsonResponse({"username": request.user.username})
    else:
        # Handle the case where the user is not authenticated
        return JsonResponse({"username": "anonymous user"})

@api_view(['POST'])
def login_view(request):
    # Set a test cookie to verify if cookies are working
    print(request.user)
    if request.user.is_authenticated:
        response = JsonResponse({'message': 'Already authenticated, but cookies are not working'}, status=200)
        return response 

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    print("Authenticated User:", user)  # Check if user is successfully authenticated

    if user is not None:
        login(request, user)
        response = JsonResponse({'message': 'Welcome', 'redirect': '/admin/'}, status=200)
        return response
    else:
        return JsonResponse({'error': 'Invalid username or password'}, status=400)

 

# Adjust the '/success/' URL to the actual URL you want to redirect the user to after a successful login.
