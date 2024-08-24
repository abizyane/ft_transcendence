from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'chat/room/(?P<sender>\w+)/(?P<receiver>\w+)/?$', consumers.ChatRoomConsumer.as_asgi()),
]
