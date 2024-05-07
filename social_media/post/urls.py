from django.urls import path
from .views import *


urlpatterns = [

    path('Home/',PostHomeView.as_view(),name='home'),
    path('explore/',PostListView.as_view(),name='explore'),
    path('profile/<str:email>/',ProfileView.as_view(),name='profile'),

    path('post-details/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('create-post/',CreatePostView.as_view(),name='create-posts'),
    path('update-post/<int:pk>/',UpdatePostView.as_view(),name='update-post'),
    path('follow-user/<int:pk>/',FollowUserView.as_view(),name='follow'),
    path('check-follow-status/<str:email>/',CheckFollowStatus.as_view(),name='check-follow-status'),
    path('delete-post/<int:pk>',DeletePostView.as_view(),name='delete-post'),
    path('network/<str:email>',MyNetworkView.as_view(),name='network'),


    path('like/<int:pk>/', LikeView.as_view(), name='like-post'),
    path('create-comment/<int:pk>/', CreateComment.as_view(), name='add-comment'),
    path('delete-comment/<int:pk>/', DeleteComment.as_view(), name='delete-comment'),
    path('report-post/<int:pk>/',ReportPost.as_view(),name='reprted-post'),
    path('reported-post-details/<int:pk>/',ReportPost.as_view(),name='reprted-post-details'),



    path('notifications/',NotificationsView.as_view(),name='notifications'),
    path('notifications-seen/<int:pk>/',NotificationsSeenView.as_view(),name='notifications-seen'),

    path('search-request/',SearchView.as_view(),name='search-request'),


]


