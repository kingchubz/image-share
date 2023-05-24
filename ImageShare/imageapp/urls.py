from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from imageapp import views
from knox import views as knox_views

urlpatterns = [
    path('images/', views.ImageList.as_view(), name='image-list'),
    path('images/<int:pk>/', views.ImageDetail.as_view(), name='image-detail'),
    path('tags/', views.TagList.as_view(), name='tag-list'),
    path('tags/<int:pk>/', views.TagDetail.as_view(), name='tag-detail'),
    path('comments/', views.CommentList.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetail.as_view(), name='comment-detail'),
    path('reports/', views.ReportList.as_view(), name='report-list'),
    path('reports/<int:pk>/', views.ReportDetail.as_view(), name='report-detail'),
    path('user_image/', views.UserImageView.as_view(), name='user-image'),
    path('image_activate/', views.ImageActivate.as_view(), name='image-activate'),
    path('image_activate/<int:pk>/', views.ImageActivate.as_view(), name='image-activate'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
