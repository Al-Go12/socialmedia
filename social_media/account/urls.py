from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView




urlpatterns=[
     path('register',RegisterUser.as_view(),name='register'),
     path('Login',UserLogin.as_view(),name='Login'),
     path('user-update/',UpdateUserView.as_view(),name='update-user'),
     path('forgot-password/',ForgotPasswordView.as_view(),name='forgot-password'),
     path('change-password/<int:id>/',ChangePasswordView.as_view(),name='change-password'),

     path('otp/verify',otpVerify.as_view(),name='otp_verify'),
     path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('users/me/',RetrieveUserView.as_view() ,name='getRoutes'),
     path('blockuser-user/<str:id>/',BlockUserView.as_view(),name='blockusertouser'),
     path('report-user/<str:id>/',Reportuser.as_view(),name="report-user"),
     path('reportuserdetails/<int:id>/',Reportuser.as_view(),name="Reportuser"),
     path('reporteduserlist/',Reporteduserlist.as_view(),name='Reporteduserlist'),


     
     path('blockuser/<str:id>',BlockUser.as_view(),name='userslist'),
     path('admin/dashboard',Admin_dashboard.as_view(),name='admin_dasboard'),
     path('Reportedpostlist/',Reportedpostlist.as_view(),name='Reportedpostlist'),
     path('blockpost/<str:id>/',BlockPost.as_view(),name='blockpost'),
]