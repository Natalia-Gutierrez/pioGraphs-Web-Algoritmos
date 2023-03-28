var baseDatos = [];
var idBotonAtributos = "";
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
    idBotonAtributos = "";
}

function eliminarAtributoArray(key) {
    for (i = 0; i < baseDatos.length; i++) {
        if (baseDatos[i].llave == key) {
            baseDatos.splice(i, 1);
            break;
        }
    }
    idBotonAtributos = "";
}

function eliminarNodo(idNodo) {
    for (i = 0; i < baseDatos.length; i++) {
        if ((baseDatos[i].llave).includes(idNodo)) {
            baseDatos.splice(i, 1);
            i--;
        }
    }
    idBotonAtributos = "";
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
    nombre = contenido.substr(contenido.indexOf("Punto"), contenido.length);
    return nombre;
}

//-----------------------------------------------------------------------------------------------------------------------------------
//calculo atributos y holgura
function calcular(id){
    calcularAtributos(id);
    calcularHolgura();
}

//Función para calcular los atributos.
function calcularAtributos(id){
    //Validar que todas las conexiones esten almacenadas en la base de datos.
    if (validarNumeroTotalConexiones()){
        //Validar que exista solo un nodo final.
        if (ultimoNodo()){
            idBotonAtributos = id;
            calcularAtributosSuma();
            calcularAtributosResta();
        }
    }
}

//Función para validar que existan conexiones y todas tengan valor.
function validarNumeroTotalConexiones(){
    var flag = true;
    var elementos = document.getElementsByClassName("jtk-connector");
    if (elementos.length==0){
        window.alert("No es posible calcular los atributos, no existe ninguna conexión.");
        flag = false;
    }
    if (baseDatos.length!=elementos.length){
        window.alert("No es posible calcular los atributos hasta llenar todos los valores para las conexiones.");
        flag = false;
    }
    return flag;
}

//Función para validar que exista solo un nodo final.
function ultimoNodo(){
    var flag = true;
    var nodos = document.getElementsByClassName("control");
    var salidas = [];
    var cont = 0;
    for(i=0; i<baseDatos.length; i++){
        var nodo = baseDatos[i]["llave"];
        idNodoOrigen = nodo.substr(0, 36);
        if(!salidas.includes(idNodoOrigen)){
            salidas[cont] = idNodoOrigen;
            cont++;
        }
    }
    if(salidas.length!=nodos.length-2){
        window.alert("No es posible calcular los atributos si hay más de un nodo final o si hay un nodo suelto.");
        flag = false;
    }
    return flag;
}

function calcularAtributosResta(){
    var nodos = document.getElementsByClassName('control');
    var nodo = "";
    var cantidadSalidas = 0;
    for(u=1; u<nodos.length; u++){
        cantidadSalidas = cantidadSalidasNodo(nodos[u].id);
        if(cantidadSalidas==0){
            nodo = nodos[u];
            break;
        }
    }
    for(i=1; i<nodos.length; i++){
        var cantidadEntradas = cantidadEntradasNodo(nodo.id);
        var valores = nodo.getElementsByTagName("td");
        //Primer nodo.
        if(i == 1){
            valores[1].innerHTML = valores[0].innerHTML;
        }
        //Solo una entrada
        if(cantidadEntradas == 1){
            //Calculo del atributo para el nodo anterior.
            var nodoP = "";
            for(n=0; n<baseDatos.length; n++){
                if(baseDatos[n].llave.substr(-36) == nodo.id){
                    nodoP = baseDatos[n].llave.substr(0, 36);
                    break;
                }
            }
            var nodoPrevio = encontrarNodo(nodoP);
            var valoresPrevio = nodoPrevio.getElementsByTagName("td");
            valoresPrevio[1].innerHTML = parseInt(valores[1].innerHTML)-parseInt(valorFlecha(nodoPrevio.id+nodo.id));
            nodo = nodoPrevio;
        }
        //Mas de una entrada.
        if (cantidadEntradas > 1){
            //Calculo de los atributos para los anteriores nodos y devolver el nodo para cantinuar.
            nodo = calculoAtributosNodosResta(nodo);
        }
        if (cantidadEntradas == 0){
            break;
        }
    }
}

function calcularAtributosSuma(){
    var nodos = document.getElementsByClassName('control');
    var nodo = nodos[1];
    for(i=1; i<nodos.length; i++){
        var cantidadSalidas = cantidadSalidasNodo(nodo.id);
        var valores = nodo.getElementsByTagName("td");
        //Primer nodo.
        if(i == 1){
            valores[0].innerHTML = 0;
        }
        //Solo una salida
        if(cantidadSalidas == 1){
            //Calculo del atributo para el nodo siguiente.
            var nodoN = "";
            for(n=0; n<baseDatos.length; n++){
                if(baseDatos[n].llave.substr(0, 36) == nodo.id){
                    nodoN = baseDatos[n].llave.substr(-36);
                    break;
                }
            }
            var nodoNext = encontrarNodo(nodoN);
            var valoresNext = nodoNext.getElementsByTagName("td");
            valoresNext[0].innerHTML = parseInt(valorFlecha(nodo.id+nodoNext.id))+parseInt(valores[0].innerHTML);
            nodo = nodoNext;
        }
        //Mas de una salida.
        if (cantidadSalidas > 1){
            //Calculo de los atributos para los siguientes nodos y devolver el nodo para cantinuar.
            nodo = calculoAtributosNodos(nodo);
        }
        if (cantidadSalidas == 0){
            break;
        }
    }
}

