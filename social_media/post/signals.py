from django.dispatch import Signal,receiver
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification,Comment
from .serializer import NotificationSerializer
import json
import logging
logger = logging.getLogger(__name__)



follow_notification = Signal()

@receiver(follow_notification)
def handle_follow_notification(sender,follower,following,**kwargs):
    print('signal is about to start--------')
    subject = 'New Follower Notification from Tribe Tie'
    message = f"Hello {following.username},\n\n"
    message += f"You have a new follower on Tribe Tie:\n"
    message += "╭───────────────────────╮\n"
    message += f"   Follower: {follower.username}\n"
    message += "╰───────────────────────╯\n\n"
    message += "Thank you for using Tribe Tie!"
    from_email=settings.EMAIL_HOST_USER
    recipient_list=[following.email]
    send_mail(subject,message,from_email,recipient_list,fail_silently=False)
    print('mail send successfully-------------------------')


@receiver(post_save,sender = Notification)
def notification_post_save_handler(sender , instance , created , **kwargs):
    user = instance.to_user
    
    if user.is_authenticated:
        channel_layer = get_channel_layer()
        
        if created:
            count = Notification.objects.filter(is_seen=False , to_user=user)
            serialized_count = NotificationSerializer(count, many=True).data
            serialized_instance = NotificationSerializer(instance).data
           
            try:
                async_to_sync(channel_layer.group_send)(
                    f'notify_{user.id}',
                    {
                        'type': 'send_notification',
                        'value': json.dumps(serialized_count),
                    }
                )
                logger.debug('Notification sent successfully')
            except Exception as e:
                logger.error(f'Error sending notification: {e}')
            
            logger.debug('Sending notification')