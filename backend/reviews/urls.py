from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'review images', views.ReviewImageViewSet, basename='reviewimage')

urlpatterns = [
    path('', include(router.urls)),
]