//Cantidad de flechas que entran al nodo.
function cantidadEntradasNodo(id){
    var aux = 0;
    for(j=0; j<baseDatos.length; j++){
        if(baseDatos[j].llave.substr(-36) == id){
            aux++;
        }
    }
    return aux;
}
//Cantidad de flechas que salen al nodo.
function cantidadSalidasNodo(id){
    var aux = 0;
    for(j=0; j<baseDatos.length; j++){
        if(baseDatos[j].llave.substr(0, 36) == id){
            aux++;
        }
    }
    return aux;
}
//Encontrar un nodo por su id.
function encontrarNodo(id){
    var nodos = document.getElementsByClassName('control');
    var nodo = "";
    for(m=0; m<nodos.length; m++){
        if(nodos[m].id == id){
            nodo = nodos[m];
            break;
        }
    }
    return nodo;
}
//Devuelve el valor de una flecha por su id.
function valorFlecha(llave){
    var aux = 0;
    for(n=0; n<baseDatos.length; n++){
        if(baseDatos[n].llave == llave){
            aux = baseDatos[n].valor;
            break;
        }
    }
    return aux;
}
//Calculo de multiples salidas y entradas (Suma).
function calculoAtributosNodosResta(nodo){
    var conexiones = [];
    for(s=0; s<baseDatos.length; s++){
        if(baseDatos[s].llave.substr(-36) == nodo.id){
            conexiones.push(baseDatos[s]);
        }
    }
    var valores = nodo.getElementsByTagName("td");
    for(j=0; j<conexiones.length; j++){
        var nodoPrevio = encontrarNodo(conexiones[j].llave.substr(0, 36));
        var valoresPrevio = nodoPrevio.getElementsByTagName("td");
        valoresPrevio[1].innerHTML = parseInt(valores[1].innerHTML)-parseInt(conexiones[j].valor);
    }
    var combinaciones = [];
    for (cb=0; cb<conexiones.length; cb++){
        for (cm=0; cm<conexiones.length; cm++){
            combinaciones.push(conexiones[cb].llave.substr(0, 36)+conexiones[cm].llave.substr(0, 36));
        }
    }
    var nodoDivergencia = "";
    for(t=0; t<baseDatos.length; t++){
        if(baseDatos[t].llave.substr(-36) == conexiones[0].llave.substr(0, 36)){
            nodoDivergencia = encontrarNodo(baseDatos[t].llave.substr(0, 36));
            break;
        }
    }
    for(b=0; b<baseDatos.length; b++){
        for(e=0; e<combinaciones.length; e++){
            if(baseDatos[b].llave == combinaciones[e]){
                nodoDivergencia = encontrarNodo(combinaciones[e].substr(0, 36));
                break;
            }
        }
    }
    console.log(nodoDivergencia);
    var posiblesValores = [];
    for(s=0; s<baseDatos.length; s++){
        if(baseDatos[s].llave.substr(0, 36) == nodoDivergencia.id){
            var n = encontrarNodo(baseDatos[s].llave.substr(-36));
            var valoresNext = n.getElementsByTagName("td");
            posiblesValores.push(parseInt(valoresNext[1].innerHTML)-parseInt(baseDatos[s].valor));
        }
    }
    var valorUltimo = nodoDivergencia.getElementsByTagName("td");
    valorUltimo[1].innerHTML = Math.min.apply(null,posiblesValores);
    return nodoDivergencia;
}
//Calculo de multiples salidas y entradas (Suma).
function calculoAtributosNodos(nodo){
    var conexiones = [];
    for(s=0; s<baseDatos.length; s++){
        if(baseDatos[s].llave.substr(0, 36) == nodo.id){
            conexiones.push(baseDatos[s]);
        }
    }
    var valores = nodo.getElementsByTagName("td");
    for(j=0; j<conexiones.length; j++){
        var nodoNext = encontrarNodo(conexiones[j].llave.substr(-36));
        var valoresNext = nodoNext.getElementsByTagName("td");
        valoresNext[0].innerHTML = parseInt(conexiones[j].valor)+parseInt(valores[0].innerHTML);
    }
    var combinaciones = [];
    for (cb=0; cb<conexiones.length; cb++){
        for (cm=0; cm<conexiones.length; cm++){
            combinaciones.push(conexiones[cb].llave.substr(-36)+conexiones[cm].llave.substr(-36));
        }
    }
    var nodoConvergencia = "";
    for(t=0; t<baseDatos.length; t++){
        if(baseDatos[t].llave.substr(0, 36) == conexiones[0].llave.substr(-36)){
            nodoConvergencia = encontrarNodo(baseDatos[t].llave.substr(-36));
            break;
        }
    }
    for(b=0; b<baseDatos.length; b++){
        for(e=0; e<combinaciones.length; e++){
            if(baseDatos[b].llave == combinaciones[e]){
                nodoConvergencia = encontrarNodo(combinaciones[e].substr(-36));
                break;
            }
        }
    }
    console.log(nodoConvergencia);
    var posiblesValores = [];
    for(s=0; s<baseDatos.length; s++){
        if(baseDatos[s].llave.substr(-36) == nodoConvergencia.id){
            var n = encontrarNodo(baseDatos[s].llave.substr(0, 36));
            var valoresPrevio = n.getElementsByTagName("td");
            posiblesValores.push(parseInt(valoresPrevio[0].innerHTML)+parseInt(baseDatos[s].valor));
        }
    }
    var valorUltimo = nodoConvergencia.getElementsByTagName("td");
    valorUltimo[0].innerHTML = Math.max.apply(null,posiblesValores);
    return nodoConvergencia;
}
//-----------------------------------------------------------------------------------------------------------------------------------
//OPCIÓN CALCULAR HOLGURAS
var holgurasBase = [];
function calcularHolgura(){
    holgurasBase = [];
    if(idBotonAtributos.length!=0){
        if (ultimoNodoHolgura()){
            for(i=0;i<baseDatos.length;i++){
                var holgura = holgurasConexiones(baseDatos[i]);
                cambiarColor(baseDatos[i], holgura);
                if(holgura==0){
                    holgurasBase.push({conexion: baseDatos[i].llave, valorH: holgura});
                }
            }
            agregarInformacionModal();
        } else {
            window.alert("No es posible calcular la holgura, por favor revisar las conexiones.");
        }
    } else {
        window.alert("Surgió un error para calcular la holgura, primero se deben calcular los atributos. Por favor presionar el botón de calcular atributos.");   
    }
}
//Función para validar que exista solo un nodo final.
function ultimoNodoHolgura(){
    var flag = true;
    var nodos = document.getElementsByClassName("control");
    var salidas = [];
    var cont = 0;
    for(i=0; i<baseDatos.length; i++){
        var nodo = baseDatos[i]["llave"];
        idNodoOrigen = nodo.substr(0, 36);
        if(!salidas.includes(idNodoOrigen)){
            salidas[cont] = idNodoOrigen;
            cont++;
        }
    }
    if(salidas.length!=nodos.length-2){
        flag = false;
    }
    return flag;
}
function holgurasConexiones(conexion){
    var salida = conexion.llave.substr(0,36);
    var entrada = conexion.llave.substr(-36);
    var nodos = document.getElementsByClassName('control');
    var atributoDeInicio = 0;
    for(j=1; j<nodos.length; j++){
        var nodoSalida = nodos[j];
        if (nodoSalida.id == salida){
            //Atributo mas pronto posible de inicio.
            var valores = nodoSalida.getElementsByTagName("td");
            atributoDeInicio = valores[0].innerHTML;
            break;
        }
    }
    var atributoDeFinalizacion = 0;
    for(z=1; z<nodos.length; z++){
        var nodoEntrada = nodos[z];
        if (nodoEntrada.id == entrada){
            //Atributo mas tarde permisible de finalización.
            var valores = nodoEntrada.getElementsByTagName("td");
            atributoDeFinalizacion = valores[1].innerHTML;
            break;
        }
    }
    return (atributoDeFinalizacion-atributoDeInicio-conexion.valor);
}

