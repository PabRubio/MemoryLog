from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Snippet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)
    image = models.TextField()
    caption = models.CharField(max_length=50)
    emoji = models.CharField(max_length=2)

    def __str__(self):
        return f"Snippet by {self.user.username}"