from django.contrib import admin

# Register your models here.


from post.models import *

admin.site.register(ReportedPost)
admin.site.register(Posts)

admin.site.register(Notification)