from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.response import Response
class PaymentViewset(viewsets.ModelViewSet):
    
    def  payment(self, request):
        return Response({'detail': 'Payment'}, status=status.HTTP_200_OK)        