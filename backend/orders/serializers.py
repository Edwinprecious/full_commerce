from decimal import Decimal
from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from products.serializers import ProductListSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'

class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1)

    def validate_product_id(self, value):
        from products.models import Product

        try:
            Product.objects.get(id=value, status='active')
        except Product.DoesNotExist:
            raise serializers.ValidationError("product not found or not active")
        return value
    
    def validate_varient(self, value):
        if value:
            from products.models import ProductVariant
            try:
                ProductVariant.objects.get(id=value)
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError("Product varient not found")
            return value

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.SerializerMethodField()
    shipping_cost = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'tax_amount', 'shipping_cost', 'discount_amount', 'total', 'created_at', 'updated_at']

    def get_tax_amount(self, obj):
        return round(Decimal(obj.subtotal) * Decimal("0.10"), 2)

    def get_shipping_cost(self, obj):
        return 0.0 if obj.subtotal >= 50.0 else 10.00

    def get_discount_amount(self, obj):
        return 0.00

    def get_total(self, obj):
        # return obj.subtotal
        subtotal = obj.subtotal
        tax = self.get_tax_amount(obj)
        shipping = self.get_shipping_cost(obj)
        discount = self.get_discount_amount(obj)
        total = Decimal(subtotal) + Decimal(tax) + Decimal(shipping) - Decimal(discount)
        return round(total, 2)

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)


    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'subtotal', 'tax_amount', 'shipping_cost',
            'discount_amount', 'total', 'status', 'payment_status',
            'ordered_at', 'created_at', 'items'
        )

class OrderDetailsSerializer(OrderSerializer):
    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + (
            'shipping_address', 'billing_address', 'payment_method',
            'transaction_id', 'shipped_at', 'delivered_at', 'notes'
        )

# class OrderCreateSerializer(serializers.Serializer):
#     shipping_address= serializers.JSONField()
#     billing_address= serializers.JSONField()
#     payment_method = serializers.CharField()
#     notes = serializers.CharField(required=False, allow_blank=True)

#     def validate_shipping_address(self, value):
#         required_fields = ['street_address', 'city', 'state', 'country', 'postal_code']
#         for field in required_fields:
#             if field not in value or not value[field]:
#                 raise serializers.ValidationError(f"Shipping address {field} is required.")
#         return value
    
#     def validate_billing_address(self, value):
#         required_fields = ['street_address', 'city', 'state', 'country', 'postal_code']
#         for field in required_fields:
#             if field not in value or not value[field]:
#                 raise serializers.ValidationError(f"Billing address {field} is required")
#         return value
        
#     def validate(self, data):
#         billing = data.get("billing_address", {})
#         if billing.get("same_as_shipping"):
#             data["billing_address"] = data["shipping_address"]
#         return data
    

class OrderCreateSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    billing_address = serializers.JSONField()
    payment_method = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # If billing says "same_as_shipping", copy shipping over
        billing = data.get("billing_address", {})
        if billing.get("same_as_shipping"):
            data["billing_address"] = data["shipping_address"]

        # Now enforce required fields
        required_fields = ['street_address', 'city', 'state', 'country', 'postal_code']
        for field in required_fields:
            if field not in data["shipping_address"] or not data["shipping_address"][field]:
                raise serializers.ValidationError(
                    { "shipping_address": f"{field} is required." }
                )
            if field not in data["billing_address"] or not data["billing_address"][field]:
                raise serializers.ValidationError(
                    { "billing_address": f"{field} is required." }
                )

        return data
