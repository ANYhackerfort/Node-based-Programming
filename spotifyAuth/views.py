from django.shortcuts import render
from urllib.parse import urlencode
from django.http import HttpResponseRedirect, JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from datetime import datetime
import requests

CLIENT_ID = '1bf5281abe5e4aceb363c18d59cd2a04'
CLIENT_SECRET = '534f28c4b4d740e78a349629b36c9de9'
REDIRECT_URL = 'http://127.0.0.1:8000/callback/'
AUTH_URL = 'http://localhost:5000/callback'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

def csrf_token_getter(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

@api_view(['GET'])
def login(request):
    scope = 'user-read-private user-read-email'
    params = {
            'response_type': 'code',
            'client_id': CLIENT_ID,
            'scope': scope,
            'redirect_uri': REDIRECT_URL,
    } 
    
    auth_url = f'https://accounts.spotify.com/authorize?{urlencode(params)}'
    print(auth_url)
    return JsonResponse({"authorization_link": auth_url})

@api_view(['GET'])
def redirect(request):
    code = request.GET.get('code', None)
    req_body = {
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URL,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json() 
    
    request.session['access_token'] = token_info['access_token']
    request.session['refresh_token'] = token_info['refresh_token']
    request.session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
    
    access_token = request.session.get('access_token')
    print("Access Token:", access_token)
    
    return JsonResponse({"successful": True})

@api_view(['GET'])
def refresh_token(request):
    if 'refresh_token' not in request.session:
        return JsonResponse({"redirect_link": 'http://127.0.0.1:8000/spotify/login/'}) #redirect link 
    
    if datetime.now().timestamp() > request.session['expires_at']:
        req_body = {
            'grant_type': 'refresh_token',
            'refresh_token': request.session['access_token'],
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        
        response = requests.post(TOKEN_URL, data=req_body)
        new_token_info = response.json(); 
        
        request.session['access_token'] = new_token_info['access_token']
        request.session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']
        
        return JsonResponse({"redirect_link": 'NA'}) #redirect link not needed
    
    
    