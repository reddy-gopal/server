from django.urls import path
from .views import server_summary, server_list, server_usage, server_usage_time, Traffic_data, create_server, update_server, home

urlpatterns = [
    path("server/<int:server_id>/alerts/summary/", server_summary),
    path("servers/", server_list),
    path("server/<int:server_id>/usage/", server_usage),
    path("server/<int:server_id>/usage/", server_usage_time),
    path("servers/<int:server_id>/network_traffic/", Traffic_data),
    path("server/create/", create_server),
    path("server/update", update_server),
    path("", home)
]
