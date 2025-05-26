from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from .models import Alert, Server, ResourceUsage, NetworkTraffic
from django.http import HttpResponse
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
@api_view(["GET"])
@permission_classes([AllowAny])

def home(request):
    return HttpResponse("Welcome to Home Page")

# views.py

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            # Determine if in development
            secure_setting = not settings.DEBUG  # Secure=True in production
            
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=secure_setting,
                samesite='Lax'
            )
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=secure_setting,
                samesite='Lax'
            )
            
        return response
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token missing'}, status=status.HTTP_401_UNAUTHORIZED)
            
        request.data['refresh'] = refresh_token
 
  
        return super().post(request, *args, **kwargs)
    


@permission_classes([AllowAny])
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'Logged out successfully'})
        
        # Clear cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def server_summary(request, server_id):
    if not server_id:
        return Response({
            "message": "Server id is Required.."
        }, status=400)
    server =  Server.objects.filter(id=server_id)
    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)

    alert_counts = Alert.objects.filter(server_id=server_id).values('severity').annotate(count=Count('severity'))
    summary = {"critical": 0, "medium": 0, "low": 0}
    for item in alert_counts:
        severity = item['severity']
        count = item['count']
        summary[severity] = count

    return Response(summary)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated]) 
def server_list(request):
    servers = list(Server.objects.all())
    data = []
    for server in servers:
        data.append({
            "id": server.id,
            "name": server.name,
            "ip_address": server.ip_address,
            "location": server.location,
            "description": server.description,
            "tag": server.tag,
            "created_at": server.created_at
        })
    return Response(data)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def server_usage(request, server_id):
    if not server_id:
        return Response({
            "message": "Server id is Required.."
    }, status=400)
    server =  Server.objects.filter(id=server_id)

    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)

    Usage = list(ResourceUsage.objects.filter(server_id = server_id).order_by('-timestamp'))[0]
    data2 = []
  
    data2.append({
        "timestamp": Usage.timestamp,
        "cpu_usage_percent": Usage.cpu_usage_percent,
        "ram_usage_percent": Usage.ram_usage_percent,
        "disk_usage_percent": Usage.disk_usage_percent,
        "app_usage_percent": Usage.app_usage_percent

    })
    return Response(data2)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated]) 
def server_usage_time(request, server_id):
    if not server_id:
        return Response({
            "message": "Server id is Required.."
    }, status=400)
    server =  Server.objects.filter(id=server_id)

    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)
    startDate = request.GET.get("start")
    endDate = request.GET.get("end")
    if not startDate or not endDate:
        return Response({"message": "start and end query parameters are required."}, status=400)

   
    
    usage = list(ResourceUsage.objects.filter(server_id=server_id, timestamp__gt=startDate, timestamp__lt=endDate).order_by('-timestamp'))  

    data = [] 
    for source in usage:
        data.append({
            "timestamp": source.timestamp,
            "cpu": source.cpu_usage_percent,
            "ram": source.ram_usage_percent,
            "disk": source.disk_usage_percent,
             "app": source.app_usage_percent
        })
    return Response(data, status=200)
class ProtectedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello {request.user.username}!'})
@api_view(["GET"])
def traffic_data(request, server_id):
    if not server_id:
        return Response({
            "message": "Server id is Required.."
        }, status=400)
    server =  Server.objects.filter(id=server_id)

    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)


    startDate = request.GET.get("start")
    endDate = request.GET.get("end")
    Network = list(NetworkTraffic.objects.filter(server_id = server_id, timestamp__gt = startDate, timestamp__lt = endDate).order_by('-timestamp'))
    data = []
    for source in Network:
        data.append({
             "timestamp": source.timestamp,
              "incoming_traffic_mb": source.incoming_traffic_mb,

        })
    return Response(data, status=200)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])

def create_server(request):
    data = request.data
    
    server = Server.objects.create(
    name=data["name"],
    ip_address=data["ip_address"],
    location=data["location"],
    description=data.get("description", ""),
    tag=data.get("tag", "")
    )
    return Response({"message": "Server created", "id": server.id}, status=201)
    


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])

def update_server(request, server_id):
    if not server_id:
        return Response({
            "message": "server id is required for deletion.."
        }, status=400)
    server =  Server.objects.filter(id=server_id)

    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)
  
    server = Server.objects.get(id=server_id)
    data = request.data
    server.name = data.get("name", server.name)
    server.ip_address = data.get("ip_address", server.ip_address)
    server.location = data.get("location", server.location)
    server.description = data.get("description", server.description)
    server.tag = data.get("tag", server.tag)
    server.save()

    return Response({"message": "Server updated"})

@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])

def delete_server(request, server_id):
    if not server_id:
        return Response({
            "message": "server id is required for deletion.."
        }, status=400)
    server =  Server.objects.filter(id=server_id)

    if not server.exists():
        return Response({
            "message": f"No server found with ID {server_id}."
        }, status=404)
   
    server.delete()
    return Response({
        "message": f"Server {server.name} is deleted Successfully..."
    }, status=200)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def add_alert(request):
    data = request.data
    server_id = data.get("server_id")
    
    server = Server.objects.get(pk = server_id)
    alert = Alert.objects.create(
        server_id = server,
        severity = data.get("severity"),
        message = data.get("message"),
        created_at = data.get("created_at")  

    )
    return Response({"message": "Alert created", "id": alert.id}, status=201)




