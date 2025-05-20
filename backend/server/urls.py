from django.urls import path
from .views import server_summary, server_list, server_usage, server_usage_time, traffic_data, create_server, update_server, home, add_alert

urlpatterns = [
    path("server/<int:server_id>/alerts/summary/", server_summary),
    path("servers/", server_list),
    path("server/<int:server_id>/usage/", server_usage),
    path("server/<int:server_id>/use/", server_usage_time),
    path("servers/<int:server_id>/network_traffic/", traffic_data),
    path("server/create/", create_server),
    path("server/update/", update_server),
    path("", home),
    path("add/alert/", add_alert)
]
