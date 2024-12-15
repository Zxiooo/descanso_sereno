from django import forms
from .models import Room, Guest, Staff

# Inicio de Sesion
class LoginForm(forms.Form):
    username = forms.CharField(label='Usuario', max_length=100)
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput)


# Habitaciones
class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['Tipo_Habitacion', 'Capacidad', 'Orientacion', 'Disponibilidad', 'Precio']


# Huespedes
class GuestForm(forms.ModelForm):
    habitacion = forms.ModelChoiceField(queryset=Room.objects.filter(Disponibilidad=True), required=False, label='Asignar Habitación')

    class Meta:
        model = Guest
        fields = ['RUN', 'Nombres', 'Apellidos', 'Contacto', 'Cantidad_Personas', 'habitacion']
        widgets = {
            'Contacto': forms.EmailInput(attrs={'maxlength': 50}),
        }
        labels = {
            'RUN': 'RUT',
            'Contacto': 'Correo',
        }


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            # Incluir la habitación previamente asignada en el queryset
            habitacion_asignada = Room.objects.filter(Huesped=self.instance).first()
            if habitacion_asignada:
                self.fields['habitacion'].queryset = Room.objects.filter(Disponibilidad=True) | Room.objects.filter(pk=habitacion_asignada.pk)


    def clean(self):
        cleaned_data = super().clean()
        habitacion = cleaned_data.get('habitacion')
        cantidad_personas = cleaned_data.get('Cantidad_Personas')

        if habitacion and cantidad_personas:
            if cantidad_personas > habitacion.Capacidad:
                raise forms.ValidationError("La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.")

        return cleaned_data


# Personal
class StaffForm(forms.ModelForm):
    class Meta:
        model = Staff
        fields = ['RUN', 'Nombres', 'Apellidos', 'Contacto', 'Rol']
        labels = {
            'RUN': 'RUT',
            'Contacto': 'Correo',
        }

