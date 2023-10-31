import os
import secrets

from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver

from django.core.files.base import ContentFile
from PIL import Image as PIL_Image
from io import BytesIO


class Profile(models.Model):
    user = models.OneToOneField(User, blank=False, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='profile_picture', null=False, default='profile_picture/default.png')

    def save(self, *args, **kwargs):
        if self.picture:
            filename = "%s.png" % secrets.token_urlsafe(16)

            image = PIL_Image.open(self.picture)
            if image.mode in ('RGBA', 'LA'):
                background = PIL_Image.new(image.mode[:-1], image.size, '#fff')
                background.paste(image, image.split()[-1])
                background.thumbnail((100, 100))
                image = background
            image_io = BytesIO()
            image.save(image_io, format='PNG', quality=100)

            self.picture.save(filename, ContentFile(image_io.getvalue()), save=False)

        super(Profile, self).save(*args, **kwargs)


@receiver(models.signals.post_delete, sender=Profile)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    """
    Deletes image from filesystem
    when corresponding `Profile` object is deleted.
    """
    if instance.picture:
        if os.path.isfile(instance.picture.path):
            os.remove(instance.picture.path)


@receiver(models.signals.pre_save, sender=Profile)
def auto_delete_image_on_change(sender, instance, **kwargs):
    """
    Deletes old image from filesystem
    when corresponding `Profile` object is updated
    with new image.
    """
    if not instance.pk:
        return False

    try:
        old_image = Profile.objects.get(pk=instance.pk).picture
    except Profile.DoesNotExist:
        return False

    if old_image.name == 'profile_picture/default.png':
        return False

    new_image = instance.picture
    if not old_image == new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


class Image(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images')
    description = models.CharField(max_length=1000, blank=True)
    active = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.image:
            filename = "%s.png" % secrets.token_urlsafe(16)

            image = PIL_Image.open(self.image)
            if image.mode in ('RGBA', 'LA'):
                background = PIL_Image.new(image.mode[:-1], image.size, '#fff')
                background.paste(image, image.split()[-1])
                image = background
            image_io = BytesIO()
            image.save(image_io, format='PNG', quality=100)

            self.image.save(filename, ContentFile(image_io.getvalue()), save=False)

        super(Image, self).save(*args, **kwargs)

    class Meta:
        ordering = ['created']


@receiver(models.signals.post_delete, sender=Image)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    """
    Deletes image from filesystem
    when corresponding `Image` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


@receiver(models.signals.pre_save, sender=Image)
def auto_delete_image_on_change(sender, instance, **kwargs):
    """
    Deletes old image from filesystem
    when corresponding `Image` object is updated
    with new image.
    """
    if not instance.pk:
        return False

    try:
        old_image = Image.objects.get(pk=instance.pk).image
    except Image.DoesNotExist:
        return False

    new_image = instance.image
    if not old_image == new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    images = models.ManyToManyField(Image, blank=True)

    def __str__(self):
        return self.name


class Comment(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)


class Report(models.Model):
    byUser = models.ForeignKey(Profile, on_delete=models.DO_NOTHING, related_name="by_user")
    reportedUser = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="reported_user")
    text = models.CharField(max_length=1000)
