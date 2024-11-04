from django.urls import re_path
from .Tournament import TournamentConsumer
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/game_start/(?P<game_id>\w+)/$", consumers.GameConsumer.as_asgi()),
    re_path(r"ws/tournament/(?P<competition_type>\w+)/$", TournamentConsumer.TournamentConsumer.as_asgi()),
]