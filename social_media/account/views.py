from django.shortcuts import render
from.models import  userAccount
from rest_framework.exceptions import AuthenticationFailed,ParseError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from . serializer import *
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import json
from post.models import *
from .models import *
from post.serializer import *

 
import random

class RegisterUser(APIView):
    def post(self,request):
        print(request.data.get('email'),request.data.get('password'))
        
        serializer=UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            useraccount = userAccount.objects.get(email=request.data['email'])
            
            random_num=None
            try: 
           
                random_num=random.randint(1000,9999)
                useraccount.OTP=random_num
                useraccount.save()

                
                send_mail(

                                "OTP AUTHENTICATING tribe_tie",
                                f"{random_num} -OTP",
                                "aravindkhari09@gmail.com",
                                
                                [request.data.get('email')],
                                fail_silently=False,
                            )
                print("hello")
           
            except: 
                return Response({"Message": "Unknown error"})
        else:
           is_active=False
           content={
              'messsage':'Registration failed',
              'errors':serializer.errors,
              'is_active':is_active,
              
           }
           return Response(content,status=status.HTTP_409_CONFLICT)
        
        
        
        user= userserializer(user)   
        return Response(user.data,status=status.HTTP_201_CREATED) 
  
    
class UserLogin(APIView):
    

    def post (self,request):

       try: 
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password)

       except KeyError:  
        raise ParseError('All fields Are Required')
       if not userAccount.objects.filter(email=email).exists():
         return Response({'error':'Email Does not Exist'},status=status.HTTP_401_UNAUTHORIZED)
         
        
       if  userAccount.objects.filter(email=email,is_active=False):
         return Response({'error':'Blocked by the admin'},status=status.HTTP_401_UNAUTHORIZED) 
       
       user = authenticate(username=email,password=password)
    
       

       
       if  user is None:
            print('hai')
            return Response({"error":'incrrect password'},status=status.HTTP_404_NOT_FOUND)
       
       else:
            refresh=RefreshToken.for_user(user)
            refresh['user']=user.id
            refresh['username']=user.username
            refresh['is_superuser']=user.is_superuser
            refresh['email']=user.email
           
            authuser=userAccount.objects.get(id=user.id)
            
            serializer=userserializer(authuser)
            serializer_data=serializer.data
            context={
               'user_id':user.id,
               'refresh':str(refresh),
               'access':str(refresh.access_token),
               "isAdmin":user.is_admin,
               "authuser":serializer_data
               
               
            }

            print(context)


            return Response(context,status=status.HTTP_200_OK)

    
