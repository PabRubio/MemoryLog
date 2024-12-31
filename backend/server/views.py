from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from firebase_admin import auth as firebase_auth
from .models import Snippet
import json

@csrf_exempt
def create_snippet(request):
    if request.method == "POST":
        id_token = request.headers.get('Authorization')
        if not id_token:
            return JsonResponse({"error": "Authorization header missing"}, status=401)
        
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_user_id = decoded_token.get('uid')

            user = User.objects.get(username=firebase_user_id)
            
            data = json.loads(request.body)
            snippet = Snippet.objects.create(
                user=user,
                image=data['image'],
                caption=data['caption'],
                emoji=data['emoji']
            )
            return JsonResponse({"id": snippet.id, "message": "Snippet created"}, status=201)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_snippets(request):
    id_token = request.headers.get('Authorization')
    if not id_token:
        return JsonResponse({"error": "Authorization header missing"}, status=401)
    
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        firebase_user_id = decoded_token.get('uid')

        user = User.objects.get(username=firebase_user_id)

        snippets = Snippet.objects.filter(user=user)
        data = [
            {
                "date": snippet.date,
                "image": snippet.image,
                "caption": snippet.caption,
                "emoji": snippet.emoji
            }
            for snippet in snippets
        ]
        return JsonResponse(data, safe=False, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            id_token = body.get('idToken')

            if not id_token:
                return JsonResponse({"error": "ID token not provided"}, status=400)

            decoded_token = firebase_auth.verify_id_token(id_token)
            firebase_user_id = decoded_token.get('uid')
            email = decoded_token.get('email')

            user, created = User.objects.get_or_create(username=firebase_user_id)
            if created:
                user.email = email
                user.save()

            return JsonResponse({"message": "User created successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)