var baseDatos = [];
var baseDatosTotales = [];

function valorActual(buscar) {
    let i = 0;
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == buscar) {
            i = 1;
            document.getElementById('valorActual').value = elemento.valor;
        }
    });
    if (i == 0) {
        document.getElementById("valorActual").value = "0";
    }
    document.getElementById("valorNuevo").value = "";
}

function guardarAtributo(key, value) {
    nuevo = { llave: key, valor: value };
    let i = 0;
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == nuevo.llave) {
            elemento.valor = nuevo.valor;
            i = 1;
        }
    });
    if (i == 0) {
        baseDatos.push(nuevo);
    }
}

function eliminarAtributoArray(key) {
    for (i = 0; i < baseDatos.length; i++) {
        if (baseDatos[i].llave == key) {
            baseDatos.splice(i, 1);
            break;
        }
    }
}

function eliminarNodo(idNodo) {
    for (i = 0; i < baseDatos.length; i++) {
        if ((baseDatos[i].llave).includes(idNodo)) {
            baseDatos.splice(i, 1);
            i--;
        }
    }
}

function mostrarMatriz(ubicacion) {
    console.log(baseDatos);
    var elementos = document.getElementsByClassName("control");
    var vertices = [];
    for (i = 1; i < elementos.length; i++) {
        vertices.push(elementos[i].id);
    }

    var matriz = [];
    matriz = cerearMatriz(matriz, vertices.length);
    for (f = 0; f < baseDatos.length; f++) {
        var origen = baseDatos[f]["llave"].substr(0, 36);
        var destino = baseDatos[f]["llave"].substr(-36);
        var posicion = vertices.length * (vertices.indexOf(origen)) + vertices.indexOf(destino);
        matriz[posicion] = parseInt(baseDatos[f].valor, 10);
    }
    let j = Math.sqrt(matriz.length);

    let aux = 0;
    let html = `
        <table>
            <tr>
                <th></th>`;
    for (s = 0; s < j; s++) {
        html += `<th>${getNombreEstacion(s)}</th>`;
    }
    html += `<th>Suma</th>`
    html += `</tr>`;

    for (l = 0; l < j; l++) {
        html += `<tr><td>${getNombreEstacion(l)}</td>`;
        for (m = 0; m < j; m++) {
            html += `<td>${matriz[aux]}</td>`;
            aux++;
        }

        //suma filas
        var suma = 0;
        for (s1 = l * j; s1 < (l * j) + j; s1++) {
            suma += matriz[s1];
        }
        html += `<td>${suma}</td>`
        html += `</tr>`;
    }

    //suma columnas
    var sumaGeneral = 0;
    html += `<td>Suma</td>`
    for (i = 0; i < j; i++) {
        var sumaC = 0;
        for (s2 = i; s2 < j * j; s2 += j) {
            sumaC += matriz[s2];
        }
        sumaGeneral += sumaC;
        html += `<td>${sumaC}</td>`
    }
    html += `<td>${sumaGeneral}</td>`
    html += `</table>`;
    $(ubicacion).html(html);
}



function cerearMatriz(matriz, n) {
    for (i = 0; i < n * n; i++) {
        matriz[i] = 0;
    }
    return matriz;
}

// PDF
document.addEventListener("DOMContentLoaded", () => {
    const $boton = document.querySelector("#generador");
    $boton.addEventListener("click", () => {
        const $elementoParaConvertir = document.getElementById("pdf");
        html2pdf()
            .set({
                margin: 1,
                filename: 'grafy.pdf',
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 3,
                    letterRendering: true,
                },
                jsPDF: {
                    unit: "in",
                    format: "a3",
                    orientation: 'portrait'
                }
            })
            .from($elementoParaConvertir)
            .save()
            .catch(err => console.log(err));
    });
});

function funcionFondoCB() {
    var checkBox = document.getElementById("flexCheckDefault");
    var bg = document.getElementById("diagram");
    if (checkBox.checked == true) {
        bg.style.background = "none";
        bg.style.backgroundColor = "#ffffff"
    } else {
        bg.style.backgroundImage = "url('../resources/images/Imagen1.png')";
    }
}

function getNombreEstacion(index) {
    nodos = document.getElementsByClassName("control");
    contenido = nodos[index + 1].innerHTML;
    nombre = contenido.substr(141, contenido.length);
    return nombre;
}

//Guardar y subir graphy
function guardarGrafo(){
    var nombreArchivo=document.getElementById("nombreArchivo").value;
    var data = document.getElementById('diagram').innerHTML;
    var contenidoBDD = "";
    for(dato=0;dato<baseDatos.length;dato++){
        contenidoBDD+="llave:"+baseDatos[dato].llave+",valor:"+baseDatos[dato].valor+"|";
    }
    data+=`<div class="contenedor-conexiones"><!--${contenidoBDD}--></div>`;

    var textFileAsBlob = new Blob([data], {type:'text/txt'});
    // Specify the name of the file to be saved
    var fileNameToSaveAs = nombreArchivo+".txt";

    // create a link for our script to 'click'
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "My Hidden Link";
    
    // allow our code to work in webkit & Gecko based browsers
    // without the need for a if / else block.
    window.URL = window.URL || window.webkitURL;
        
    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    // when link is clicked call a function to remove it from
    // the DOM in case user wants to save a second file.
    downloadLink.onclick = destroyClickedElement;
    // make sure the link is hidden.
    downloadLink.style.display = "none";
    // add the link to the DOM
    document.body.appendChild(downloadLink);
    
    // click the new link
    downloadLink.click();

    function destroyClickedElement(event){
    //remove the link from the DOM
        document.body.removeChild(event.target);
    }
}
//--------------------------------------------------------------------------------------------------------------
//Subir grafo
function subirGrafo(evento){
    document.getElementById('diagram').innerHTML='';
    let archivo = evento.target.files[0];
    if(archivo){
        let reader = new FileReader();
        reader.onload = function(e){
            let contenido = e.target.result;
            document.getElementById('diagram').innerHTML = contenido;    
        }
        reader.readAsText(archivo);
        document.querySelector("#habilitar-div").classList.add('habilitar-activo');
    } else {
        window.alert("No se ha seleccionado un archivo.");   
    }
}
// Funcion para detectar la carga del archivo
window.addEventListener('load', () => {
    document.getElementById('file-input').addEventListener('change', subirGrafo);
});

// Funcion para activar el input-file al presionar el boton Subir graphy.
document.getElementById("subirGrafo").addEventListener('click', function() {
    document.getElementById("file-input").click();
});
