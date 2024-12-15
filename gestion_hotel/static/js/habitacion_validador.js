document.addEventListener('DOMContentLoaded', function() {
    const tipoHabitacionField = document.getElementById('id_Tipo_Habitacion');
    const capacidadField = document.getElementById('id_Capacidad');
    const precioField = document.getElementById('id_Precio');
    const submitButton = document.getElementById('submit-button');
    const capacidadError = document.getElementById('capacidad-error');
    const tipoHabitacionInfo = document.getElementById('tipo-habitacion-info');
    const precioError = document.getElementById('precio-error');

    const capacidadMaxima = {
        'Pequeña': 2,
        'Mediana': 6,
        'Grande': 10
    };

    const precios = {
        'Pequeña': {min: 30000, max: 55000},
        'Mediana': {min: 60000, max: 90000},
        'Grande': {min: 110000, max: 160000}
    };

    function updateCapacidadInfo() {
        const tipoHabitacion = tipoHabitacionField.value;
        if (capacidadMaxima[tipoHabitacion]) {
            tipoHabitacionInfo.textContent = `Capacidad máxima para ${tipoHabitacion.toLowerCase()}: ${capacidadMaxima[tipoHabitacion]}.`;
        } else {
            tipoHabitacionInfo.textContent = '';
        }
    }

    function validateCapacity() {
        const tipoHabitacion = tipoHabitacionField.value;
        const capacidad = parseInt(capacidadField.value);
        if (isNaN(capacidad) || capacidad <= 0 || capacidad > capacidadMaxima[tipoHabitacion]) {
            capacidadError.textContent = 'Capacidad no válida.';
            return false;
        } else {
            capacidadError.textContent = '';
            return true;
        }
    }

    function validatePrice() {
        const tipoHabitacion = tipoHabitacionField.value;
        const precio = parseInt(precioField.value);
        const {min, max} = precios[tipoHabitacion];

        if (isNaN(precio) || precio < min || precio > max) {
            precioError.textContent = `El precio debe estar entre $${min} y $${max}.`;
            return false;
        } else {
            precioError.textContent = '';
            return true;
        }
    }

    function validateForm() {
        const isCapacityValid = validateCapacity();
        const isPriceValid = validatePrice();
        submitButton.disabled = !(isCapacityValid && isPriceValid);
    }

    tipoHabitacionField.addEventListener('change', () => {
        updateCapacidadInfo();
        validateForm();
    });

    capacidadField.addEventListener('input', validateForm);
    precioField.addEventListener('input', validateForm);

    window.addEventListener('DOMContentLoaded', () => {
        updateCapacidadInfo();
        validateForm();
    });
});
