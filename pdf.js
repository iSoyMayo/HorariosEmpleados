/*==========================================
              PDF HORARIOS
==========================================*/


const btnPDF =
document.getElementById("btnPDF");



//==========================================
// BOTON DESCARGAR PDF
//==========================================


btnPDF.addEventListener(
"click",
()=>{


    generarPDF();


});




//==========================================
// GENERAR PDF
//==========================================


function generarPDF(){


    const { jsPDF } =
    window.jspdf;



    let doc =
    new jsPDF(
        "landscape",
        "mm",
        "a4"
    );



    //==============================
    // TITULO
    //==============================


    doc.setFontSize(22);


    doc.text(
        "HORARIO SEMANAL DE EMPLEADOS",
        148,
        20,
        {
            align:"center"
        }
    );



    //==============================
    // INFORMACION
    //==============================


    doc.setFontSize(11);


    doc.text(

        "Fecha: "
        +
        new Date()
        .toLocaleDateString(),

        20,
        35

    );



    doc.text(

        "Total empleados: "
        +
        totalEmpleados(),

        20,
        42

    );



    //==============================
    // TABLA
    //==============================


    let datos =
    obtenerDatosPDF();



    let filas=[];



    datos.forEach(e=>{


        filas.push([


            e.empleado,


            e.lunes,


            e.martes,


            e.miercoles,


            e.jueves,


            e.viernes,


            e.sabado,


            e.domingo


        ]);


    });





    doc.autoTable({

        startY:50,


        head:[

            [

                "Empleado",

                "Lunes",

                "Martes",

                "Miércoles",

                "Jueves",

                "Viernes",

                "Sábado",

                "Domingo"

            ]

        ],


        body:filas,


        theme:"grid",



        styles:{


            fontSize:9,


            halign:"center"


        },



        headStyles:{


            fillColor:[
                37,
                99,
                235
            ],


            textColor:255


        }


    });





    //==============================
    // RESUMEN
    //==============================


    let posicion =
    doc.lastAutoTable.finalY + 15;



    doc.setFontSize(13);


    doc.text(

        "Resumen de horas",

        20,

        posicion

    );



    posicion +=10;



    doc.setFontSize(10);



    horarios.forEach(emp=>{


        let horas =
        obtenerHorasEmpleado(
            emp.empleado
        );



        doc.text(

            emp.empleado
            +
            ": "
            +
            horas
            +
            " horas",

            25,

            posicion

        );



        posicion+=7;



        // Nueva página
        if(posicion>190){


            doc.addPage();


            posicion=20;


        }


    });





    //==============================
    // PIE DE PAGINA
    //==============================


    let paginas =
    doc.internal.getNumberOfPages();



    for(
        let i=1;
        i<=paginas;
        i++
    ){


        doc.setPage(i);


        doc.setFontSize(9);



        doc.text(

            "Sistema de horarios - Página "
            +
            i
            +
            " de "
            +
            paginas,

            148,

            200,

            {
                align:"center"
            }

        );


    }




    //==============================
    // GUARDAR
    //==============================


    doc.save(
        "Horario_Empleados.pdf"
    );


}