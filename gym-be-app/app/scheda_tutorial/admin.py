from django.contrib import admin

# Register your models here.
from .models.models_tutorial import Course, LevelCourse


class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'discipline']


class LevelCourseAdmin(admin.ModelAdmin):
    list_display = ['course', 'level']


admin.site.register(Course, CourseAdmin)
admin.site.register(LevelCourse, LevelCourseAdmin)
