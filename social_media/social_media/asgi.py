"""
ASGI config for social_media project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application

# Django setup
django.setup()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'social_media.settings')

# Import necessary modules
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chat import routing as chatrouting
from post import routing as notificationRouting
django_asgi_application = get_asgi_application()

# Define the ASGI application
application = ProtocolTypeRouter(
    {
        'http': django_asgi_application,
        'websocket': AllowedHostsOriginValidator(
            JWTAuthMiddlewareStack(
                URLRouter(chatrouting.websocket_urlpatterns+notificationRouting.websocket_urlpatterns)
            )
        )
    }
)
