# import generic views
from rest_framework import generics, mixins

# import knox login view
from knox.views import LoginView as KnoxLoginView

from rest_framework.authentication import BasicAuthentication
from rest_framework.pagination import PageNumberPagination

# import models
from imageapp.models import Image, Tag, Comment, Report, Profile
from django.contrib.auth.models import User

# import serializers
from imageapp.serializers import ImageListSerializer, ImageDetailSerializer, TagSerializer, CommentSerializer, ReportSerializer, UserSerializer, \
    ProfileSerializer, RegisterSerializer, ImageActivateSerializer

# import permissions
from imageapp.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny

from rest_framework import status
from rest_framework.response import Response

from rest_framework import filters


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class ImageList(generics.ListCreateAPIView):
    queryset = Image.objects.filter(active=True)
    serializer_class = ImageListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['=tag__name']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)


# Lists all images of particular user
class UserImageView(generics.ListAPIView):
    serializer_class = ImageListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile = self.request.user.profile
        return Image.objects.filter(owner=profile)


class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]


class ImageActivate(generics.GenericAPIView, mixins.ListModelMixin, mixins.DestroyModelMixin):
    queryset = Image.objects.filter(active=False)
    serializer_class = ImageActivateSerializer
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = True
        instance.save()

        return Response(status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        return self.destroy(self, request, *args, **kwargs)


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = LargeResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminUser]  # [AllowAny]


class ProfileView(generics.GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        instance = self.get_queryset().first()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def patch(self, request):
        queryset = self.get_queryset()
        profile = queryset.first()
        serializer = self.get_serializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Profile picture updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.filter(user=user)


class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]  # [IsOwnerOrReadOnly]


class ReportList(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]  # [IsAuthenticated]


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]  # [IsAdminUser]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# overriding default knox login view to allow BasicAuthentication
class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
