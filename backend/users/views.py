from rest_framework import viewsets, status
from rest_framework.decorators import action
import logging
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth  import authenticate, get_user_model
from .models import Address
from .serializers import (
    AddressSerializer, UserProfileSerializer, UserRegistrationSerializer, UserLoginSerializer, UserLoginSerializer, 
)

logger = logging.getLogger(__name__)
User = get_user_model()
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):

        try:
            logger.debug("Request data: %s", request.data)
        except Exception as e:
            logger.exception("could not read request.data: %s", e)    
            raw = getattr(request, 'body', b'')[:1000]
            logger.debug("Raw data: %s", raw)
        
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning("Registration serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(
                {'detail': 'Invalid username or email'},
                status= status.HTTP_401_UNAUTHORIZED
            )
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)

            logger.debug(f"Login attemp for email: {email}")

            try:
                # Look up user by email
                user = User.objects.get(email=email)

                # Check if password is correct
                if user.check_password(password):
                    # Check if user is active
                    if not user.is_active:
                        return Response(
                            {'etails': 'Account is disable'},
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                    # Generate token
                    refresh = RefreshToken.for_user(user)

                    logger.info(f"Successful login for user: {email}")

                    return Response({
                        'user': UserProfileSerializer(user).data,
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    logger.warning(f"Invalid password for user: {email}")
                    return Response(
                        {'detail': 'Invalid credentials' },
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except User.DoesNotExist:
                logger.warning(f"Login attempt for non-existent user: {email}")
                # Return same error message to prevent user enumeration

                return Response(
                    {'details': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        #     if user:
        #         refresh = RefreshToken.for_user(user)
        #         return Response({
        #             'user': UserProfileSerializer(user).data,
        #             'refresh': str(refresh),
        #             'access': str(refresh.access_token),
        #         })
        #     return Response(
        #         {'detail': 'Invalid credentials'},
        #         status= status.HTTP_401_UNAUTHORIZED
        #     )
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Successfully logged out'})
        except Exception as e:
             return Response(
                {'details': f'Invalid token: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def update(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)