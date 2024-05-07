from rest_framework import serializers
from .models import *  


from django.contrib.auth.password_validation import validate_password
from django.core import exceptions




class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = userAccount
        fields=['id','username','email','password','first_name','last_name']
        

    def validate(self,data):
        user=userAccount(**data)
        password =data.get('password')  
        try:   
              validate_password(password,user)
        except exceptions.ValidationError as e: 
             serializer_errors =serializers.as_serializer_error(e)      
             raise exceptions.ValidationError(
                  {'password':serializer_errors['non_field_errors']}
             )
        return data  
    def create(self,validated_data):
         return userAccount.objects.create_user(**validated_data)

class userserializer(serializers.ModelSerializer):
     class Meta:
          model=userAccount
          fields=['id','username','display_pic','first_name','last_name','email','is_active','is_admin','is_staff','is_superuser','blocked_users' ]

class reporteduserpostserializer(serializers.ModelSerializer):

     
     class Meta:
          model=Reported_userAccounts
          fields=['user','reason','reported_user']




class reporteduserserializer(serializers.ModelSerializer):

     user=userserializer()
     class Meta:
          model=Reported_userAccounts
          fields=['user','reason','reported_user']


class reportedusergetserializer(serializers.ModelSerializer):
     reported_user=userserializer()
     user=userserializer()
     class Meta:
          model=Reported_userAccounts
          fields=['id','user','reported_user','reason']

          