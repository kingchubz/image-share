from django.contrib import admin
from imageapp.models import Image, Tag, Comment, Report, Profile

admin.site.register(Image)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Report)
admin.site.register(Profile)

