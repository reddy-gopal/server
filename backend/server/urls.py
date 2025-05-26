from django.urls import path
from .views import server_summary, server_list, server_usage, server_usage_time, traffic_data, create_server, update_server, home, add_alert
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, ProtectedView, RegisterView

urlpatterns = [
    path("server/<int:server_id>/alerts/summary/", server_summary),
    path("servers/", server_list),
    path("server/<int:server_id>/usage/", server_usage),
    path("server/<int:server_id>/use/", server_usage_time),
    path("servers/<int:server_id>/network_traffic/", traffic_data),
    path("server/create/", create_server),
    path("server/update/", update_server),
    path("", home),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/protected-endpoint/', ProtectedView.as_view(), name='protected-endpoint'),
]
