from django.test import TestCase

from django.contrib.auth.models import User
from imageapp.models import Profile, Image, Tag, Comment, Report

from os import path
from django.core.files.images import ImageFile


class TestModels(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', password='password')
        self.image = ImageFile(open('site/media/profile_picture/default.png', 'rb'))
        self.profile = Profile.objects.create(user=self.user)

    def tearDown(self) -> None:
        self.profile.delete()

    def test_profile_model(self):
        profile = self.profile

        image_path = profile.picture.name

        self.assertIsInstance(profile, Profile)
        self.assertIsInstance(profile.picture, ImageFile)
        self.assertEqual(profile.user.username, self.user.username)
        self.assertNotEqual(image_path, self.image.name)
        self.assertNotEqual(path.basename(image_path), path.basename(self.image.name))

        # image file deletes from system when profile object deletes
        profile_pk = profile.pk
        profile.user.delete()
        self.assertFalse(Profile.objects.filter(pk=profile_pk).exists())
        self.assertFalse(path.isfile(image_path))

    def test_image_model(self):
        profile = self.profile
        image = Image.objects.create(owner=profile, image=self.image, description='test descr')

        image_path = image.image.name

        self.assertIsInstance(image, Image)
        self.assertIsInstance(image.image, ImageFile)
        self.assertEqual(image.owner.user.username, self.user.username)
        self.assertNotEqual(path.basename(image_path), path.basename(self.image.name))

        image.image = self.image
        image.save()
        new_image_path = image.image.name
        # image file deletes from system on image file update
        self.assertNotEqual(image_path, new_image_path)
        self.assertFalse(path.isfile(image_path))

        # image file deletes from system when image object deletes
        user_pk = image.owner.user.pk
        image.delete()
        self.assertTrue(User.objects.filter(pk=user_pk).exists())
        self.assertFalse(path.isfile(new_image_path))

    def test_tag_model(self):
        profile = self.profile
        image = Image.objects.create(owner=profile, image=self.image)
        tag = Tag.objects.create(name='test')
        tag.images.set([image])

        self.assertIsInstance(tag, Tag)
        tag.delete()
        self.assertTrue(Image.objects.filter(pk=image.pk).exists())

    def test_comment_model(self):
        profile = self.profile
        image = Image.objects.create(owner=profile, image=self.image)
        comment = Comment.objects.create(owner=profile, image=image, text='nice')

        self.assertIsInstance(comment, Comment)

    def test_report_model(self):
        by_user_profile = self.profile
        reported_user = User.objects.create_user(username='reported_user', password='password')
        reported_user_profile = Profile.objects.create(user=reported_user)

        report = Report.objects.create(byUser=by_user_profile, reportedUser=reported_user_profile, text='report text')

        profile1, profile2 = report.byUser, report.reportedUser
        self.assertTrue(isinstance(report, Report))
        self.assertTrue(Report.objects.filter(pk=report.pk).exists())
        profile1.delete()
        self.assertTrue(Report.objects.filter(pk=report.pk).exists())
        profile2.delete()
        self.assertFalse(Report.objects.filter(pk=report.pk).exists())