function agregarInformacionModal(){
    var nodos = document.getElementsByClassName('control');
    let html = `
        </br><p>
        <strong>Critical Path - Ruta Crítica</strong></br>`
    for(cm=0; cm<holgurasBase.length; cm++){
        var idEntrada = holgurasBase[cm].conexion.substr(0, 36);
        for(mc=1; mc<nodos.length; mc++){
            if(idEntrada==nodos[mc].id){
                var recorteNombre = nodos[mc].innerHTML;
                var nombreNodo = recorteNombre.substr(recorteNombre.indexOf("Punto"), recorteNombre.length);
                html+=`${nombreNodo} -> `
            }
        }
    }
    var idEntrada = holgurasBase[holgurasBase.length-1].conexion.substr(-36);
    for(f=1; f<nodos.length; f++){
        if(idEntrada==nodos[f].id){
            var recorteNombre = nodos[f].innerHTML;
            var nombreNodo = recorteNombre.substr(recorteNombre.indexOf("Punto"), recorteNombre.length);
            var valores = nodos[f].getElementsByTagName("td");
            html+=`${nombreNodo}</br>
            <strong>Valores Críticos</strong></br>
            ${nombreNodo}</br>
            Atributo más pronto posible de finalización ${valores[0].innerHTML}</br>
            Atributo más tarde permisible de finalización ${valores[1].innerHTML}
            `
        }
    }
    html+= `</br></p>`;
    console.log(html);
    $('#infoCaminoCritico').html(html);
}

//--------------------------------------------------------------------------------------------------------------
//Guardar graphy
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