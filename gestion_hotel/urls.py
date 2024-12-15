from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),  # Agregar esta línea
    path('home/', views.home, name='home'),
    path('pago/', views.pago, name='pago'),
    path('comprobante/<str:payment_id>/', views.comprobante, name='comprobante'),
    path('rooms/', views.room_list, name='room_list'),
    path('rooms/new/', views.room_create, name='room_create'),
    path('rooms/edit/<int:pk>/', views.room_update, name='room_update'),
    path('rooms/delete/<int:pk>/', views.room_delete, name='room_delete'),
    path('guests/', views.guest_list, name='guest_list'),
    path('guests/new/', views.guest_create, name='guest_create'),
    path('guests/edit/<int:pk>/', views.guest_update, name='guest_update'),
    path('guests/delete/<int:pk>/', views.guest_delete, name='guest_delete'),
    path('staff/', views.staff_list, name='staff_list'),
    path('staff/new/', views.staff_create, name='staff_create'),
    path('staff/edit/<int:pk>/', views.staff_update, name='staff_update'),
    path('staff/delete/<int:pk>/', views.staff_delete, name='staff_delete'),
]
