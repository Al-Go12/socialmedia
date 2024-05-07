from rest_framework import serializers

from account.models import userAccount
from .models import *
from account.serializer import userserializer 



class UserSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    total_posts = serializers.SerializerMethodField()

    def get_follower_count(self,obj):
        return obj.followers.count()
    
    def get_following_count(self,obj):
        return obj.following.count()
    
    def get_followers(self,obj):
        followers = obj.followers.all()
        follower_serializer = FollowSerializer(followers,many=True)
        return follower_serializer.data
    
    def get_following(self, obj):
        following = obj.following.all()
        following_serializer = FollowSerializer(following, many=True)
        return following_serializer.data
    
    def get_total_posts(self,obj):
        return obj.posts.filter(is_deleted=False).count()
        
    class Meta:
        model = userAccount
        fields=['id','username','first_name','last_name','email','display_pic',
                  'total_posts','follower_count','following_count','followers','following',
                  'last_login','is_admin','is_staff','is_active','is_superuser','blocked_users']



class FollowSerializer(serializers.ModelSerializer):
    following = serializers.SlugRelatedField(slug_field='email',queryset=userAccount.objects.all())
    follower = serializers.SlugRelatedField(slug_field='email',queryset=userAccount.objects.all())

    class Meta:
        model = Follow
        fields = ['follower','following']



class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only =True)

    class Meta:
        model = Comment
        fields=['id','user','body','created_time']        
    
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only = True)
    likes_count = serializers.SerializerMethodField()
   
    followers = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True,read_only=True)
    comments_count=serializers.SerializerMethodField()

   
    def get_likes_count(self,obj):
        return obj.total_likes()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    

    def get_followers(self,obj):
        followers =Follow.objects.filter(following=obj.author).select_related('follower')
        follower_serializer = FollowSerializer(instance=followers,many=True,context=self.context)
        return follower_serializer.data
    


    author = UserSerializer(read_only = True)
    class Meta:
        model = Posts
        fields =['id','body','img' ,'followers','comments','author','likes_count','created_time','likes',
                 'comments_count',
                  'is_deleted','is_blocked']




class ReportedPostSerializer(serializers.ModelSerializer):
    
    class Meta:
      model=ReportedPost
      fields=['post_id','reason','created_at','reported_by']

class NotificationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('notification_type',)

    def validate_notification_type(self,value):
        choices = dict(Notification.NOTIFICATION_TYPES)
        if value not in choices:
            raise serializers.ValidationError("Invalid notification type.")
        return value
