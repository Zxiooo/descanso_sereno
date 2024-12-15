document.addEventListener('DOMContentLoaded', function() {
    const habitacionSelect = document.getElementById('habitacion');
    const totalPagarElement = document.getElementById('total');
    const precioHabitacionElement = document.getElementById('precio-habitacion');
    const ivaElement = document.getElementById('iva');
    const totalPagarResumenElement = document.getElementById('total-pagar');
    const resumenPrecioElement = document.getElementById('resumen-precio');
    const reservaForm = document.getElementById('reservaForm');
    const noHabitaciones = document.getElementById('no-habitaciones');
    const runInput = document.getElementById('run');
    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');
    const emailInput = document.getElementById('contacto');
    const rutError = document.getElementById('rut-error');
    const nombresError = document.getElementById('nombres-error');
    const apellidosError = document.getElementById('apellidos-error');
    const emailError = document.getElementById('email-error');

    function updateTotal() {
        const selectedOption = habitacionSelect.options[habitacionSelect.selectedIndex];
        if (selectedOption.value) {
            const precio = selectedOption.dataset.price;
            const precioNum = parseFloat(precio);
            const iva = Math.round(precioNum * 0.19);
            const total = Math.round(precioNum + iva);

            totalPagarElement.textContent = `$${total}`;
            precioHabitacionElement.textContent = `$${Math.round(precioNum)}`;
            ivaElement.textContent = `$${iva}`;
            totalPagarResumenElement.textContent = `$${total}`;

            resumenPrecioElement.style.display = 'block';
        } else {
            totalPagarElement.textContent = '$0';
            precioHabitacionElement.textContent = '$0';
            ivaElement.textContent = '$0';
            totalPagarResumenElement.textContent = '$0';

            resumenPrecioElement.style.display = 'none';
        }
    }

    function validarRUT(rut) {
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
            return false;
        }
        const parts = rut.split('-');
        const number = parts[0];
        const dv = parts[1].toUpperCase();
        let sum = 0;
        let multiplier = 2;

        for (let i = number.length - 1; i >= 0; i--) {
            sum += parseInt(number[i]) * multiplier;
            multiplier = (multiplier === 7) ? 2 : multiplier + 1;
        }

        const expectedDv = 11 - (sum % 11);
        const dvChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K'];

        return dv === dvChars[expectedDv];
    }

    function formatRUT(value) {
        const runWithoutHyphen = value.replace(/-/g, '');
        if (runWithoutHyphen.length > 8) {
            runInput.value = runWithoutHyphen.slice(0, 8) + '-' + runWithoutHyphen.slice(8);
        } else {
            runInput.value = runWithoutHyphen;
        }
    }

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cl|com)$/;
        return regex.test(email);
    }

    function validarTexto(texto) {
        const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
        return regex.test(texto);
    }

    function validarFormulario(event) {
        const selectedOption = habitacionSelect.options[habitacionSelect.selectedIndex];
        const capacidad = parseInt(selectedOption.dataset.capacidad);
        const cantidadPersonas = parseInt(document.getElementById('cantidad_personas').value);
        const run = runInput.value;
        const nombres = nombresInput.value;
        const apellidos = apellidosInput.value;
        const email = emailInput.value;
        let formIsValid = true;

        if (isNaN(cantidadPersonas) || cantidadPersonas <= 0) {
            alert("La cantidad de personas debe ser mayor que 0.");
            formIsValid = false;
        } else if (cantidadPersonas > capacidad) {
            alert("La cantidad de personas no puede exceder la capacidad de la habitación seleccionada.");
            formIsValid = false;
        }

        if (!validarRUT(run)) {
            rutError.textContent = "El RUT ingresado no es válido.";
            formIsValid = false;
        } else {
            rutError.textContent = "";
        }

        if (!validarEmail(email)) {
            emailError.textContent = "El correo electrónico debe terminar en .cl o .com";
            formIsValid = false;
        } else {
            emailError.textContent = "";
        }

        if (!validarTexto(nombres)) {
            nombresError.textContent = "El nombre solo debe contener letras y un solo espacio entre palabras.";
            formIsValid = false;
        } else {
            nombresError.textContent = "";
        }

        if (!validarTexto(apellidos)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un solo espacio entre palabras.";
            formIsValid = false;
        } else {
            apellidosError.textContent = "";
        }

        if (!formIsValid) {
            event.preventDefault();
        }
    }

    function checkDisponibilidad() {
        if (habitacionSelect.options.length === 1 && habitacionSelect.options[0].disabled) {
            noHabitaciones.style.display = 'block';
            reservaForm.style.display = 'none';
            resumenPrecioElement.style.display = 'none';
        } else {
            noHabitaciones.style.display = 'none';
            reservaForm.style.display = 'block';
            resumenPrecioElement.style.display = 'block';
        }
    }

    runInput.addEventListener('input', function(event) {
        formatRUT(event.target.value);
        if (!validarRUT(runInput.value)) {
            rutError.textContent = "El RUT ingresado no es válido.";
        } else {
            rutError.textContent = "";
        }
    });

    nombresInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            nombresError.textContent = "El nombre solo debe contener letras y un solo espacio entre palabras.";
        } else {
            nombresError.textContent = "";
        }
    });

    apellidosInput.addEventListener('input', function(event) {
        if (!validarTexto(event.target.value)) {
            apellidosError.textContent = "El apellido solo debe contener letras y un solo espacio entre palabras.";
        } else {
            apellidosError.textContent = "";
        }
    });

    emailInput.addEventListener('input', function(event) {
        if (!validarEmail(event.target.value)) {
            emailError.textContent = "El correo electrónico debe terminar en .cl o .com";
        } else {
            emailError.textContent = "";
        }
    });

    habitacionSelect.addEventListener('change', updateTotal);
    reservaForm.addEventListener('submit', validarFormulario);

    // Inicializar el total si ya hay una habitación seleccionada
    if (habitacionSelect.selectedIndex !== -1) {
        updateTotal();
    }

    // Verificar disponibilidad al cargar la página
    checkDisponibilidad();
});
