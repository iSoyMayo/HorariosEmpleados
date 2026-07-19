/*==========================================
            SISTEMA DE HORARIOS
            PARTE 3A
==========================================*/

//==========================================
// NAVEGACION DE SECCIONES
//==========================================

const btnInicio = document.getElementById("btnInicio");
const btnEmpleados = document.getElementById("btnEmpleados");
const btnHorario = document.getElementById("btnHorario");
const btnPDF = document.getElementById("btnPDF");

const secInicio = document.getElementById("secInicio");
const secEmpleados = document.getElementById("secEmpleados");
const secHorarios = document.getElementById("secHorarios");

function mostrarSeccion(seccion) {
    secInicio.style.display = "none";
    secEmpleados.style.display = "none";
    secHorarios.style.display = "none";
    
    seccion.style.display = "block";
}

btnInicio.addEventListener("click", () => {
    mostrarSeccion(secInicio);
});

btnEmpleados.addEventListener("click", () => {
    mostrarSeccion(secEmpleados);
});

btnHorario.addEventListener("click", () => {
    mostrarSeccion(secHorarios);
});

//==========================================
// VARIABLES
//==========================================

const txtEmpleado = document.getElementById("txtEmpleado");

const btnAgregar = document.getElementById("btnAgregar");

const btnEliminar = document.getElementById("btnEliminar");

const btnEditar = document.getElementById("btnEditar");

const btnAsignarRol = document.getElementById("btnAsignarRol");

const cmbRol = document.getElementById("cmbRol");

const rolActual = document.getElementById("rolActual");

const listaEmpleados = document.getElementById("listaEmpleados");

const cmbEmpleado = document.getElementById("cmbEmpleado");
const fechaInicioSemana = document.getElementById("fechaInicioSemana");

let empleados = [];

function obtenerFechaActualInput() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function obtenerFechaReferencia() {
    if (fechaInicioSemana && fechaInicioSemana.value) {
        const [year, month, day] = fechaInicioSemana.value.split("-").map(Number);
        const fecha = new Date(year, month - 1, day);
        fecha.setHours(12, 0, 0, 0);
        return fecha;
    }

    return new Date();
}

function obtenerLunesSiguiente(fechaReferencia) {
    const fecha = new Date(fechaReferencia);
    fecha.setHours(12, 0, 0, 0);

    const dia = fecha.getDay();
    const diasHastaLunes = dia === 1 ? 0 : (dia === 0 ? 1 : 8 - dia);

    fecha.setDate(fecha.getDate() + diasHastaLunes);
    return fecha;
}

