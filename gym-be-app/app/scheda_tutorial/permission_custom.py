from rest_framework import permissions
import logging

logger = logging.getLogger(__name__)

class StaffAllButEditOrReadOnly(permissions.BasePermission):

    edit_methods = ("PUT", "PATCH")
    methods = ()

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        #if obj.author == request.user:
        #    return True

        if request.user.is_trainer and request.method not in self.methods:
            return True

        return False

class IsTrainer(permissions.BasePermission):
    """Require a trainer or superuser before invoking a management endpoint."""

    def has_permission(self, request, view):
        return bool(request.user.is_authenticated and
                    (request.user.is_trainer or request.user.is_superuser))

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
    
class IsAdmin(permissions.BasePermission):

    edit_methods = ("PUT", "PATCH")
    methods = ()

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.user.is_staff:
            return True

        return False
