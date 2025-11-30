from django.shortcuts import get_object_or_404, render

# Create your views here.
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Count
# from pagination import ProductPagination

from reviews.models import Review
from backend.pagination import FlexibleNamedPagination
from .models import Product, ProductImage, ProductVariant, Category
from .serializers import ( ProductListSerializer, CategorySerializer, ProductImageSerializer, ProductDetailSerializer, ProductVariantSerializer, ReviewSerializer, ReviewCreateSerializer )
from .filters import ProductFilter
# from .pagination import ProductPagination

class CategoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    resource_name = 'categories'
    pagination_class = FlexibleNamedPagination

    @action(detail=False, methods=['get'])
    def products(self, request, slug=None):
        Category = self.get_object()
        Products = Product.objects.filter(
            category=Category,
            status='active'
        )

        #Apply filtering 
        Product_filter = ProductFilter(request.GET, queryset=Products)
        filtered_products = Product_filter.qs

        #paginate
        pagination = ProductPagination()
        page = pagination.paginate_queryset(filtered_products, request)

        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return pagination.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(filtered_products, many=True)
        return Response(serializer.data)
    

class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.filter(status='active').order_by('-id')
    # permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    # pagination_class = FlexibleNamedPagination
    # resource_name = 'products'
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    # def get_queryset(self):
    #     queryset = super().get_queryset()

    #     # Annotate with average rating and review count
    #     queryset = queryset.annotate(
    #         average_rating=Avg('reviews__rating'),
    #         review_count=Count('reviews')
    #     )
    #     return queryset 
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        product = self.get_object()
        related_products = Product.objects.filter(
            category=product.category,
            status='active'
        ).exclude(id=product.id)[:8]
        # .annotate(
            # average_rating=Avg('reviews__rating'),
            # review_count=Count('reviews')
        # )

        serializer = ProductListSerializer(related_products, many=True)
        return Response(serializer.data)
    
    # @action(detail=True, methods=['get', 'post'])
    # def reviews(self, request, slug=None):
    #     product = self.get_object()

    #     if request.method == 'GET':
    #         reviews = Review.objects.filter(
    #             product= product,
    #             is_approved=True
    #         ).select_related('user')

    # @action(detail=True, methods=["get", "post"])
    # def reviews(self, request, slug=None):
    #     review = get_object_or_404(Review, slug=slug)
    #     self.check_object_permissions(request, review)
    #     review = self.get_object()

    #     if request.method == "GET":
    #         reviews = Review.objects.filter(
    #             review=review,
    #         ).select_related("user")

    #         # Calculate rating distribution
    #         rating_distribution = reviews.values("rating").annotate(
    #             count=Count("id")
    #         )

    #         distribution_dict = {i: 0 for i in range(1, 6)}
    #         for item in rating_distribution:
    #             distribution_dict[item["rating"]] = item["count"]

    #         # Paginate reviews
    #         paginator = ProductPagination()
    #         page = paginator.paginate_queryset(reviews, request)
    #         if page is not None:
    #             serializer = ReviewSerializer(page, many=True)
    #             response_data = {
    #                 "count": reviews.count(),
    #                 # "reviews": serializer.data,
    #                 "average_rating": reviews.aggregate(avg=Avg("rating"))["avg"] or 0,
    #                 "rating_distribution": distribution_dict,
    #                 'results': serializer.data
    #             }
    #             return paginator.get_paginated_response(response_data)

    #         serializer = ReviewSerializer(reviews, many=True)
    #         return Response({
    #             'count': reviews.count(),
    #             'average_rating': reviews.aggregate(avg=Avg('rating'))['avg'] or 0,
    #             'rating_distribution': distribution_dict,
    #             'reviews': serializer.data
    #         })

    #     elif request.method == 'POST':
    #             # Check if user already reviewed this product
    #             existing_review = Review.objects.filter(
    #                 product=product,
    #                 user=request.user
    #             ).first()


    #             if existing_review:
    #                 return Response({
    #                     'detail': 'You have already reviewed this product.'}, 
    #                     status=status.HTTP_400_BAD_REQUEST
    #                 )

    #             serializer = ReviewCreateSerializer(data=request.data)
    #             if serializer.is_valid():
    #                 serializer.save(product=product, user=request.user)
    #                 return Response(serializer.data, status=status.HTTP_201_CREATED)
    #             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductImageViewset(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductVariant.objects.all()
    permission_classes = [IsAuthenticated]                

    def get_queryset(self):
        return self.queryset.filter(product__vendor=self.request.user)
    
class ProductVariantViewset(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(product__vendor=self.request.user)    
    
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

    def get_queryset(self):
        if self.request.user.is_staff:
            return Review.objects.all()
        return Review.objects.filter(is_approved=True)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        review = self.get_object()
        vote_type = request.data.get('vote_type')    

        if vote_type not in ['helpful', 'not_helpful']:
            return Response(
                {'detail': 'Invalid vote type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        #check if user already voted 
        existing_vote = review.votes.filter(user=request.user).first()

        if existing_vote:
            if existing_vote.vote_type == vote_type:
                #remove vote if same type clicked again 
                existing_vote.delete()
                message = 'Vote removed'
            else:
                #update vote if different type
                existing_vote.vote_type = vote_type
                existing_vote.save()
                message = 'Vote updated'
        else:
            #create new vote
            review.votes.create(user=request.user, vote_type=vote_type)
            message = 'Vote created'

        #update vote counts
        review.helpful_yes = review.votes.filter(vote_type='helpful').count()
        review.helpful_no = review.votes.filter(vote_type='not_helpful').count()
        review.save()

        return Response({
            'message': message,
            'helpful_yes': review.helpful_yes,
            'helpful_no': review.helpful_no
        })

        