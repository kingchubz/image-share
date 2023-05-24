from rest_framework import serializers
from imageapp.models import Image, Tag, Comment, Report, Profile
from django.contrib.auth.models import User


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(
        source='user',
        read_only=True,
        slug_field='username'
    )

    class Meta:
        model = Profile
        fields = ['username', 'picture']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'profile', 'username']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'url', 'name']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['owner', 'text']


class ImageListSerializer(serializers.ModelSerializer):
    tag_set = TagSerializer(many=True)

    class Meta:
        model = Image
        fields = ['id', 'url', 'image', 'description', 'tag_set']
        extra_kwargs = {
            'description': {'write_only': True},
        }


class ImageDetailSerializer(serializers.ModelSerializer):
    tag_set = TagSerializer(read_only=True, many=True)
    comment_set = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Image
        fields = ['id', 'owner', 'image', 'description', 'created', 'tag_set', 'comment_set']
        extra_kwargs = {
            'active': {'read_only': True},
            'owner': {'read_only': True},
            'image': {'read_only': True},
        }


class ImageActivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'active', 'image']
        extra_kwargs = {
            'image': {'read_only': True},
        }


class ReportSerializer(serializers.ModelSerializer):
    byUser = ProfileSerializer(read_only=True)
    reportedUser = ProfileSerializer(read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'byUser', 'reportedUser', 'text']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords didn`t match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])

        profile = Profile.objects.create(user=user)
        user.save()
        profile.save()

        return user

    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm']
