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


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    active = serializers.BooleanField(read_only=True)
    tag_set = TagSerializer(read_only=True, many=True)
    comment_set = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Image
        fields = ['url', 'owner', 'image', 'description', 'active', 'created', 'tag_set', 'comment_set']


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
