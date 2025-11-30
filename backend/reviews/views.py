from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Count, Avg
from .models import Review, ReviewImage, ReviewVote
from .serializers import(
    ReviewSerializer, ReviewCreateSerializer, ReviewImageSerializer, ReviewVoteSerializer
)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Review.objects.all().select_related('user', 'product')
        return Review.objects.filter(is_approved=True).select_related('user', 'product')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        # Check if user has purchased the product
        from orders.models import OrderItem
        has_purchased = OrderItem.objects.filter(
            order_user=self.request.user,
            order_payment_status='paid',
            product=serializer.validated_data['product']
        ).exists()

        serializer.save(
            user=self.request.User,
            is_verified=has_purchased
        )
    
    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        review = self.get_object()
        serializer = ReviewVoteSerilizer(data=request.data)

        if serializer.is_valid():
            vote_type = serializer.validated_data['vote_type']

            # Check if User already voted 

            existing_vote = ReviewVote.objects.filter(
                review=review,
                user=request.user
            ).first()

            if existing_vote:
                if existing_vote.vote_type == vote_type:
                    # Remove vote if same type 
                    existing_vote.delete()
                    message = 'Vote removed'

                else:

                    # Update vote
                    existing_vote.vote_type = vote_type
                    existing_vote.save()
                    message = 'Vote Updated'

            else:
                # Create new Vote
                ReviewVote.objects.create(
                    review=review,
                    user=request.user,
                    vote_type=vote_type
                )
                message = 'Vote added'

                # Update Counts 
                review.helpful_yes = review.votes.filter(vote_type='helpful').count()
                review.helpful_no = review.votes.filter(vote_type='not_helpful').count()
                review.save()

                return Response({
                    'message': message,
                    'helpful_yes': reviw.helpful_yes,
                    'helpful_no': review.helpful_no
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ReviewImageViewSet(viewsets.ModelViewSet):
    queryset = ReviewImage.objects.all()
    serializer_class=ReviewImageSerializer
    permission_classes= [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(review_user=self.request.user)