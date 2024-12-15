from django.shortcuts import render, redirect, get_object_or_404
from .models import Room, Guest, Staff, Payment
from .forms import RoomForm, GuestForm, StaffForm, LoginForm
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone
from django.contrib.auth import logout


#inicio usuario
def inicio(request):
    return render(request, 'inicio.html')


# Inicio de Panel
def home(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    return render(request, 'home.html')


# Inicio de Sesion
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            if username == 'admin' and password == 'admin123':
                request.session['is_logged_in'] = True
                return redirect('home')
            else:
                form.add_error(None, "Usuario o contraseña incorrectos.")
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    request.session.flush()
    return redirect('inicio')


# Registro de Pago y Comprobante
@csrf_protect
def pago(request):
    rooms = Room.objects.filter(Disponibilidad=True)
    if request.method == 'POST':
        print("POST request received.")
        form = GuestForm(request.POST)
        if form.is_valid():
            print("Form is valid.")
            guest = form.save(commit=False)
            habitacion = form.cleaned_data.get('habitacion')
            cantidad_personas = form.cleaned_data.get('Cantidad_Personas')
            tipo_pago = request.POST.get('tipo_pago')
            print(f"Habitación: {habitacion}, Cantidad de Personas: {cantidad_personas}, Tipo de Pago: {tipo_pago}")

            if habitacion and cantidad_personas:
                if cantidad_personas > habitacion.Capacidad:
                    print("Cantidad de personas excede la capacidad.")
                    form.add_error('Cantidad_Personas', "La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.")
                else:
                    guest.save()
                    print(f"Guest {guest} saved.")
                    habitacion.Huesped = guest
                    habitacion.Disponibilidad = False
                    habitacion.save()
                    print(f"Habitación {habitacion} saved with guest.")

                    total_pago_sin_iva = habitacion.Precio
                    iva = round(total_pago_sin_iva * 0.19, 2)
                    total_pago = round(total_pago_sin_iva + iva, 2)

                    payment = Payment.objects.create(
                        FECHA_PAGO=timezone.now(),
                        Tipo_Pago=tipo_pago,
                        Huesped=guest,
                        Habitacion=habitacion,
                        Total=total_pago
                    )
                    print(f"Payment {payment} created.")

                    return redirect('comprobante', payment_id=payment.ID_Pago)

        else:
            print("Form is not valid.")
            print(form.errors)

        return render(request, 'pago.html', {'rooms': rooms, 'form': form})

    else:
        form = GuestForm()
    return render(request, 'pago.html', {'rooms': rooms, 'form': form})

def comprobante(request, payment_id):
    pago = Payment.objects.get(ID_Pago=payment_id)
    precio_habitacion = pago.Habitacion.Precio
    iva = round(precio_habitacion * 0.19, 2)
    total_pagado = precio_habitacion + iva
    contexto = {
        'pago': pago,
        'precio_habitacion': precio_habitacion,
        'iva': iva,
        'total_pagado': total_pagado
    }
    return render(request, 'comprobante.html', contexto)


# Registro de Staff
def staff_list(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    staff = Staff.objects.all()
    return render(request, 'staff_list.html', {'staff': staff})

def staff_create(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    if request.method == 'POST':
        form = StaffForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('staff_list')
    else:
        form = StaffForm()
    return render(request, 'staff_form.html', {'form': form})

def staff_update(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    staff = Staff.objects.get(pk=pk)
    if request.method == 'POST':
        form = StaffForm(request.POST, instance=staff)
        if form.is_valid():
            form.save()
            return redirect('staff_list')
    else:
        form = StaffForm(instance=staff)
    return render(request, 'staff_form.html', {'form': form})

def staff_delete(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    staff = Staff.objects.get(pk=pk)
    if request.method == 'POST':
        staff.delete()
        return redirect('staff_list')
    return render(request, 'staff_confirm_delete.html', {'staff': staff})


# Registro de Huespedes
def guest_list(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    guests = Guest.objects.all()
    return render(request, 'guest_list.html', {'guests': guests})

def guest_create(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    if request.method == 'POST':
        form = GuestForm(request.POST)
        if form.is_valid():
            guest = form.save(commit=False)
            habitacion = form.cleaned_data.get('habitacion')
            cantidad_personas = form.cleaned_data.get('Cantidad_Personas')
            
            if habitacion and cantidad_personas <= habitacion.Capacidad:
                guest.save()
                if habitacion:
                    habitacion.Huesped = guest
                    habitacion.Disponibilidad = False
                    habitacion.save()
                return redirect('guest_list')
            else:
                form.add_error('Cantidad_Personas', "La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.")
        else:
            print("Form is not valid.")
            print(form.errors)
        return render(request, 'guest_form.html', {'form': form})
    else:
        form = GuestForm()
    return render(request, 'guest_form.html', {'form': form})

def guest_update(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    guest = get_object_or_404(Guest, pk=pk)
    habitacion_anterior = Room.objects.filter(Huesped=guest).first()
    print(f"Editando huésped: {guest} con habitación previa: {habitacion_anterior}")

    if request.method == 'POST':
        form = GuestForm(request.POST, instance=guest)
        if form.is_valid():
            print("El formulario es válido.")
            guest = form.save(commit=False)
            habitacion = form.cleaned_data.get('habitacion')
            cantidad_personas = form.cleaned_data.get('Cantidad_Personas')
            print(f"Nueva habitación: {habitacion}, Nuevo número de personas: {cantidad_personas}")

            if habitacion and cantidad_personas <= habitacion.Capacidad:
                guest.save()
                print("Huésped guardado.")
                
                if habitacion_anterior and habitacion_anterior != habitacion:
                    habitacion_anterior.Disponibilidad = True
                    habitacion_anterior.Huesped = None
                    habitacion_anterior.save()
                    print(f"Habitación previa {habitacion_anterior} actualizada a disponible.")

                habitacion.Huesped = guest
                habitacion.Disponibilidad = False
                habitacion.save()
                print(f"Nueva habitación {habitacion} asignada al huésped.")
                
                return redirect('guest_list')
            else:
                form.add_error('Cantidad_Personas', "La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.")
                print("Error de validación: La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.")
        else:
            print("El formulario no es válido.")
            print(form.errors)
        return render(request, 'guest_form.html', {'form': form})
    else:
        form = GuestForm(instance=guest)
        if habitacion_anterior:
            form.fields['habitacion'].initial = habitacion_anterior
    return render(request, 'guest_form.html', {'form': form})

def guest_delete(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    guest = get_object_or_404(Guest, pk=pk)
    if request.method == 'POST':
        # Intentar obtener la habitación asignada al huésped, si existe
        habitacion = Room.objects.filter(Huesped=guest).first()
        if habitacion:
            habitacion.Disponibilidad = True
            habitacion.Huesped = None
            habitacion.save()
        guest.delete()
        return redirect('guest_list')
    return render(request, 'guest_confirm_delete.html', {'guest': guest})


# Registro de Habitaciones
def room_list(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    rooms = Room.objects.all()
    return render(request, 'room_list.html', {'rooms': rooms})

def room_create(request):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('room_list')
    else:
        form = RoomForm()
    return render(request, 'room_form.html', {'form': form})

def room_update(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    room = Room.objects.get(pk=pk)
    if request.method == 'POST':
        form = RoomForm(request.POST, instance=room)
        if form.is_valid():
            form.save()
            return redirect('room_list')
    else:
        form = RoomForm(instance=room)
    return render(request, 'room_form.html', {'form': form})

def room_delete(request, pk):
    if not request.session.get('is_logged_in', False):
        return redirect('login')
    room = Room.objects.get(pk=pk)
    if request.method == 'POST':
        room.delete()
        return redirect('room_list')
    return render(request, 'room_confirm_delete.html', {'room': room})