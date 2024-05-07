import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince
from account.models import userAccount
from .serializer import UserSerializer
from .models import *

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        await self.channel_layer.group_add(self.room_group_name,self.channel_name)

        await self.accept()

        self.send(text_data=json.dumps({'status':'connected'}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name,self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        Type=text_data_json["Type"]
        link = text_data_json.get('link', '')
      
    
               
        
       
        print(message,Type,link)


        
        
        user = self.scope['user']
        user_serializer = UserSerializer(user)
        email = user_serializer.data['email']
        sender=user_serializer.data

        if Type=='videocall':
            await self.video_link_recive(link,sender)
        if Type=='audiocall':
            await self.audio_link_recive(link,sender)    

        else:    

            new_message = await self.create_message(self.room_id,message,email)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'chat_message',
                    'message':message,
                    'room_id':self.room_id,
                    'sender_email':email,
                    'Type':Type,
                    'created':timesince(new_message.created_at),
                }
            )

    async def chat_message(self,event):
        message = event['message']
        room_id = event['room_id']
        email = event['sender_email']
        created = event['created']
        Type=event['Type']
        

        await self.send(text_data=json.dumps({
            'type':'chat_message',
            'message':message,
            'room_id':room_id,
            'sender_email':email,
            'created':created,
            'Type':Type,
        }))


    async def audio_link_recive(self,link,sender):
         await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'audio_call_link',
                'data': {
                    'link':link,
                    'sender':sender
                },  # Send 'link' directly in the event
            }
        )
    async def audio_call_link(self,event):
        type="videocall"
        link = event['data']['link']  
        sender = event['data']['sender'] 
        print('inside video call ',link) 
        await self.send(text_data=json.dumps(
            {
                'type':'audiocall',
                'sender':sender,
                'link':link
            }
        )
  )
    

    async def video_link_recive(self,link,sender):
         await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'video_call_link',
                'data': {
                    'link':link,
                    'sender':sender
                },  # Send 'link' directly in the event
            }
        )
    async def video_call_link(self,event):
        type="videocall"
        link = event['data']['link']  
        sender = event['data']['sender'] 
        print('inside video call ',link) 
        await self.send(text_data=json.dumps(
            {
                'type':'videocall',
                'sender':sender,
                'link':link
            }
        )
  )
        

    @sync_to_async
    def create_message(self,room_id,message,email):
        user = userAccount.objects.get(email=email)
        room = Room.objects.get(id=room_id)
        message = Message.objects.create(text=message,room=room,sender=user)
        message.save()
        return message