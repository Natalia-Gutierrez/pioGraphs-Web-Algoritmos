//Base de datos en donde se almacenan las conexiones y sus valores.
var baseDatos = [];
//Buscar el valor actual de la conexion si se lo pusieron previamente.
function valorActual(buscar) {
  let i = 0;
  baseDatos.forEach(function (elemento) {
    if (elemento.llave == buscar) {
      i = 1;
      document.getElementById("valorActual").value = elemento.valor;
    }
  });
  if (i == 0) {
    document.getElementById("valorActual").value = "0";
  }
  document.getElementById("valorNuevo").value = "";
}
//Guardar el valor de la conexion en la base de datos, actualizar si ya existe.
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
//Eliminar la conexion de la base de datos.
function eliminarAtributoArray(key) {
  for (i = 0; i < baseDatos.length; i++) {
    if (baseDatos[i].llave == key) {
      baseDatos.splice(i, 1);
      break;
    }
  }
}
//Eliminar las conexiones del nodo que esta siendo eliminado de la base de datos.
function eliminarNodo(idNodo) {
  for (i = 0; i < baseDatos.length; i++) {
    if (baseDatos[i].llave.includes(idNodo)) {
      baseDatos.splice(i, 1);
      i--;
    }
  }
}
//Mostrar la matriz en la division correspondiente, con la suma de filas y suma de columnas.
function mostrarMatriz(ubicacion) {
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
    var posicionFila = parseInt(vertices.indexOf(origen), 10);
    var posicionColumna = parseInt(vertices.indexOf(destino), 10);
    matriz[posicionFila][posicionColumna] = parseInt(baseDatos[f].valor, 10);
  }
  let j = matriz.length;
  console.log(matriz);
  let html = `
        <table>
            <tr>
                <th></th>`;
  for (s = 0; s < j; s++) {
    html += `<th>${getNombreEstacion(s)}</th>`;
  }
  html += `<th>Suma</th>`;
  html += `</tr>`;

  for (l = 0; l < j; l++) {
    html += `<tr><td>${getNombreEstacion(l)}</td>`;
    for (m = 0; m < j; m++) {
      html += `<td>${matriz[l][m]}</td>`;
    }

    //suma filas
    var suma = 0;
    var aux = 0;
    for (s1 = l * j; s1 < l * j + j; s1++) {
      suma += matriz[l][aux];
      aux++;
    }
    html += `<td>${suma}</td>`;
    html += `</tr>`;
  }

  //suma columnas
  var sumaGeneral = 0;
  html += `<td>Suma</td>`;
  for (i = 0; i < j; i++) {
    var sumaC = 0;
    for (s2 = 0; s2 < j; s2++) {
      sumaC += matriz[s2][i];
    }
    sumaGeneral += sumaC;
    html += `<td>${sumaC}</td>`;
  }
  html += `<td>${sumaGeneral}</td>`;
  html += `</table>`;
  $(ubicacion).html(html);
}

//Activar y desactivar el fondo blanco o cuadriculado.
function funcionFondoCB() {
  var checkBox = document.getElementById("flexCheckDefault");
  var bg = document.getElementById("diagram");
  if (checkBox.checked == true) {
    bg.style.background = "none";
    bg.style.backgroundColor = "#ffffff";
  } else {
    bg.style.backgroundImage = "url('../resources/images/Imagen1.png')";
  }
}
//Colocarle nombre al nodo.
function getNombreEstacion(index) {
  nodos = document.getElementsByClassName("control");
  contenido = nodos[index + 1].innerHTML;
  nombre = contenido.substr(contenido.indexOf("Nodo"), contenido.length);
  return nombre;
}

function cerearMatriz(matriz, dimension) {
  for (var f = 0; f < dimension; f++) {
    //Creamos un nuevo array que representa cada fila dentro de la tabla.
    var nuevoArray = [];
    for (var c = 0; c < dimension; c++) {
      //Hacemos push de ceros en el array de acuerdo a la cantidad de columnas que deseamos que tenga.
      nuevoArray.push(0);
    }
    // Por ultimo hacemos un push del array dentro de la matriz habiendo concluido una fila
    matriz.push(nuevoArray);
  }
  return matriz;
}


function minimizar() {
  estadoInicialConexiones();  
  vertices = getVertices(); //id de los nodos
  edges = getEdges(vertices); //[index origen, index destino, valor]
  console.log(vertices);
  console.log(edges);
  let matrizSolucion = kruskal(edges, vertices, true);
  solucionConexiones(matrizSolucion, vertices, true); //Cambia de color
  console.log(matrizSolucion);
  mostrarModal(matrizSolucion,"minimizar-valores");
}

function maximizar() {
    estadoInicialConexiones();  
    vertices = getVertices(); //id de los nodos
    edges = getEdges(vertices); //[index origen, index destino, valor]
    let matrizSolucion = kruskal(edges, vertices, false);
    solucionConexiones(matrizSolucion, vertices), false; //Cambia de color
    mostrarModal(matrizSolucion,"maximizar-valores");
}

