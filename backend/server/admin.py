from django import forms
from django.contrib import admin
from .models import Snippet
import base64

class SnippetForm(forms.ModelForm):
    image_file = forms.FileField(
        label="Image",
        required=False
    )

    class Meta:
        model = Snippet
        fields = ['user', 'image_file', 'caption', 'emoji']

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
    list_display = ('id', 'user', 'date', 'caption', 'emoji')
    search_fields = ('caption', 'user__username')
    list_filter = ('date', 'emoji')
    ordering = ('-date',)
    readonly_fields = ('date',)