class otpVerify(APIView):
   def patch(self,request):
      userID=request.data['UserID']
      Otp=request.data['OTP']
      print(Otp+'hai')

      try:
         user=userAccount.objects.get(id=userID)
      except userAccount.objects.DoesNotExist:
         return Response({"message":'User not found'},status=status.HTTP_404_NOT_FOUND)
      
      if int(request.data['OTP'])!= user.OTP:
          return Response({'error': 'Not a valid OTP'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
      else:
         user.is_active=True
         user.save()
         content = {
            'message': 'User is activated',
                    }
         return Response(content, status=status.HTTP_201_CREATED)

import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG) 
class ForgotPasswordView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            print('Password reset email is:', email)
            user_account = userAccount.objects.get(email=email)
            if user_account:
                print(user_account.id)
                reset_link = f"http://localhost:3000/change-password/{user_account.id}"
               
                
                send_mail(
    subject='Password Reset Request',
    message=f'''Hello,\n\nYou have requested to reset your password. 
              Click the following link to reset your password:\n\n{reset_link}\n\n
              If you did not request this, please ignore this email.\n\nThanks!''',
    from_email="aravindkhari09@gmail.com",
    recipient_list=[email],
    fail_silently=False,
)

                
                
                return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid Email'}, status=status.HTTP_404_NOT_FOUND)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data in the request body'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.error(f"An error occurred: {e}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateUserView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = userserializer

    def post(self,request):
        try:
            print(request.data)
            user = request.user
            
            obj = userAccount.objects.get(id=user.id)
            serializer = self.serializer_class(instance=obj,data = request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.errors,status=status.HTTP_200_OK)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except userAccount.DoesNotExist:
            return Response('User not found in the database',status=status.HTTP_404_NOT_FOUND)
        
class ChangePasswordView(APIView):
    def post(self,request,id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            password = data.get('password')
            password1 = data.get('password1')
            print('Password is:', password,'password1 is:',password1)
            user_account = userAccount.objects.get(id=id)
            if user_account:
                user_account.set_password(password)
                user_account.save()
                return Response({'message': 'Password Has been changed'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No Such User is available'}, status=status.HTTP_404_NOT_FOUND)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data in the request body'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class RetrieveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user = userserializer(user)
        return Response(user.data, status=status.HTTP_200_OK)


class BlockUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Correct typo in permission_classes

    def get(self, request, id):
        user_id = id
        
        try:
            user_to_block = userAccount.objects.get(id=user_id)
            authenticated_user = request.user
            is_following = Follow.objects.filter(follower = authenticated_user,following = user_to_block)
            is_follower=Follow.objects.filter(follower = user_to_block,following = authenticated_user)
            if is_following:
                is_following.delete()
            if is_follower:
                 is_follower.delete()
            if user_to_block in authenticated_user.blocked_users.all():
                # User is already blocked, so unblock
                authenticated_user.blocked_users.remove(user_to_block)
                message = 'User unblocked successfully'
            else:
                # User is not blocked, so block
                authenticated_user.blocked_users.add(user_to_block)
                message = 'User blocked successfully'
            
            return Response({'message': message}, status=status.HTTP_200_OK)
        except userAccount.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND) 
            

class Reportuser(APIView):
  permission_class=[permissions.IsAuthenticated]
  serializer_class=reporteduserpostserializer


  def post(self,request,id):
      
      try:
          user_id=id
          reported_user=userAccount.objects.get(email=request.user)
          user=userAccount.objects.get(pk=user_id)
          
          rdata=userserializer(data=user)

          if request.user in user.reported_user.all():
             return Response('Already reported',status=status.HTTP_200_OK)
        
          
          reason=str(request.data['reason'])

          print(request.data['reason'],reported_user,user)
          
          request_data={'user':id,
                        'reason':reason,
                        'reported_user':reported_user.id

              
          }

          serializer=self.serializer_class(data=request_data)
          if serializer.is_valid():
              serializer.save()
              user.reported_user.add(user)
              
              return Response("object created",status=status.HTTP_201_CREATED)
          else:
              print(serializer.errors)
              return Response(serializer.errors,status.HTTP_400_BAD_REQUEST)
              
      except userAccount.DoesNotExist:
           return Response("user not found",status=status.HTTP_404_NOT_FOUND)
    

  def get(self,request,id):
      
      try:
          id=int(id)
          data=Reported_userAccounts.objects.filter(user=id)
          if data.exists():
              serializer=reportedusergetserializer(data,many=True)
              return Response(serializer.data,status=status.HTTP_200_OK)
          else:
              return Response("user not found",status=status.HTTP_404_NOT_FOUND)
          

      except Exception as e:
          
          return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
                


###############################################AdminDashboard################################################################################
      
class Admin_dashboard(APIView):
   
    def get(self,request):
        try:
            user = userAccount.objects.filter(is_admin = False)
            serializer = userserializer(user , many =True)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class BlockUser(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request,id):
        try:
            user = userAccount.objects.get(id=id)
            if user.is_active:
                user.is_active=False
            else:
                user.is_active=True
            user.save()
            return Response(status=status.HTTP_200_OK)
        except userAccount.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status= status.HTTP_500_INTERNAL_SERVER_ERROR)


class Reportedpostlist(APIView):
    print('hai')
    permission_class=[permissions.IsAuthenticated]
    
    def get(self,request):
         try:
        
             reportedpost=ReportedPost.objects.all()
             
             print(reportedpost )
             querylist=Posts.objects.filter(reported_users__isnull=False)
             
             print(querylist)
             serializer = PostSerializer(querylist , many = True) 

         
             return Response(serializer.data,status=status.HTTP_200_OK)

         except Exception as e:
             print("An error occurred:", e)
             
     
     
   
   
             return Response("Posts not found",status=status.HTTP_404_NOT_FOUND)
         
class Reporteduserlist(APIView):

      permission_class=[permissions.IsAuthenticated]


      def get(self,request):
          try:
              reporteduser=Reported_userAccounts.objects.all()
              rp=Reported_userAccounts.objects.values('user').distinct()
             
              if reporteduser.exists():
                  serializer=reporteduserserializer(reporteduser,many=True)
                  print(serializer.data)
                  return Response(serializer.data,status=status.HTTP_200_OK)
              else:

                  return Response("reportedusers not found",status=status.HTTP_404_NOT_FOUND)  
          except Exception as e:
                  print(str(e))
                  return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)    


class BlockPost(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self,request,id):
        try:
            user = request.user
            post = Posts.objects.get(id=id)
            print('post is ',post)
            if post.is_blocked:
                post.is_blocked=False
           
            else:
                post.is_blocked=True
               
            post.save()
            return Response(status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)             
        
            








        
   




         
         
      

     


            



