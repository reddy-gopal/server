from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, request):
      
        raw_token = request.COOKIES.get('access_token')
        return raw_token
