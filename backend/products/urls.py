from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewset, basename='category')
router.register(r'products', views.ProductViewset, basename='product')
router.register(r'products-images', views.ProductImageViewset, basename='productimage')
router.register(r'products-variants', views.ProductVariantViewset, basename='productvariant')
router.register(r'reviews', views.ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]