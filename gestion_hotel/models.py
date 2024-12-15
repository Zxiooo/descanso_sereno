from django.db import models
import random
import string
from django.utils import timezone


# Habitaciones
class Room(models.Model):
    ID_Habitacion = models.AutoField(primary_key=True)
    TIPO_HABITACION_CHOICES = [
        ('Pequeña', 'Pequeña'),
        ('Mediana', 'Mediana'),
        ('Grande', 'Grande'),
    ]
    Tipo_Habitacion = models.CharField(max_length=10, choices=TIPO_HABITACION_CHOICES)
    Capacidad = models.IntegerField()
    ORIENTACION_CHOICES = [
        ('PISO 1', 'PISO 1'),
        ('PISO 2', 'PISO 2'),
        ('PISO 3', 'PISO 3'),
        ('PISO 4', 'PISO 4'),
    ]
    Orientacion = models.CharField(max_length=10, choices=ORIENTACION_CHOICES)
    Disponibilidad = models.BooleanField(default=True)
    Precio = models.IntegerField()
    Huesped = models.ForeignKey('Guest', on_delete=models.SET_NULL, null=True, blank=True, related_name='rooms')

    def clean(self):
        if self.Capacidad is None or self.Capacidad <= 0:
            raise ValueError("La capacidad debe ser mayor que 0.")
        if self.Tipo_Habitacion == 'Pequeña' and self.Capacidad > 2:
            raise ValueError("La capacidad máxima para una habitación pequeña es 2.")
        if self.Tipo_Habitacion == 'Mediana' and self.Capacidad > 6:
            raise ValueError("La capacidad máxima para una habitación mediana es 6.")
        if self.Tipo_Habitacion == 'Grande' and self.Capacidad > 10:
            raise ValueError("La capacidad máxima para una habitación grande es 10.")

    def save(self, *args, **kwargs):
        self.clean()  # Validar antes de guardar
        if self.Disponibilidad and self.Huesped:
            self.Huesped = None
        super(Room, self).save(*args, **kwargs)

    def __str__(self):
        return f"Habitación:{self.ID_Habitacion} Tipo:{self.Tipo_Habitacion} Capacidad:{self.Capacidad} Orientación:{self.Orientacion}"

# Huesped
def generate_guest_id():
    letters = ''.join(random.choices(string.ascii_uppercase, k=1))
    numbers = ''.join(random.choices(string.digits, k=5))
    return f'{numbers}{letters}-{random.randint(1, 9)}'

class Guest(models.Model):
    ID_Huesped = models.CharField(max_length=10, default=generate_guest_id, editable=False, unique=True)
    RUN = models.CharField(max_length=10)
    Nombres = models.CharField(max_length=20)
    Apellidos = models.CharField(max_length=20)
    Contacto = models.EmailField(max_length=50)  # EmailField para validación de correo electrónico
    Cantidad_Personas = models.IntegerField()

    def __str__(self):
        return f"{self.Nombres} {self.Apellidos} ({self.ID_Huesped})"


# Personal
def generate_staff_id():
    letters = ''.join(random.choices(string.ascii_uppercase, k=1))
    numbers = ''.join(random.choices(string.digits, k=5))
    return f'{numbers}{letters}-{random.randint(1, 9)}'

class Staff(models.Model):
    ID_Personal = models.CharField(max_length=10, default=generate_staff_id, editable=False, unique=True)
    RUN = models.CharField(max_length=10)
    Nombres = models.CharField(max_length=20)
    Apellidos = models.CharField(max_length=20)
    Contacto = models.CharField(max_length=30)
    Rol = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.Nombres} {self.Apellidos} ({self.ID_Personal})"
    

# Pago
def generar_id_pago():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

class Payment(models.Model):
    ID_Pago = models.CharField(max_length=10, primary_key=True, unique=True, default=generar_id_pago, editable=False)
    FECHA_PAGO = models.DateTimeField(default=timezone.now)
    TIPO_PAGO_CHOICES = [
        ('debito', 'Débito'),
        ('credito', 'Crédito'),
    ]
    Tipo_Pago = models.CharField(max_length=10, choices=TIPO_PAGO_CHOICES)
    Huesped = models.ForeignKey('Guest', on_delete=models.CASCADE)
    Habitacion = models.ForeignKey('Room', on_delete=models.CASCADE)
    Total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pago de {self.Huesped} para {self.Habitacion} - {self.Tipo_Pago} - ${self.Total}"