from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions,status,generics
from .serializer import * 
from .models import *
from account.models import *
from .signals import follow_notification
from django.db.models import Q
from operator import attrgetter
import logging

logger = logging.getLogger(__name__)


from django.shortcuts import get_object_or_404

# Create your views here.

class PostListView(generics.ListAPIView):
    permission_classes=[permissions.IsAuthenticated]
    queryset = Posts.objects.filter(is_deleted=False, is_blocked=False).order_by('-created_at')
    serializer_class=PostSerializer



class PostHomeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get(self,request):
        try:
            user =request.user
            blockeduser=userAccount.objects.get(email=user)
            blocked_users=blockeduser.blocked_users.all()

            followers=Follow.objects.filter(follower=user)
            
            posts_by_user = Posts.objects.filter(author=user, is_deleted=False, is_blocked=False)
            
            # Query posts by followers
            posts_by_followers = Posts.objects.filter(author__in=followers.values_list('following', flat=True), is_deleted=False, is_blocked=False)
            
            # Combine posts by the authenticated user and posts by followers
            all_posts = posts_by_user | posts_by_followers
            
            # Exclude posts authored by blocked users
            all_posts = all_posts.exclude(author__in=blocked_users)
            
            all_users = userAccount.objects.filter(is_admin=False).order_by('-id')
            all_users_serializer = UserSerializer(all_users , many = True)
            users_following = followers.values_list('following' , flat=True)

            users_not_following = [
                user for user in all_users_serializer.data 
                if user['id'] != request.user.id and user['id'] not in users_following and user['id'] not in blocked_users.values_list('id', flat=True)
            ]

           
             
            
               
            


           

            all_posts_sorted = sorted(all_posts,key=attrgetter('created_at'),reverse=True)
            serializer = PostSerializer(all_posts_sorted,many=True)

            response_data = {
                'posts':serializer.data,
                'users_not_following':users_not_following,
                
            }
            
            return Response(response_data,status=status.HTTP_200_OK)
        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            return Response(status=status.HTTP_404_NOT_FOUND)
            

class CreatePostView(APIView):
    permission_classes= [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,*args,**kwargs):
        print(request.user)
        try:
            user = userAccount.objects.get(email=request.user)
            img = request.data['img']
            body = request.data['body']
            redata={
                'img':img,
                 'body':body,
                 'author':user.id
            }
            serializer = self.serializer_class(data=redata)
            if serializer.is_valid():
                post = serializer.save(author=user,img=img,body=body)
                
                return Response(status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
        except Exception as e:
            logger.error(f"An error occurred while creating a post: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        









class ProfileView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,email,*args,**kwargs):
        try:
            print(email)
            profile = userAccount.objects.get(email=email)
            profile_posts = Posts.objects.filter(author=profile,is_deleted=False,is_blocked=False).order_by('-updated_at')
            profile_serializer=UserSerializer(profile)
            post_serializer = PostSerializer(profile_posts,many=True)

            context ={
                'profile_user':profile_serializer.data,
                'profile_posts':post_serializer.data
            }
            return Response(context,status=status.HTTP_200_OK)
        except userAccount.DoesNotExist:
            return Response("User Not Fount",status=status.HTTP_404_NOT_FOUND)        
        


     


class PostDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,pk):
        print('hai')
        try:
            post = Posts.objects.get(id=pk)
            serializer = PostSerializer(post)
            print('retreive post details')
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            print('couldnt retreive post details')
            return Response(status=status.HTTP_404_NOT_FOUND)     
     




class DeletePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self,request,pk):
        try:
            post = Posts.objects.get(id=pk)
            post.is_deleted=True
            post.save()
            return Response(status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response('No post found!',status=status.HTTP_404_NOT_FOUND)
        
class UpdatePostView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def post(self,request,pk):
        try:
            user = request.user
            post_object = Posts.objects.get(id=pk)
            serializer =self.serializer_class(post_object,data={'body':request.data.get('body')},partial = True)
            if serializer.is_valid():
                serializer.save()
                print('updated successfully')
                return Response(status=status.HTTP_200_OK)
            else:
                print('else condition')
                return Response(serializer.errors)
        except Posts.DoesNotExist:
            print('except condition')
            return Response('No such post found.')       
        


class LikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            user = request.user
            post = Posts.objects.get(pk=pk)
            if request.user in post.likes.all():
                post.likes.remove(request.user)
            
                Notification.objects.filter(from_user=user, to_user=post.author, post=post, notification_type=Notification.NOTIFICATION_TYPES[0][0]).delete()
                
                
                return Response('Post unliked ', status=status.HTTP_200_OK)
            else:
                post.likes.add(request.user)
                if not post.author == user:
                    Notification.objects.create(
                        from_user = user,
                        to_user = post.author,
                        post = post ,
                        notification_type = Notification.NOTIFICATION_TYPES[0][0],
                    )
                    
                
                   
                return Response('Post Liked.',status=status.HTTP_200_OK)

        except Posts.DoesNotExist:
            return Response('Post not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckFollowStatus(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,email):
        print('check follow status working',email)
        if self.request.user.is_authenticated:
            try:
                profile_user = userAccount.objects.get(email=email)
                follow_relation = Follow.objects.filter(follower=request.user,following=profile_user).exists()
                
                return Response({'isFollowing':follow_relation},status=status.HTTP_200_OK)
            except userAccount.DoesNotExist:
                return Response({'isFollowing':False}, status=status.HTTP_404_NOT_FOUND)
        return Response({'isFollowing':False},status=status.HTTP_401_UNAUTHORIZED)


class CreateComment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def post(self, request, pk, *args, **kwargs):
        try:
            user = request.user
            post = Posts.objects.get(id=pk)
            body = request.data['body']

            # Check if a notification already exists for this user and post
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                    serializer.save(user=user, post_id=pk, body=body)
            

                    Notification.objects.create(
                    from_user=user,
                    to_user=post.author,
                    post=post,
                    notification_type=Notification.NOTIFICATION_TYPES[3][0],
                      )
              
                    return Response(status=status.HTTP_201_CREATED)
            else:
                # A notification already exists for this user and post, so don't create a new one
                return Response("A notification already exists for this comment.", status=status.HTTP_200_OK)

        except Posts.DoesNotExist:
            return Response('Post not found', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
class DeleteComment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            comment = Comment.objects.get(id=pk, user=request.user)

            notification_type = Notification.NOTIFICATION_TYPES[3][0]  # Notification type for comments
            post = comment.post

            Notification.objects.filter(
                Q(from_user=request.user, to_user=post.author, post=post, notification_type=notification_type) |
                Q(from_user=post.author, to_user=request.user, post=post, notification_type=notification_type)
            ).delete()

            
            post = comment.post

         

            comment.delete()
            return Response(status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response('No such comment found', status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReportPost(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class=ReportedPostSerializer

    def post(self,request,pk):
        try:
            print(pk)
            user=userAccount.objects.get(email=request.user)
            request_data={'post_id':pk,
                'reason':request.data['reason'],
                'reported_by':user.id}
            print(request_data['reason'])
            reportedpost=Posts.objects.get(id=pk)
            
            if request.user in reportedpost.reported_users.all():
                return Response('Already Reported the post',status=status.HTTP_200_OK)
              
            
            serializer=self.serializer_class(data=request_data)
            

            if serializer.is_valid():
                print('valid')
                serializer.save()
                reportedpost.reported_users.add(request.user)
               
                print('sucess')
                return Response('Sucessfully Reported Post',status=status.HTTP_201_CREATED)     
            else:
                print(serializer.errors)
                return Response('bug',status=status.HTTP_400_BAD_REQUEST)
        except Posts.DoesNotExist:
            return Response('No such Post found',status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self,request,pk):
        try:
            reportedpost=ReportedPost.objects.filter(post_id=pk)
            if reportedpost.exists():
                selializer=self.serializer_class(reportedpost,many=True)
                return Response(selializer.data,status=status.HTTP_200_OK)
            else:
                return Response("Reported Post not found",status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
       



class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request,pk):
        try:
            user = request.user
            follows = userAccount.objects.get(id=pk)
            is_following = Follow.objects.filter(follower = user,following = follows)
            if is_following:
                is_following.delete()
                response_msg = 'Unfollowed Successfully'
                # Delete the notification associated with the unfollowed user
                Notification.objects.filter(from_user=user, to_user=follows, notification_type=Notification.NOTIFICATION_TYPES[2][0]).delete()
            else:
                new_follow = Follow(follower=user,following=follows)
                new_follow.save()
                Notification.objects.create(
                    from_user = user,
                    to_user = follows,
                    notification_type = Notification.NOTIFICATION_TYPES[2][0],
                )
              
                response_msg = 'Followed Successfully'
                follow_notification.send(sender=self.__class__,follower=user,following=follows)
               
                print('signal sent successfully')

            is_following_now = Follow.objects.filter(follower = user , following = follows)

            is_following_data = [
                
                {
                    'id':follow.id,
                    'follower_id':follow.follower.id,
                    'following_id':follow.following.id,
                }
                for follow in is_following_now
            ]

            return Response({
                'message':response_msg,
                'is_following':is_following_data,
            },status=status.HTTP_200_OK)
        except userAccount.DoesNotExist:
            return Response('User not found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class MyNetworkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request,email):
        print('checking',email)
        user=email

        current_user =userAccount.objects.get(email=user)
        followers_query = userAccount.objects.filter(Q(followers__following=current_user) & ~Q(id=current_user.id))
        following_query = userAccount.objects.filter(Q(following__follower=current_user) & ~Q(id=current_user.id))
        followers = UserSerializer(following_query, many=True)
        following = UserSerializer(followers_query, many=True)
        context={
            'followers':followers.data,
            'following':following.data
        }
        return Response(context,status=status.HTTP_200_OK)        
    
class NotificationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(to_user=user).exclude(is_seen=True).order_by('-created')

    def get(self,request , *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many = True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationsSeenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def post(self, request , pk ,*args, **kwargs):
        try:
            notification = get_object_or_404(Notification,pk=pk)
            notification.is_seen = True
            notification.save()
            return Response(status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response("Not found in database",status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request , pk , *args, **kwargs):
        return Response('GET method not allowed for the endpoint ', status=status.HTTP_405_METHOD_NOT_ALLOWED)    
    




class SearchView(APIView):
    def get (self,request,*args,**krwags):
        try:
            query=self.request.GET.get('q','')
            print(query)
            if query:
                user_results=userAccount.objects.filter(
                    
                    
                    models.Q(username__icontains=query)|
                    models.Q(first_name__icontains=query)|
                    models.Q(last_name__icontains=query),is_active=True,is_superuser=False )    
                

                post_results=Posts.objects.filter(Q(body__icontains=query,is_deleted=False))
                user_serializer=UserSerializer(user_results,many=True)
                post_serializer=PostSerializer(post_results,many=True)

                user_data={
                    'users':user_serializer.data,
                }
                post_data={
                    'posts':post_serializer.data
                }
                response_data={
                    'user_data':user_data,
                    'post_data':post_data
                }

                return Response(response_data,status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)   

        except Exception as e:
            print('Error',str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)    