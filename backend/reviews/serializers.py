from rest_framework import serializers 
from .models import Review, ReviewImage, ReviewVote
from users.serializers import UserProfileSerializer
from products.serializers import ProductListSerializer


class ReviewImageSerializer(serializers.ModelSerializer):
    class meta:
        model = ReviewImage
        fields = '_all_'

class ReviewVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewVote
        fields = ('vote_type',)

    def validate_vote_type(self, value):
        if value not in ['helpful', 'not_helpful']:
            raise serializers.ValidationError('Invalid vote type.')
        return value
    
class ReviewSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    can_edit = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fiellds =(
            'id', 'product', 'user', 'rating', 'title', 'comment',
            'is_verified', 'is_approved', 'helpful_yes', 'helpful_no',
            'images', 'can_edit', 'user_vote', 'created_at', 'updated_at'
        )

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('product', 'rating', 'title', 'comment')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be tween 1 and 5.")
        return value
    
    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user:
            # Check if user already reviewed this product
            existing_review = Review.objects.filter(
                product = attrs['product'],
                user=request.user
            ).exists()

            if existing_review:
                raise serializers.ValidationError(
                    "You have already reviewed this product."
                )
            return attrs
    
    def get_can_edit(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.user == request.user
        return False
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = obj.votes.filter(user=request.user).first()
            return vote.vote_type if vote else None
        return None
    
class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fileds= ('product', 'rating', 'title', 'comment')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
    
    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user:
            # Check if user already reviewed this product
            existing_review = Review.objects.filter(
                product=attrs['product'],
                user=request.user
            ).exists()