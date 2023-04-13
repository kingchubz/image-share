from rest_framework import serializers
from imageapp.models import Image, Tag, Comment, Report, Profile
from django.contrib.auth.models import User


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'name', 'images']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['url', 'owner', 'image', 'text']


class ImageListSerializer(serializers.HyperlinkedModelSerializer):
    tag_set = TagSerializer(write_only=True, many=True)

    class Meta:
        model = Image
        fields = ['url', 'owner', 'image', 'description', 'tag_set']
        extra_kwargs = {
            'description': {'write_only': True},
            'owner': {'write_only': False},
        }


class ImageDetailSerializer(serializers.HyperlinkedModelSerializer):
    tag_set = TagSerializer(read_only=False, many=True)
    comment_set = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Image
        fields = ['url', 'owner', 'image', 'description', 'created', 'tag_set', 'comment_set']
        extra_kwargs = {
            'active': {'read_only': True},
            'owner': {'read_only': True},
            'image': {'read_only': True},
        }


class ReportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Report
        fields = ['url', 'byUser', 'reportedUser', 'text']


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ['url', 'user', 'picture']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['url', 'profile', 'username']
