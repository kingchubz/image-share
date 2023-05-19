# import generic views
from rest_framework import generics, mixins

# import knox login view
from knox.views import LoginView as KnoxLoginView

from rest_framework.authentication import BasicAuthentication

# import models
from imageapp.models import Image, Tag, Comment, Report, Profile
from django.contrib.auth.models import User

# import serializers
from imageapp.serializers import ImageListSerializer, ImageDetailSerializer, TagSerializer, CommentSerializer, ReportSerializer, UserSerializer, \
    ProfileSerializer, RegisterSerializer, ImageActivateSerializer

# import permissions
from imageapp.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny


class ImageList(generics.ListCreateAPIView):
    queryset = Image.objects.filter(active=True)
    serializer_class = ImageListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    queryset = Image.objects.filter(active=True)
    serializer_class = ImageDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]


class ImageActivate(generics.GenericAPIView, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Image.objects.filter(active=False)
    serializer_class = ImageActivateSerializer
    permission_classes = [IsAdminUser]


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]  # [IsAuthenticatedOrReadOnly]


class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]  # [AllowAny]


class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]  # [IsAuthenticatedOrReadOnly]


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