function formatearFechaCorta(fecha) {
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


//==========================================
// CARGAR EMPLEADOS
//==========================================

function cargarEmpleados(){

    const datos = localStorage.getItem("empleados");

    if(datos){

        empleados = JSON.parse(datos);

    }else{

        empleados = [];

    }

    actualizarLista();

}

window.onload = function(){

    cargarEmpleados();
    
    cargarHorarios();
    
    limpiarFormulario();

    if (fechaInicioSemana) {
        fechaInicioSemana.value = obtenerFechaActualInput();
    }

}


//==========================================
// GUARDAR
//==========================================

function guardarEmpleados(){

    localStorage.setItem(
        "empleados",
        JSON.stringify(empleados)
    );

}


//==========================================
// ACTUALIZAR LISTAS
//==========================================

function actualizarLista(){

    listaEmpleados.innerHTML = "";

    cmbEmpleado.innerHTML = "";

    empleados.forEach((empleadoObj,index)=>{

        const nombre = typeof empleadoObj === 'string' ? empleadoObj : empleadoObj.nombre;
        const rol = typeof empleadoObj === 'string' ? 'Colaborador' : (empleadoObj.rol || 'Colaborador');

        //-----------------------
        // LISTBOX
        //-----------------------

        const option = document.createElement("option");

        option.textContent = nombre + " (" + rol + ")";

        option.value = index;

        listaEmpleados.appendChild(option);

        //-----------------------
        // COMBO
        //-----------------------

        const combo = document.createElement("option");

        combo.textContent = nombre;

        combo.value = nombre;

        cmbEmpleado.appendChild(combo);

    });

}


//==========================================
// AGREGAR EMPLEADO
//==========================================

btnAgregar.addEventListener("click",()=>{

    let nombre = txtEmpleado.value.trim();

    if(nombre===""){

        alert("Escribe un nombre.");

        txtEmpleado.focus();

        return;

    }

    //----------------------------------

    const yaExiste = empleados.some(e => {
        const n = typeof e === 'string' ? e : e.nombre;
        return n === nombre;
    });

    if(yaExiste){

        alert("Ese empleado ya existe.");

        return;

    }

    //----------------------------------

    empleados.push({
        nombre: nombre,
        rol: "Colaborador"
    });

    guardarEmpleados();

    actualizarLista();

    txtEmpleado.value="";

    txtEmpleado.focus();

});


//==========================================
// ELIMINAR
//==========================================

btnEliminar.addEventListener("click",()=>{

    let indice = listaEmpleados.selectedIndex;

    if(indice==-1){

        alert("Selecciona un empleado.");

        return;

    }

    if(!confirm("¿Eliminar empleado?")){

        return;

    }

    empleados.splice(indice,1);

    guardarEmpleados();

    actualizarLista();
    
    rolActual.textContent = "-";

});


//==========================================
// EDITAR
//==========================================

btnEditar.addEventListener("click",()=>{

    let indice = listaEmpleados.selectedIndex;

    if(indice==-1){

        alert("Selecciona un empleado.");

        return;

    }

    const empleadoObj = empleados[indice];
    const nombreActual = typeof empleadoObj === 'string' ? empleadoObj : empleadoObj.nombre;

    let nuevo = prompt(
        "Nuevo nombre:",
        nombreActual
    );

    if(nuevo==null){

        return;

    }

    nuevo = nuevo.trim();

    if(nuevo==""){

        return;

    }

    if(typeof empleados[indice] === 'string') {
        empleados[indice] = {
            nombre: nuevo,
            rol: 'Colaborador'
        };
    } else {
        empleados[indice].nombre = nuevo;
    }

    guardarEmpleados();

    actualizarLista();

});


//==========================================
// DOBLE CLICK
//==========================================

listaEmpleados.addEventListener("dblclick",()=>{

    let indice = listaEmpleados.selectedIndex;

    if(indice==-1){

        return;

    }

    const empleadoObj = empleados[indice];
    const nombre = typeof empleadoObj === 'string' ? empleadoObj : empleadoObj.nombre;
    
    cmbEmpleado.value = nombre;

});


//==========================================
// MOSTRAR ROL ACTUAL
//==========================================

listaEmpleados.addEventListener("change", () => {
    
    let indice = listaEmpleados.selectedIndex;
    
    if(indice === -1) {
        rolActual.textContent = "-";
        return;
    }
    
    const empleadoObj = empleados[indice];
    const rol = typeof empleadoObj === 'string' ? 'Colaborador' : (empleadoObj.rol || 'Colaborador');
    
    rolActual.textContent = rol;
});


//==========================================
// ASIGNAR ROL
//==========================================

btnAsignarRol.addEventListener("click", () => {
    
    let indice = listaEmpleados.selectedIndex;
    
    if(indice === -1) {
        alert("Selecciona un empleado");
        return;
    }
    
    const nuevoRol = cmbRol.value;
    
    // Convertir a objeto si es string
    if(typeof empleados[indice] === 'string') {
        empleados[indice] = {
            nombre: empleados[indice],
            rol: nuevoRol
        };
    } else {
        empleados[indice].rol = nuevoRol;
    }
    
    guardarEmpleados();
    actualizarLista();
    rolActual.textContent = nuevoRol;
    
    alert("Rol asignado: " + nuevoRol);
});


//==========================================
// BUSCAR EMPLEADO
//==========================================

function buscarEmpleado(nombre){

    return empleados.find(e => {
        const n = typeof e === 'string' ? e : e.nombre;
        return n === nombre;
    });

}


//==========================================
// ORDENAR
//==========================================

function ordenarEmpleados(){

    empleados.sort((a, b) => {
        const nameA = typeof a === 'string' ? a : a.nombre;
        const nameB = typeof b === 'string' ? b : b.nombre;
        return nameA.localeCompare(nameB);
    });

    guardarEmpleados();

    actualizarLista();

}


//==========================================
// BOTON DERECHO (ORDENAR)
//==========================================

listaEmpleados.addEventListener("contextmenu",(e)=>{

    e.preventDefault();

    ordenarEmpleados();

    alert("Empleados ordenados.");

});

/*==========================================
            PARTE 3B
       GESTION DE HORARIOS
==========================================*/


//==========================================
// VARIABLES DE HORARIO
//==========================================


const btnGuardarHorario = 
document.getElementById("btnGuardarHorario");

const btnActualizarHorario =
document.getElementById("btnActualizarHorario");

const btnLimpiar = 
document.getElementById("btnLimpiar");



//==========================================
// DIAS DE LA SEMANA
//==========================================


const dias = [

    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"

];



//==========================================
// ASIGNAR HORARIOS POR TURNO
//==========================================

function asignarHorarioPorTurno(dia, turno) {
    
    const esFinDeSemana = dia === "sabado" || dia === "domingo";
    
    const inputEntrada = document.getElementById(dia + "Entrada");
    const inputSalida = document.getElementById(dia + "Salida");
    const checkboxTrabaja = document.getElementById(dia + "Trabaja");
    
    if(turno === "Apertura") {
        checkboxTrabaja.checked = true;
        inputEntrada.value = "09:00";
        inputSalida.value = "17:00";
    } 
    else if(turno === "Cierre") {
        checkboxTrabaja.checked = true;
        if(esFinDeSemana) {
            inputEntrada.value = "14:00";
            inputSalida.value = "22:00";
        } else {
            inputEntrada.value = "13:00";
            inputSalida.value = "21:00";
        }
    } 
    else if(turno === "Intermedio") {
        checkboxTrabaja.checked = true;
        inputEntrada.value = "";
        inputSalida.value = "";
    }
    else if(turno === "") {
        checkboxTrabaja.checked = false;
        inputEntrada.value = "";
        inputSalida.value = "";
    }
}

//==========================================
// CARGAR HORARIOS
//==========================================


let horarios = [];



function cargarHorarios(){

    let datos = localStorage.getItem("horarios");


    if(datos){

        horarios = JSON.parse(datos);

    }else{

        horarios=[];

    }

}


cargarHorarios();



//==========================================
// GUARDAR HORARIOS
//==========================================


function guardarHorarios(){

    localStorage.setItem(
        "horarios",
        JSON.stringify(horarios)
    );

}



//==========================================
// OBTENER DATOS DEL FORMULARIO
//==========================================


function obtenerHorarioFormulario(){


    let horario = {};


    dias.forEach(dia=>{


        horario[dia]={


            trabaja:
            document.getElementById(
                dia+"Trabaja"
            ).checked,


            entrada:
            document.getElementById(
                dia+"Entrada"
            ).value,


            salida:
            document.getElementById(
                dia+"Salida"
            ).value,


            turno:
            document.getElementById(
                dia+"Turno"
            ).value


        };


    });



    return horario;


}




//==========================================
// CARGAR DATOS AL FORMULARIO
//==========================================


function cargarHorarioFormulario(datos){


    dias.forEach(dia=>{


        document.getElementById(
            dia+"Trabaja"
        ).checked =
        datos[dia].trabaja;



        document.getElementById(
            dia+"Entrada"
        ).value =
        datos[dia].entrada;



        document.getElementById(
            dia+"Salida"
        ).value =
        datos[dia].salida;



        document.getElementById(
            dia+"Turno"
        ).value =
        datos[dia].turno;



    });


}




//==========================================
// GUARDAR HORARIO
//==========================================


btnGuardarHorario.addEventListener(
"click",
()=>{


    let empleado =
    cmbEmpleado.value;



    if(empleado===""){

        alert(
        "Selecciona un empleado"
        );

        return;

    }



    let nuevoHorario =
    obtenerHorarioFormulario();

    
    // Validar turnos intermedios no excedan 8 horas
    for(let dia of dias) {
        if(nuevoHorario[dia].turno === "Intermedio" && 
           nuevoHorario[dia].trabaja &&
           nuevoHorario[dia].entrada &&
           nuevoHorario[dia].salida) {
            
            const horas = calcularHoras(nuevoHorario[dia].entrada, nuevoHorario[dia].salida);
            if(horas > 8) {
                alert(`El turno intermedio de ${dia} excede 8 horas (${horas.toFixed(2)} horas). Por favor corrige los horarios.`);
                return;
            }
        }
    }



    let existe =
    horarios.findIndex(
        h=>h.empleado===empleado
    );



    let registro={


        empleado:empleado,


        horario:nuevoHorario,


        fecha:
        new Date()
        .toLocaleDateString()



    };



    if(existe>=0){


        horarios[existe]=registro;


        alert(
        "Horario actualizado"
        );


    }else{


        horarios.push(registro);


        alert(
        "Horario guardado"
        );


    }



    guardarHorarios();


    mostrarTablaHorarios();


});




//==========================================
// ACTUALIZAR HORARIO
//==========================================


btnActualizarHorario.addEventListener(
"click",
()=>{


    let empleado =
    cmbEmpleado.value;



    if(empleado===""){

        alert(
        "Selecciona un empleado"
        );

        return;

    }



    let nuevoHorario =
    obtenerHorarioFormulario();

    
    // Validar turnos intermedios no excedan 8 horas
    for(let dia of dias) {
        if(nuevoHorario[dia].turno === "Intermedio" && 
           nuevoHorario[dia].trabaja &&
           nuevoHorario[dia].entrada &&
           nuevoHorario[dia].salida) {
            
            const horas = calcularHoras(nuevoHorario[dia].entrada, nuevoHorario[dia].salida);
            if(horas > 8) {
                alert(`El turno intermedio de ${dia} excede 8 horas (${horas.toFixed(2)} horas). Por favor corrige los horarios.`);
                return;
            }
        }
    }



    let existe =
    horarios.findIndex(
        h=>h.empleado===empleado
    );



    let registro={


        empleado:empleado,


        horario:nuevoHorario,


        fecha:
        new Date()
        .toLocaleDateString()



    };



    if(existe>=0){


        horarios[existe]=registro;


        alert(
        "Horario actualizado correctamente"
        );


    }else{


        horarios.push(registro);


        alert(
        "Horario guardado"
        );


    }



    guardarHorarios();


    mostrarTablaHorarios();


});




//==========================================
// CAMBIAR EMPLEADO
//==========================================


cmbEmpleado.addEventListener(
"change",
()=>{


    let empleado =
    cmbEmpleado.value;



    let encontrado =
    horarios.find(
        h=>h.empleado===empleado
    );



    if(encontrado){


        cargarHorarioFormulario(
            encontrado.horario
        );
        
        btnGuardarHorario.style.display = "none";
        btnActualizarHorario.style.display = "inline-block";


    }else{


        limpiarFormulario();
        
        btnGuardarHorario.style.display = "inline-block";
        btnActualizarHorario.style.display = "none";


    }


});




//==========================================
// LIMPIAR FORMULARIO
//==========================================


function limpiarFormulario(){


    dias.forEach(dia=>{


        document.getElementById(
            dia+"Trabaja"
        ).checked=false;



        document.getElementById(
            dia+"Entrada"
        ).value="";



        document.getElementById(
            dia+"Salida"
        ).value="";



        document.getElementById(
            dia+"Turno"
        ).selectedIndex=0;


    });


}



btnLimpiar.addEventListener(
"click",
()=>{


    limpiarFormulario();
    
    btnGuardarHorario.style.display = "inline-block";
    btnActualizarHorario.style.display = "none";


});




//==========================================
// VALIDAR MAXIMO 8 HORAS
// (BASE PARA TU LOGICA)
//==========================================


function calcularHoras(
entrada,
salida
){


    if(!entrada || !salida)
    return 0;



    let inicio =
    new Date(
        "2000-01-01 "
        +entrada
    );


    let fin =
    new Date(
        "2000-01-01 "
        +salida
    );



    let diferencia =
    (fin-inicio)
    /
    1000
    /
    60
    /
    60;



    return diferencia;


}



function validarHoras(horario){


    let total=0;


    dias.forEach(dia=>{


        if(
        horario[dia].trabaja
        ){


            total +=
            calcularHoras(
                horario[dia].entrada,
                horario[dia].salida
            );


        }


    });



    return total;



}

/*==========================================
            PARTE 3C
      TABLA GENERAL DE HORARIOS
==========================================*/


//==========================================
// TABLA GENERAL
//==========================================


function mostrarTablaHorarios(){


    const tabla =
    document.querySelector(
        "#tablaGeneral tbody"
    );



    tabla.innerHTML="";



    horarios.forEach(registro=>{


        let fila =
        document.createElement("tr");
        
        fila.style.cursor = "pointer";
        fila.addEventListener("click", () => {
            cmbEmpleado.value = registro.empleado;
            cmbEmpleado.dispatchEvent(new Event('change'));
            mostrarSeccion(secHorarios);
        });



        let empleado =
        document.createElement("td");


        empleado.textContent =
        registro.empleado;



        fila.appendChild(
            empleado
        );



        dias.forEach(dia=>{


            let celda =
            document.createElement("td");



            let datos =
            registro.horario[dia];



            if(
            datos.trabaja
            &&
            datos.entrada
            &&
            datos.salida
            ){


                celda.innerHTML =

                `
                <b>${datos.entrada}</b>
                <br>
                -
                <br>
                <b>${datos.salida}</b>
                <br>
                <small>
                ${datos.turno}
                </small>
                `;


            }
            else{


                celda.innerHTML =

                `
                <span>
                DESCANSO
                </span>
                `;


            }



            fila.appendChild(
                celda
            );



        });



        tabla.appendChild(
            fila
        );



    });


}



//==========================================
// CARGAR TABLA AL INICIO
//==========================================


setTimeout(()=>{

    mostrarTablaHorarios();

},500);




//==========================================
// OBTENER HORARIOS PARA PDF
//==========================================


function obtenerDatosPDF(){


    let datos=[];



    horarios.forEach(registro=>{


        let fila = {


            empleado:
            registro.empleado,


            lunes:
            convertirTexto(
            registro.horario.lunes
            ),


            martes:
            convertirTexto(
            registro.horario.martes
            ),


            miercoles:
            convertirTexto(
            registro.horario.miercoles
            ),


            jueves:
            convertirTexto(
            registro.horario.jueves
            ),


            viernes:
            convertirTexto(
            registro.horario.viernes
            ),


            sabado:
            convertirTexto(
            registro.horario.sabado
            ),


            domingo:
            convertirTexto(
            registro.horario.domingo
            )


        };



        datos.push(
            fila
        );


    });



    return datos;


}




//==========================================
// CONVERTIR HORARIO A TEXTO
//==========================================


function convertirTexto(dia){


    if(
    dia.trabaja
    &&
    dia.entrada
    &&
    dia.salida
    ){


        return (

            dia.entrada
            +
            " - "
            +
            dia.salida

        );


    }



    return "DESCANSO";


}




//==========================================
// CONTAR EMPLEADOS
//==========================================


function totalEmpleados(){


    return horarios.length;


}




//==========================================
// CONTAR HORAS POR EMPLEADO
//==========================================


function obtenerHorasEmpleado(nombre){


    let empleado =
    horarios.find(
        h=>h.empleado===nombre
    );



    if(!empleado)
    return 0;



    let total=0;



    dias.forEach(dia=>{


        if(
        empleado.horario[dia].trabaja
        ){


            total +=
            calcularHoras(

                empleado.horario[dia].entrada,

                empleado.horario[dia].salida

            );


        }


    });



    return total;



}



//==========================================
// EVENT LISTENERS PARA CAMBIO DE TURNO
//==========================================

dias.forEach(dia => {
    
    const selectTurno = document.getElementById(dia + "Turno");
    const inputEntrada = document.getElementById(dia + "Entrada");
    const inputSalida = document.getElementById(dia + "Salida");
    
    selectTurno.addEventListener("change", (e) => {
        asignarHorarioPorTurno(dia, e.target.value);
    });
    
    // Validar máximo 8 horas para intermedio
    inputSalida.addEventListener("change", () => {
        validarMaximoOchoHoras(dia);
    });
    
    inputEntrada.addEventListener("change", () => {
        validarMaximoOchoHoras(dia);
    });
});

//==========================================
// VALIDAR MAXIMO 8 HORAS PARA INTERMEDIO
//==========================================

function validarMaximoOchoHoras(dia) {
    
    const selectTurno = document.getElementById(dia + "Turno");
    const inputEntrada = document.getElementById(dia + "Entrada");
    const inputSalida = document.getElementById(dia + "Salida");
    
    if(selectTurno.value === "Intermedio") {
        
        const horas = calcularHoras(inputEntrada.value, inputSalida.value);
        
        if(horas > 8) {
            alert("El turno intermedio no puede exceder 8 horas. Horas ingresadas: " + horas.toFixed(2));
            inputSalida.value = "";
            inputEntrada.value = "";
        }
    }
}



//==========================================
// ACTUALIZAR TODO
//==========================================


function actualizarSistema(){


    guardarEmpleados();


    guardarHorarios();


    actualizarLista();


    mostrarTablaHorarios();


}



//==========================================
// EXPORTAR DATOS
//==========================================


function exportarDatos(){


    return {


        empleados:
        empleados,


        horarios:
        horarios,


        fecha:
        new Date()
        .toLocaleDateString()


    };


}


//==========================================
// GENERAR PDF
//==========================================

function agregarAreaFirmas(doc, pageWidth, pageHeight, margin, empleados) {
    const yInicio = pageHeight - 78;
    const altoFila = 7;
    const xNombre = margin;
    const xFirma = pageWidth * 0.55;
    let yActual = yInicio;

    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.2);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Listado de empleados y firma", margin, yActual - 6);

    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("Empleado", xNombre, yActual);
    doc.text("Firma", xFirma, yActual);
    yActual += 4;
    doc.line(margin, yActual, pageWidth - margin, yActual);
    yActual += 4;

    empleados.forEach((empleado, index) => {
        if (yActual + altoFila > pageHeight - 12) {
            doc.addPage();
            yActual = 20;
            doc.setFontSize(9);
            doc.setFont(undefined, "bold");
            doc.text("Listado de empleados y firma", margin, yActual - 6);
            yActual += 8;
            doc.setFontSize(8);
            doc.setFont(undefined, "bold");
            doc.text("Empleado", xNombre, yActual);
            doc.text("Firma", xFirma, yActual);
            yActual += 4;
            doc.line(margin, yActual, pageWidth - margin, yActual);
            yActual += 4;
        }

        const textoEmpleado = `${index + 1}. ${empleado.nombre}`;
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(textoEmpleado, xNombre, yActual);
        doc.line(xFirma, yActual + 1, pageWidth - margin, yActual + 1);
        yActual += altoFila;
    });
}

