from django.db import models
from django.utils import timezone

class Server(models.Model):
    name = models.CharField(max_length=100, null=False)
    ip_address = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    description = models.TextField()
    tag = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f"{self.name} - {self.ip_address}" 


class Alert(models.Model):
    server_id = models.ForeignKey(Server, on_delete=models.CASCADE)
    SEVERITY_LEVEL = [
     ("low", "Low"),
    ("medium", "Medium"),
    ("critical", "Critical"),
    ]
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVEL)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
       return f"{self.server_id} - {self.severity}"
        
          

class ResourceUsage(models.Model):
    server_id = models.ForeignKey(Server, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=False) 
    cpu_usage_percent = models.DecimalField(max_digits=5, decimal_places=2)
    ram_usage_percent = models.DecimalField(max_digits=5, decimal_places=2)
    disk_usage_percent = models.DecimalField(max_digits=5, decimal_places=2)
    app_usage_percent = models.DecimalField(max_digits=5, decimal_places=2)
    def __str__(self):
        return f"{self.server_id.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

class NetworkTraffic(models.Model):
    server_id = models.ForeignKey(Server, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=False)  
    incoming_traffic_mb = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.server_id} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {self.incoming_traffic_mb} MB"
    
