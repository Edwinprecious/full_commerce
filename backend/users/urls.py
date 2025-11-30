from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .import views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'', views.AuthViewSet, basename='auth')
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'addresses', views.AddressViewSet, basename='address')

urlpatterns = [
    path('', include(router.urls)),
    # Add JWT token endpoint 

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]