from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import Snippet
import base64

class SnippetForm(forms.ModelForm):
    image_file = forms.FileField(
        label="Image",
        required=False)

    class Meta:
        model = Snippet
        fields = ['user', 'image_file', 'caption', 'emoji', 'date']

    def save(self, commit=True):
        instance = super().save(commit=False)
        image_file = self.cleaned_data.get('image_file')
        if image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
            instance.image = f"data:{image_file.content_type};base64,{base64_image}"
        if commit:
            instance.save()
        return instance

@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    form = SnippetForm
    list_display = ('id', 'date', 'short_caption', 'emoji', 'image_display')
    search_fields = ('caption', 'user__username')
    list_filter = ('date', 'emoji')
    ordering = ('-date',)

    readonly_fields = ('image_preview',)

    def image_display(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image}" style="width: 50px; height: 50px; object-fit: cover;" />')
        return "No image" # 🐔

    image_display.short_description = "Image"

    def image_preview(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image}" style="width: 200px; height: 200px; object-fit: cover;" />')
        return "No image available"

    image_preview.short_description = "Preview"

    def short_caption(self, obj):
        return obj.caption[:7] + '...' if len(obj.caption) > 7 else obj.caption

    short_caption.short_description = "Caption"

    fields = ['user', 'image_file', 'image_preview', 'caption', 'emoji', 'date']