function mostrarModal(solucion,ubicacion){
    var cadena = "";
    var suma = 0;
    for(n = 0 ; n<solucion.length;n++){
        if(n==(solucion.length-1)){
            suma+=solucion[n][2];
            cadena += solucion[n][2] + " = "+ suma;
        }else{
            cadena += solucion[n][2] + " + ";
            suma+=solucion[n][2];
        }
        
    }
    document.getElementById(ubicacion).innerHTML= cadena;
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
function solucionConexiones(solucion, vertices, min){
    for(n = 0; n < solucion.length;n++){
        cambiarColor(vertices[solucion[n][0]], vertices[solucion[n][1]], solucion[n][2], min);
    }
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

// Encuentra la conexion con el menor peso 
function findMinEdge(edges) {
  let min = null;
  for (const edge of edges) {
    min = min ? (edge[2] < min[2] ? edge : min) : edge; //si min no es null, comparamos edge < min -> si: min = edge no: min = min, si es null hablamos del primer elemento y asignamos edge 
  }                                
  return min;
}

// Encuentra la conexion con el mayor peso 
function findMaxEdge(edges) {
    let max = null;
    for (const edge of edges) {
      max = max ? (edge[2] > max[2] ? edge : max) : edge; //si max no es null, comparamos edge > max -> si: max = edge no: max = max, si es null hablamos del primer elemento y asignamos edge 
    }                                
    return max;
}

// Conjunto desconectado
function DisjoinSet() {
  this.items = {};
  this.makeSet = function (vertices) {
    for (const vertice of vertices) {
      this.items[vertice] = {
        padre: null,
        value: vertice,
      };
    }
  };
  this.unionSet = function (vertice_1, vertice_2) {
    const rootA = this.find(vertice_1);
    const rootB = this.find(vertice_2);
    if (rootA === null || rootB === null) {
      throw new Error("no existe el vertice");
    }

    if (rootA !== rootB) {
      rootA.padre = rootB;
      return true;
    }
    return false;
  };
  this.find = function (vertice) {
    let p = this.items[vertice];
    if (p) {
      return p.padre === null ? p : this.find(p.padre.value);
    }
    throw new Error("no existe el vertice");
  };
}

function kruskal(edges, vertices, min) {
  let matrizSolucion = [];
  let edgesCopy = edges.slice(0);
  let disjoinSet = new DisjoinSet();
  disjoinSet.makeSet(vertices);
  while (matrizSolucion.length < vertices.length - 1) {
      let value = [];
      if(min){
        value = findMinEdge(edgesCopy);
      }else{
        value = findMaxEdge(edgesCopy);
      }
    if (disjoinSet.unionSet(vertices[value[0]], vertices[value[1]])) {
      matrizSolucion.push(value);
    }
    edgesCopy.splice(edgesCopy.indexOf(value), 1);
  }
  return matrizSolucion;
}

function getVertices() {
  vertices = [];
  nodos = document.getElementsByClassName("control");
  for (i = 1; i < nodos.length; i++) {
    vertices.push(nodos[i].id);
  }
  return vertices;
}
function getEdges(vertices) {
  var matriz = [];
  var newFila = [];
  for (i = 0; i < baseDatos.length; i++) {
    var origen = baseDatos[i]["llave"].substr(0, 36);
    var destino = baseDatos[i]["llave"].substr(-36);
    newFila.push(vertices.indexOf(origen)); //añadimos origen
    newFila.push(vertices.indexOf(destino)); //añadimos destino
    newFila.push(parseInt(baseDatos[i].valor)); //añadimos valor
    matriz.push(newFila);
    newFila = [];
  }
  return matriz;
}


//--------------------------------------------------------------------------------------------------------------
//Guardar graphy
function guardarGrafo() {
  var nombreArchivo = document.getElementById("nombreArchivo").value;
  var data = document.getElementById("diagram").innerHTML;
  var contenidoBDD = "";
  for (dato = 0; dato < baseDatos.length; dato++) {
    contenidoBDD +=
      "llave:" +
      baseDatos[dato].llave +
      ",valor:" +
      baseDatos[dato].valor +
      "|";
  }
  data += `<div class="contenedor-conexiones"><!--${contenidoBDD}--></div>`;

  var textFileAsBlob = new Blob([data], { type: "text/txt" });
  // Specify the name of the file to be saved
  var fileNameToSaveAs = nombreArchivo + ".txt";

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

  function destroyClickedElement(event) {
    //remove the link from the DOM
    document.body.removeChild(event.target);
  }
}
//--------------------------------------------------------------------------------------------------------------
//Subir grafo
function subirGrafo(evento) {
  document.getElementById("diagram").innerHTML = "";
  let archivo = evento.target.files[0];
  if (archivo) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let contenido = e.target.result;
      document.getElementById("diagram").innerHTML = contenido;
    };
    reader.readAsText(archivo);
    document.querySelector("#habilitar-div").classList.add("habilitar-activo");
  } else {
    window.alert("No se ha seleccionado un archivo.");
  }
}
// Funcion para detectar la carga del archivo
window.addEventListener("load", () => {
  document.getElementById("file-input").addEventListener("change", subirGrafo);
});

// Funcion para activar el input-file al presionar el boton Subir graphy.
document.getElementById("subirGrafo").addEventListener("click", function () {
  document.getElementById("file-input").click();
});
