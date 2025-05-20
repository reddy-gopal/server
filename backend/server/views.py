from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import Alert, Server, ResourceUsage, NetworkTraffic
from django.http import HttpResponse


@api_view(["GET"])
def server_summary(request, server_id):
   
    server = Server.objects.get(id=server_id)
    alert_counts = Alert.objects.filter(server=server).values('severity').annotate(count=Count('severity'))
    summary = {"critical": 0, "medium": 0, "low": 0}
    for item in alert_counts:
        severity = item['severity']
        count = item['count']
        summary[severity] = count

    return Response(summary)

@api_view(["GET"])
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
def server_usage(request, server_id):
    server = Server.objects.get(id = server_id)
    Usage = list(ResourceUsage.objects.filter(server = server))
    data2 = []
    for source in Usage:
        data2.append({
             "timestamp": source.timestamp,
             "cpu_usage_percent": source.cpu_usage_percent,
              "ram_usage_percent": source.ram_usage_percent,
              "disk_usage_percent": source.disk_usage_percent,
            "app_usage_percent": source.app_usage_percent

        })
    return Response(data2)
@api_view(["GET"])
def server_usage_time(request, server_id):
    server = Server.objects.get(id = server_id)
    startDate = request.GET.get("start")
    endDate = request.GET.get("end")
    usage = list(ResourceUsage.objects.filter(server=server, timestamp__gt=startDate, timestamp__lt=endDate).order_by('timestamp'))  

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

@api_view(["GET"])
def Traffic_data(request, server_id):
    server = Server.objects.get(id = server_id)
    startDate = request.GET.get("start")
    endDate = request.GET.get("end")
    Network = list(NetworkTraffic.objects.filter(server = server, timestamp__gt = startDate, timestamp__lt = endDate))
    data = []
    for source in Network:
        data.append({
             "timestamp": source.timestamp,
              "incoming_traffic_mb": source.incoming_traffic_mb,

        })
    return Response(data, status=200)


@api_view(["POST"])
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
def update_server(request, server_id):
  
    server = Server.objects.get(id=server_id)
    data = request.data
    server.name = data.get("name", server.name)
    server.ip_address = data.get("ip_address", server.ip_address)
    server.location = data.get("location", server.location)
    server.description = data.get("description", server.description)
    server.tag = data.get("tag", server.tag)
    server.save()

    return Response({"message": "Server updated"})
    


@api_view(["GET"])
def home(request):
    return HttpResponse("Welcome to Home Page")


