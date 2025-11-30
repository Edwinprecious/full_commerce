from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from decimal import Decimal
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer, CartItemCreateSerializer, OrderDetailsSerializer,
    OrderSerializer, OrderCreateSerializer
)

from products.models import Product, ProductVariant

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    def list(self, request, *arqs, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)
    
    # def get_serializer(self, *args, **kwargs):
    def get_serializer_class(self):
        if self.action == 'create':
            return CartItemCreateSerializer
        return CartItemSerializer
    
    def create(self, request, *arqs, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, created = Cart.objects.get_or_create(user=request.user)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
        variant = serializer.validated_data.get('variant_id')

        if variant:
            variant = get_object_or_404(ProductVariant, id=variant, product=product)

        # Checking if item already exists in the cart 

        existing_item = CartItem.objects.filter(
            cart=cart,
            product=product,
            variant=variant
        ).first()

        if existing_item:
            existing_item.quantity += serializer.validated_data['quantity']
            existing_item.save()
            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                variant=variant,
                quantity=serializer.validated_data['quantity']
            )
            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)\
        
class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == "retrieve":
            return OrderDetailsSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            print(serializer.validated_data)

            cart = get_object_or_404(Cart, user=request.user)
            cart_items = cart.items.all()

            if not cart_items:
                return Response(
                    {'detail': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            print(cart_items)
            
            # Calculating totals
            subtotal = Decimal(sum(item.total_price for  item in cart_items))
            # tax_amount = subtotal * 0.1 # 10% tax
            tax_amount = subtotal *  Decimal("0.10")   # 10% tax
            # shipping_cost = 10.00 # fixed shipping for  now 
            shipping_cost = Decimal("10.00")  # fixed shipping for  now 
            total = subtotal + tax_amount + shipping_cost

            # create order
            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                tax_amount=tax_amount,
                shipping_cost=shipping_cost,
                total=total,
                shipping_address=serializer.validated_data['shipping_address'],
                billing_address=serializer.validated_data['billing_address'],
                payment_method=serializer.validated_data['payment_method'],
                notes=serializer.validated_data.get('notes', "")
            )

            # Create order items
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    variant=cart_item.variant,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.unit_price,
                    total_price=cart_item.total_price
                )

            # Updating product quantity

                if cart_item.variant:
                    cart_item.variant.quantity -= cart_item.quantity
                    cart_item.variant.save()
                else:
                    cart_item.product.quantity -= cart_item.quantity
                    cart_item.product.save()

            # clear cart
            cart.items.all().delete()

            # return order details
            order_serializer = OrderDetailsSerializer(order)
            return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print("Order creation failed:", e)
            return Response(
                {"detail": "An error occurred while placing the order."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.status not in ['pending', 'confirmed']:
            return Response(
                {'detail': 'order cannot be cancelled at this stage. '},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'cancelled'
        order.save()

        # Restore product quantities 
        for order_item in order.items.all():
            if order_item.variant:
                order_item.variant.quantity += order_item.quantity
                order_item.variant.save()

            else:
                order_item.product.quantity += order_item.quantity
                order_item.product.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
        