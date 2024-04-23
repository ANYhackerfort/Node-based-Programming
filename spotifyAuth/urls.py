from django.urls import path
from . import views
urlpatterns = [
    path("login/", views.login, name='spotify_login'), 
    path("callback/", views.redirect, name='spotify_callback'),
    path("refresh_token/", views.refresh_token, name='freshtoken')
    ]