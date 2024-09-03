from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json

def validate_credentials(request, username, password):
    user = authenticate(request=request, username=username, password=password)

    print("\nValidating Credentials...");
    print("\nUser object:", user)

    if user is not None and user.is_superuser:
        print("\nValid Credentials...");
        login(request, user)
        return True
    else:
        print("\nInvalid Credentials...");
        return False
    
@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            print("\nReceived credentials:", username, password);
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)
    
        if validate_credentials(request, username, password):
            print("\nSending response...");
            return JsonResponse({'success': True}, content_type='application/json', status=200)
        else:
            return JsonResponse({'success': False})

    else:
        return JsonResponse({'success': False, "message": "Invalid request method"}, status=405)

    