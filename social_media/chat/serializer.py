from rest_framework import serializers
from django.utils.timesince import timesince
from .models import *
from account.models import userAccount

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = userAccount
        fields =['id','email','first_name','last_name','username','display_pic']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email',read_only=True)
    created = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model= Message
        fields='__all__'

    def get_created(self,obj):
        return timesince(obj.created_at)
    
class RoomListSerializer(serializers.ModelSerializer):
    unseen_message_count = serializers.SerializerMethodField()
    members = UserSerializer(many = True)

    class Meta:
        model = Room
        fields = "__all__"

    def get_unseen_message_count(self,obj):
        user = self.context['request'].user
        return Message.objects.filter(room= obj,seen=False).exclude(sender=user).count()

    def to_representation(self, instance):
        user = self.context['request'].user
        members = instance.members.exclude(id=user.id)
        data = super(RoomListSerializer,self).to_representation(instance)
        data['members'] = UserSerializer(members,many=True).data
        return data
    


    