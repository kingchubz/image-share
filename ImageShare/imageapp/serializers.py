from rest_framework import serializers
from imageapp.models import Image, Tag, Comment, Report, Profile
from django.contrib.auth.models import User


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.SlugRelatedField(
        source='user',
        read_only=True,
        slug_field='username'
    )

    class Meta:
        model = Profile
        fields = ['user', 'username', 'picture']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['url', 'profile', 'username']


class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = ['url', 'name', 'images']
        extra_kwargs = {
            'images': {'write_only': True},
        }


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['owner', 'text']


class ImageListSerializer(serializers.HyperlinkedModelSerializer):
    tag_set = TagSerializer(many=True)

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
    byUser = ProfileSerializer(read_only=True)
    reportedUser = ProfileSerializer(read_only=True)

    class Meta:
        model = Report
        fields = ['url', 'byUser', 'reportedUser', 'text']


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