btnPDF.addEventListener("click", () => {
    
    if(horarios.length === 0) {
        alert("No hay horarios para descargar");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 8;
    const colWidth = (pageWidth - margin - 40) / 7;
    
    const colores = {
        "Apertura": { bg: [255, 255, 150], text: [0, 0, 0] },
        "Cierre": { bg: [150, 220, 255], text: [0, 0, 0] },
        "Intermedio": { bg: [255, 180, 220], text: [0, 0, 0] },
        "DESCANSO": { bg: [220, 220, 220], text: [100, 100, 100] }
    };

    const fechaReferencia = obtenerFechaReferencia();
    const lunes = obtenerLunesSiguiente(fechaReferencia);
    const diasSemana = Array.from({ length: 7 }, (_, index) => {
        const fecha = new Date(lunes);
        fecha.setDate(lunes.getDate() + index);
        return {
            etiqueta: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"][index],
            fecha
        };
    });
    
    let yPos = 8;
    
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(80, 40, 80);
    doc.text("HORARIO SEMANAL", pageWidth / 2, yPos, { align: "center" });
    yPos += 6;
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
        "Semana: " + formatearFechaCorta(diasSemana[0].fecha) + " al " + formatearFechaCorta(diasSemana[6].fecha),
        pageWidth / 2,
        yPos,
        { align: "center" }
    );
    yPos += 5;
    
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    
    let xPos = margin + 40;
    diasSemana.forEach((dia) => {
        doc.setFillColor(200, 200, 200);
        doc.rect(xPos - colWidth / 2, yPos - 3, colWidth, 8, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(dia.etiqueta, xPos, yPos - 1.5, { align: "center", maxWidth: colWidth - 1 });
        doc.setFontSize(6);
        doc.text(formatearFechaCorta(dia.fecha), xPos, yPos + 2, { align: "center", maxWidth: colWidth - 1 });
        doc.setFontSize(8);
        
        xPos += colWidth;
    });
    
    yPos += 8;
    
    const empleadosHorarios = horarios.map(registro => ({
        nombre: registro.empleado,
        horarios: registro.horario
    }));
    
    const cellHeight = 7;
    
    empleadosHorarios.forEach((empleadoData) => {
        if(yPos + cellHeight + 18 > pageHeight - 25) {
            doc.addPage();
            yPos = 8;
        }
        
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPos, 38, cellHeight, "F");
        doc.setFontSize(8);
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);
        const nombreCorto = empleadoData.nombre.length > 16 ? empleadoData.nombre.substring(0, 16) : empleadoData.nombre;
        doc.text(nombreCorto, margin + 2, yPos + cellHeight - 1.5, { maxWidth: 35 });
        
        xPos = margin + 40;
        diasSemana.forEach((dia) => {
            const diaLower = dia.etiqueta.toLowerCase();
            const dato = empleadoData.horarios[diaLower];
            
            if(dato && dato.trabaja) {
                const turno = dato.turno;
                const texto = dato.entrada.substring(0, 5) + "-" + dato.salida.substring(0, 5);
                const colorBg = colores[turno].bg;
                const colorText = colores[turno].text;
                
                doc.setFillColor(...colorBg);
                doc.rect(xPos - colWidth / 2, yPos, colWidth, cellHeight, "F");
                doc.setTextColor(...colorText);
                doc.setFont(undefined, "bold");
                doc.setFontSize(8);
                doc.text(texto, xPos, yPos + cellHeight - 1.5, { align: "center", maxWidth: colWidth - 2 });
            } else {
                doc.setFillColor(220, 220, 220);
                doc.rect(xPos - colWidth / 2, yPos, colWidth, cellHeight, "F");
                doc.setTextColor(100, 100, 100);
                doc.setFont(undefined, "bold");
                doc.setFontSize(8);
                doc.text("D", xPos, yPos + cellHeight - 1.5, { align: "center" });
            }
            
            xPos += colWidth;
        });
        
        yPos += cellHeight + 0.5;
    });
    
    agregarAreaFirmas(doc, pageWidth, pageHeight, margin, empleadosHorarios);
    
    doc.setFontSize(7);
    doc.setFont(undefined, "normal");
    
    const leyendas = [
        { color: [255, 255, 150], text: "Apertura 09:00-17:00" },
        { color: [150, 220, 255], text: "Cierre 13:00-21:00 (14-22 fin)" },
        { color: [255, 180, 220], text: "Intermedio" },
        { color: [220, 220, 220], text: "Descanso (D)" }
    ];
    
    let leyendaX = margin;
    leyendas.forEach((leyenda) => {
        doc.setFillColor(...leyenda.color);
        doc.rect(leyendaX, pageHeight - 22, 2.5, 2.5, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(leyenda.text, leyendaX + 3.5, pageHeight - 20);
        leyendaX += 67;
    });
    
    window.open(doc.output("bloburi"), "_blank");
    
});