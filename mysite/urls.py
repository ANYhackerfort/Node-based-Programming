"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from members import views as member_views
from spotifyAuth import views as spotifyAuthz

from django.shortcuts import render
from django.conf import settings
from django.views.generic import TemplateView

def index_view(request, **kwargs):
    return render(request, 'dist/index.html')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("spotify_space/", include('playground.urls')),
    path("members/", include('members.urls')),
    path("spotify/", include('spotifyAuth.urls')),
    path("callback/", spotifyAuthz.redirect, name='callback'),
    path("register/", member_views.register, name='register'),
    path("logout/", member_views.logout_user, name='logout'),
    path("username/", member_views.get_username, name='username'),
    path("login/", member_views.login_view, name='login'),
    path("csrf/", spotifyAuthz.csrf_token_getter,name='csrf'),
    path("", index_view, name='index'),  # Serve React app at root
    re_path(r'^(?P<path>.*)$', index_view, name='otherpaths'), # Catch-all for React Router paths
]
