from django.urls import path
from . import views

urlpatterns = [
    path('api/get_snippets/', views.get_snippets, name='get_snippets'),
    path('api/create_snippet/', views.create_snippet, name='create_snippet'),
    path('api/create_user/', views.create_user, name='create_user'),
]