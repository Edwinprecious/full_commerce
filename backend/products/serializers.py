from rest_framework import serializers
from reviews.models import Review
from .models import Product, ProductImage, ProductAttribute, ProductVariant, Category
from users.serializers import UserProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    Product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_Product_count(self, obj):
        return obj.products.filter(status='active').count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'

class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    discounted_percentage = serializers.ReadOnlyField()
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)                         

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'short_description', 'compare_price',  'price',  'primary_image', 'discounted_percentage', 'in_stock', 'featured', 'vendor', 'category', 'average_rating', 'review_count', 'vendor_name', 'created_at', 
        )

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ProductImageSerializer(primary_image).data
        return None
       
class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    Category_details = CategorySerializer(source='category', read_only=True)       

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ('images', 'description', 'attributes', 'variants', 'Category_details', 'quantity', 'sku', 'barcode', 'weight', 'dimensions', 'meta_title', 'meta_description', 'created_at', 'updated_at')


class ReviewSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            'id', 'user', 'product', 'rating', 'title','comment', 'is_verified', 'is_approved', 'helpful_yes', 'helpful_no', 'can_edit', 'created_at', 'updated_at', 'product_name', 'can_edit'
        )

    def get_can_edit(self, obj):
            request = self.context.get('request')
            if request and request.user:
                return obj.user == request.user
            return False

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('rating', 'title', 'comment')

    def validate_rating(self, value):        
            if value < 1 or value > 5:
                raise serializers.ValidationError("Rating must be between 1 and 5.")
            return value