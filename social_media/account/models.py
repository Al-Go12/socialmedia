from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin

# Create your models here.




class UserAccountManager(BaseUserManager):
    def create_user(self,username,email,first_name,last_name,password=None):
        if not email:
            raise ValueError("user must have an email address")
        if not username:
            raise ValueError("user must have an user name")
        
        user=self.model(email=self.normalize_email(email),
                        username=username,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        )
        
        user.set_password(password) 
        user.save(using=self._db)
        return user
    
    def create_superuser(self,username,email,password):
        user=self.create_user(email=self.normalize_email(email),
             username=username,
             password=password) 
        user.is_active=True 
        user.is_admin=True
        user.is_staff=True
        user.is_superuser=True
        user.save(using=self._db)
        return user


class userAccount(AbstractBaseUser):
    username=models.CharField(max_length=20,unique=True)
    first_name=models.CharField(max_length=50,null=True,blank=True)
    last_name=models.CharField(max_length=50,null=True,blank=True)
    email=models.CharField(max_length=50,unique=True)
    date_joined=models.DateTimeField(auto_now_add=True)
    last_login=models.DateTimeField(auto_now_add=True)
    display_pic = models.ImageField(upload_to='user/',null=True,blank=True)
    is_admin=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)
    is_active=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    OTP=models.IntegerField(null=True)
    blocked_users   = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='blocked_by')
    reported_user=models.ManyToManyField('self', blank=True, symmetrical=False, related_name='reported_by')

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']
    objects=UserAccountManager()


    
    def __str__(self):
        return self.email
    
    def has_perm(self,perm,obj=None):
        return self.is_admin
    
    def has_module_perms(self, app_label):
        return True

class Reported_userAccounts(models.Model):
    user= models.ForeignKey(userAccount,on_delete=models.CASCADE,related_name='Reported_user_Accounts')
    reason=models.TextField(blank=True)
    reported_user=models.ForeignKey(userAccount,on_delete=models.CASCADE,related_name='Reported_user')
    
              
    def __str__(self):
        return str(self.user)
         

    


