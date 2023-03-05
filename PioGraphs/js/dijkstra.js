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
//Función para calcular los atributos.
function calcularAtributosMinimizar(){
    estadoInicialConexiones();
    //Primero validamos que todas las conexiones tengan valores.
    if(validarNumeroTotalConexiones()){
        //Luego validamos que solo exista un nodo final.
        //var ultimoNodo = buscarUltimoNodo();
        //if(ultimoNodo != null){
            //Ahora validamos la existencia de un nodo inicial.
            var primerNodo = buscarPrimerNodo();
            if(primerNodo != null){
                ponerValoresCeros();
                var secuenciaNodos = encontrarSecuencia();
                calcularAtributosMinimos(secuenciaNodos);
                /*console.log(secuenciaNodos);
                for(contNodos=0;contNodos< secuenciaNodos.length;contNodos++){
                    console.log(encontrarNodo(secuenciaNodos[contNodos]));
                }*/
                var valFlecha = calcularCamino(secuenciaNodos, true);
                agregarInformacionModal(valFlecha, 'Camino mínimo');
            } else {
                window.alert("No es posible calcular los atributos, no existe un nodo origen.");    
            }
        /*} else {
            window.alert("No es posible calcular los atributos si hay más de un nodo final o si hay un nodo suelto.");
        }*/
    }
}
//Cambia los valores de los atributos de los nodos a cero.
function ponerValoresCeros() {
    var nodos = document.getElementsByClassName("control");
    for(nd=1; nd<nodos.length; nd++){
        var valorActualizado = nodos[nd].getElementsByTagName("td");
        valorActualizado[0].innerHTML = "0";
    }
}
//Función para validar que todas las conexiones tengan valores.
function validarNumeroTotalConexiones(){
    var flag = true;
    var conexiones = document.getElementsByClassName("jtk-connector");
    if (conexiones.length == 0){
        window.alert("No es posible calcular los atributos, no existe ninguna conexión.");
        flag = false;
    }
    if (baseDatos.length != conexiones.length){
        window.alert("No es posible calcular los atributos hasta llenar todos los valores para las conexiones.");
        flag = false;
    }
    return flag;
}
//Función para encontrar el nodo final.
function buscarUltimoNodo(){
    var idNodo = null;
    var nodos = document.getElementsByClassName("control");
    var numeroDeSalidas = [];
    var repeticion = 0;
    var numID = 0;
    for(i=1; i<nodos.length; i++){
        var cantidad = cantidadSalidasNodo(nodos[i].id);
        var nuevo = {id: nodos[i].id, salidas: cantidad};
        numeroDeSalidas.push(nuevo);
        if(cantidad == 0){
            repeticion++;
            numID = i;
        }
    }
    if(repeticion == 1){
        idNodo = numeroDeSalidas[numID-1].id;
    }
    return idNodo;
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
//Función para encontrar el primer nodo del grafo.
function buscarPrimerNodo() {
    var idNodo = null;
    var nodos = document.getElementsByClassName("control");
    var numeroDeEntradas = [];
    var repeticion = 0;
    var numID = 0;
    for(i=1; i<nodos.length; i++){
        var cantidad = cantidadEntradasNodo(nodos[i].id);
        var nuevo = {id: nodos[i].id, entradas: cantidad};
        numeroDeEntradas.push(nuevo);
        if(cantidad == 0){
            repeticion++;
            numID = i;
        }
    }
    if(repeticion == 1){
        idNodo = numeroDeEntradas[numID-1].id;
    }
    return idNodo;
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
//Encontrar un nodo por su id.
function encontrarNodo(id){
    var nodos = document.getElementsByClassName('control');
    var nodo = "";
    for(m1=1; m1<nodos.length; m1++){
        if(nodos[m1].id == id){
            nodo = nodos[m1];
            break;
        }
    }
    return nodo;
}
//Encontrar la secuencia en que los nodos calculen sus atributos.
function encontrarSecuencia() {
    var secuencia = [];
    var nodos = document.getElementsByClassName('control');
    for(i=1; i<nodos.length; i++){
        if(secuencia.includes(nodos[i].id) == false){
            secuencia.push(nodos[i].id);
        }
        var salidas = salidasNodo(nodos[i].id);
        for(j=0; j<salidas.length; j++){
            if(secuencia.includes(salidas[j].substr(-36)) == false){
                secuencia.push(salidas[j].substr(-36));
            } else {
                if(comprobarPadreAdelante(nodos[i].id, salidas[j].substr(-36), secuencia) == true){
                    var aux = [];
                    aux = colocarAdelante(nodos[i].id, salidas[j].substr(-36), secuencia);
                    secuencia = aux;
                } else {
                    continue;
                }
            }
        }
    }
    return secuencia;
}
//Flechas que salen al nodo.
function salidasNodo(id){
    var aux = [];
    for(j=0; j<baseDatos.length; j++){
        if(baseDatos[j].llave.substr(0, 36) == id){
            aux.push(baseDatos[j].llave);
        }
    }
    return aux;
}
//Funcion para comprobar que en la cadena este el padre delante del hijo.
function comprobarPadreAdelante(padre, hijo, cadena) {
    var flag = false;
    var p = 0;
    var h = 0;
    for(r=0; r<cadena.length; r++) {
        if(cadena[r] == padre) {
            p++; break;
        } else if(cadena[r] == hijo) {
            h++; break;
        }
    }
    if(p==0 && h==1){
        flag = true;
    }
    return flag;
}
//Funcion para colocar el nodo padre delante del nodo hijo.
function colocarAdelante(padre, hijo, cadena) {
    var aux = [];
    var cont = 0;
    for(k=0; k<cadena.length; k++){
        if(cadena[k] == hijo) {
            cont = k;
            break;
        }
        aux.push(cadena[k]);
    }
    aux.push(padre);
    for(l=cont; l<cadena.length; l++){
        if(padre != cadena[l]){
            aux.push(cadena[l]);
        }
    }
    return aux;
}

//Funcion para calcular los Atributos.
function calcularAtributosMinimos(secuenciaNodos) {
    for(n=0; n<secuenciaNodos.length; n++) {
        var salidas = salidasNodo(secuenciaNodos[n]);
        for(s=0; s<salidas.length; s++) {
            cambiarValorAtributo(atributoAnterior(secuenciaNodos[n]), valorFlecha(salidas[s]), salidas[s].substr(-36));
        }
    }
}
//Encontrar el valor del atributo de un nodo anterior.
function atributoAnterior(id){
    var nodo = encontrarNodo(id);
    var valor = nodo.getElementsByTagName("td");
    return parseInt(valor[0].innerHTML);
}
//Devuelve el valor de una flecha por su id.
function valorFlecha(llave){
    var aux = 0;
    for(w=0; w<baseDatos.length; w++){
        if(baseDatos[w].llave == llave){
            aux = baseDatos[w].valor;
            break;
        }
    }
    return aux;
}
//Cambia el valor del atributo de un nodo.
function cambiarValorAtributo(anterior, valor, id){
    var nodo = encontrarNodo(id);
    var valorActualizado = nodo.getElementsByTagName("td");
    var actual = valorActualizado[0].innerHTML;
    if(parseInt(actual) == 0){
        valorActualizado[0].innerHTML = parseInt(valor) + parseInt(anterior);
    } else {
        var nuevo = parseInt(valor) + parseInt(anterior);
        if(parseInt(actual)>nuevo){
            valorActualizado[0].innerHTML = nuevo;
        } 
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------
//Función para calcular los atributos.
function calcularAtributosMaximizar(){
    estadoInicialConexiones();
    //Primero validamos que todas las conexiones tengan valores.
    if(validarNumeroTotalConexiones()){
        //Luego validamos que solo exista un nodo final.
        //var ultimoNodo = buscarUltimoNodo();
        //if(ultimoNodo != null){
            //Ahora validamos la existencia de un nodo inicial.
            var primerNodo = buscarPrimerNodo();
            if(primerNodo != null){
                ponerValoresCeros();
                var secuenciaNodos = encontrarSecuencia();
                calcularAtributosMaximos(secuenciaNodos);
                /*console.log(secuenciaNodos);
                for(contNodos=0;contNodos< secuenciaNodos.length;contNodos++){
                    console.log(encontrarNodo(secuenciaNodos[contNodos]));
                }*/
                var valFlechas = calcularCamino(secuenciaNodos, false);
                agregarInformacionModal(valFlechas, 'Camino máximo');
            } else {
                window.alert("No es posible calcular los atributos, no existe un nodo origen.");    
            }
        /*} else {
            window.alert("No es posible calcular los atributos si hay más de un nodo final o si hay un nodo suelto.");
        }*/
    }
}
//Funcion para calcular los Atributos.
function calcularAtributosMaximos(secuenciaNodos) {
    for(n=0; n<secuenciaNodos.length; n++) {
        var salidas = salidasNodo(secuenciaNodos[n]);
        for(s=0; s<salidas.length; s++) {
            cambiarValorAtributoMaximo(atributoAnterior(secuenciaNodos[n]), valorFlecha(salidas[s]), salidas[s].substr(-36));
        }
    }
}
//Cambia el valor del atributo de un nodo.
function cambiarValorAtributoMaximo(anterior, valor, id){
    var nodo = encontrarNodo(id);
    var valorActualizado = nodo.getElementsByTagName("td");
    var actual = valorActualizado[0].innerHTML;
    if(parseInt(actual) == 0){
        valorActualizado[0].innerHTML = parseInt(valor) + parseInt(anterior);
    } else {
        var nuevo = parseInt(valor) + parseInt(anterior);
        if(parseInt(actual)<nuevo){
            valorActualizado[0].innerHTML = nuevo;
        } 
    }
}
//Calcular el camino 
function calcularCamino(secNodos, min) {
    var valoresCamino = [];
    var cantidadNodos = document.getElementsByClassName('control');
    for(m=0; m<cantidadNodos.length-1; m++) {
        var nodo = secNodos[m];
        var entradasAlNodo = entradasNodo(nodo);
        for(ent=0; ent<entradasAlNodo.length; ent++){
            if(restarAtributo(nodo, entradasAlNodo[ent])){
                cambiarColor(entradasAlNodo[ent].substr(0,36), nodo, parseInt(valorFlecha(entradasAlNodo[ent])), min);
                valoresCamino.push(parseInt(valorFlecha(entradasAlNodo[ent])));
                ent = entradasAlNodo.length+1;
            }
        }
    }
    return valoresCamino;
}

function cambiarColor(src,trg,valor,min) {
    var conn = instance.getConnections({
        source: src,
        target: trg
    });
    if (conn[0]) {
      instance.deleteConnection(conn[0]);
    }
    if(min){
        crearNuevaFlechaColor(src, trg, valor,"blue-connection");
    }else{
        crearNuevaFlechaColor(src, trg, valor,"yellow-connection");
    }
}

function crearNuevaFlechaColor(src, trg, value, tipo) {
  var endpoint1 = instance.getEndpoints(src)[0];
  if (!endpoint1.isSource) {
    endpoint1 = instance.getEndpoints(src)[1];
  }
  var endpoint2 = instance.getEndpoints(trg)[0];
  if (!endpoint2.isTarget) {
    endpoint2 = instance.getEndpoints(trg)[1];
  }
  instance.connect({
    source: endpoint1,
    target: endpoint2,
    type: tipo, data: { label: value }
  });
}

//Flechas que entran al nodo.
function entradasNodo(id){
    var aux = [];
    for(j=0; j<baseDatos.length; j++){
        if(baseDatos[j].llave.substr(-36) == id){
            aux.push(baseDatos[j].llave);
        }
    }
    return aux;
}

function restarAtributo(nodoHijo, flecha){
    var flag = false;
    var valorHijo = encontrarNodo(nodoHijo).getElementsByTagName("td");
    var valorActualHijo = valorHijo[0].innerHTML;
    var aux = parseInt(valorActualHijo) - parseInt(valorFlecha(flecha));
    var valorPadre = encontrarNodo(flecha.substr(0, 36)).getElementsByTagName("td");
    var valorActualPadre = valorPadre[0].innerHTML;
    console.log(aux);
    console.log(valorActualPadre);
    if(parseInt(aux) == parseInt(valorActualPadre)){
        flag = true;
    }
    return flag;
}

function estadoInicialConexiones(){
    for(x = 0; x<baseDatos.length;x++){
        let value = baseDatos[x].valor;
        let sourceId = baseDatos[x].llave.substr(0,36);
        let targetId = baseDatos[x].llave.substr(-36);
        var conn = instance.getConnections({
            source: sourceId,
            target: targetId
        });
        if (conn[0]) {
          instance.deleteConnection(conn[0]);
        }
        crearNuevaFlechaColor(sourceId, targetId, value, "green-connection");
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------
//Función para agregar la información al modal de información
function agregarInformacionModal(valoresFlechas, titulo){
    var total = 0;
    let html = `
        </br><p>
        <strong>${titulo}</strong></br>`
    for(contFl=0; contFl<valoresFlechas.length; contFl++){
        if(contFl == valoresFlechas.length-1){
            html+=`${valoresFlechas[contFl]}`
        } else {
            html+=`${valoresFlechas[contFl]} + `
        }
        total = total+parseInt(valoresFlechas[contFl]);
    }
    html+=`</br><strong>Total</strong></br>${total}</br></p>`;
    console.log(html);
    $('#infoCaminoCritico').html(html);
}

//-----------------------------------------------------------------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------------------------------------------------------------
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