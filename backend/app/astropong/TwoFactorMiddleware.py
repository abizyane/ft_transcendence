from django.conf import settings
from django.urls import reverse
from django.http import JsonResponse

class TwoFactorAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if not request.user.is_authenticated or not request.user.mfa_enabled or request.session.get("2fa_verified", False):
            return self.get_response(request)
        # if :
        #     return self.get_response(request)

        bypass_paths = [
            reverse("login"),
            reverse("register"),
            reverse("2fa_code"),
        ]

        if request.path not in bypass_paths:
            return JsonResponse(
                {'detail': '2FA verification required'}, status=403
            )

        return self.get_response(request)