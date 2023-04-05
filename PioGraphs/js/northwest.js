var baseDatos = [];
var matriz = [];
var demandas = [];
var ofertas = [];
var coordenadas = [];
var res = [];
var flag = false;

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
    var elementosOrigen = document.getElementsByClassName("origen");
    var elementosDestino = document.getElementsByClassName("destino");
    var verticesOrigen = [];
    var verticesDestino = [];
    var filas=0;
    var columnas=0;
    for (i = 1; i < elementosOrigen.length; i++) {
        verticesOrigen.push(elementosOrigen[i].id);
        filas++;
    }
    for (i = 1; i < elementosDestino.length; i++) {
        verticesDestino.push(elementosDestino[i].id);
        columnas++;
    }
    matriz = [];
    //Creamos y paralelamente cereamos la matriz
    for (var f=0; f<filas; f++){
        //Creamos un nuevo array que representa cada fila dentro de la tabla
        var nuevoArray=[];
        for (var c=0; c<columnas; c++){
            //Hacemos push de ceros en el array de acuerdo a la cantidad de columnas que deseamos que tenga
            nuevoArray.push(0);
        }
        // Por ultimo hacemos un push del array dentro de la matriz habiendo concluido una fila
        matriz.push(nuevoArray);
    }
    //Llenamos la matriz con los atributos de la BDD
    for (f = 0; f < baseDatos.length; f++) {
        var origen = baseDatos[f]["llave"].substr(0, 36);
        var destino = baseDatos[f]["llave"].substr(-36);
        var posicionFila = parseInt(verticesOrigen.indexOf(origen),10);
        var posicionColumna = parseInt(verticesDestino.indexOf(destino),10);
        matriz[posicionFila][posicionColumna] = parseInt(baseDatos[f].valor,10);
    }
    console.log(matriz);
    let html = `
    <table>
            <tr>
                <th></th>`;
    for (c = 0; c < columnas; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    if(flag==true){
        html += `<th>Ofertas</th>`;
    }
    html +=`</tr>`;

    for (f = 0; f <filas; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < columnas; c++) {
            html += `<td>${matriz[f][c]}</td>`;
        }
        if(flag==true){
            html += `<td>${ofertas[f].oferta}</td></tr>`;
        }
    }
    if(flag==true){
        html += `<tr><td>Demandas</td>`;
        for(k=0; k<columnas; k++){
            html+=`<td>${demandas[k].demanda}</td>`;
        }
        html+=`</tr>`;
    }
    html +=`</table>`;
    $(ubicacion).html(html);
    console.log(ofertas);
    console.log(demandas);
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

function getNombreOrigen(index) {
    nodos = document.getElementsByClassName("origen");
    contenido = nodos[index + 1].innerHTML;
    nombre = contenido.substr(contenido.indexOf("Origen"), contenido.length);
    return nombre;
}

function getNombreDestino(index) {
    nodos = document.getElementsByClassName("destino");
    contenido = nodos[index + 1].innerHTML;
    nombre = contenido.substr(contenido.indexOf("Destino"), contenido.length);
    return nombre;
}

function mostrarInputOfertasyDemandas(){
    var origen = document.getElementsByClassName('origen');
    let htmlOrigen=`Ingrese los siguientes valores de las ofertas: <br><center>`;
    for (i=1; i<origen.length; i++){
        if(ofertas.length==origen.length-1){
            htmlOrigen+=`<label>
            Oferta - Origen ${i}   </label><input onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
            style="height:2vw; margin-left:1.5vw;" id="of-${i}" value="${ofertas[i-1].oferta}"><br>`;
        }else{
            htmlOrigen+=`<label>
            Oferta - Origen ${i}   </label><input onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
            style="height:2vw; margin-left:1.5vw;" id="of-${i}"><br>`;
        }
        
    }
    htmlOrigen+=`</center>`;
    $('#ofertas').html(htmlOrigen);
    var destino = document.getElementsByClassName('destino');
    let htmlDestino=`Ingrese los siguientes valores de las demandas: <br><center>`;
    for (i=1; i<destino.length; i++){
        if(demandas.length == destino.length-1){
            htmlDestino+=`<label>
            Demanda - Destino ${i}   </label><input onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
            style="height:2vw; margin-left:1.5vw;" id="de-${i}" value="${demandas[i-1].demanda}"><br>`;
        }else{
            htmlDestino+=`<label>
            Demanda - Destino ${i}   </label><input onKeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
            style="height:2vw; margin-left:1.5vw;" id="de-${i}"><br>`;
        }
        
    }
    htmlDestino+=`</center`;
    $('#demandas').html(htmlDestino);
}
function guardarOfDem(){
    //ofertas = [];
    //demandas = [];
    var origen = document.getElementsByClassName('origen');
    for (i=1; i<origen.length; i++){
        var of = document.getElementById('of-'+i).value;
        var dato = {id: origen[i].id, oferta: of};
        ofertas.push(dato);
    }
    var destino = document.getElementsByClassName('destino');
    for (i=1; i<destino.length; i++){
        var dem = document.getElementById('de-'+i).value;
        var dato = {id: destino[i].id, demanda: dem};
        demandas.push(dato);
    }
    console.log(ofertas);
    console.log(demandas);
    flag = true;
}

function guardarOferta(id, valor){
    var dato = {id: id, oferta: valor};
    ofertas.push(dato);
    flag = true;
    // console.log(ofertas);
}
function guardarDemanda(id, valor){
    var dato = {id: id, demanda: valor};
    demandas.push(dato);
    flag = true;
    // console.log(demandas);

}

//Si es false - minimiza
function mostrarMaximizacion(maximizar){
    mostrarMatriz();
    res = [];
    var filas = document.getElementsByClassName("origen");
    var columnas = document.getElementsByClassName("destino");
    mostrarMatrizMaximo(filas.length-1, columnas.length-1, maximizar);
    mostrarMatrizFuncionCosto(filas.length-1, columnas.length-1, maximizar);
    mostrarTotal(res);
}
function mostrarMatrizMaximo(filas, columnas, maximizar){
    var arregloDemandas = getDemandas();
    var arregloOfertas = getOfertas();
    var matrizSolucion = mainFunctionForTransport(matriz,arregloDemandas,arregloOfertas,maximizar);
    console.log(matrizSolucion);
    let html = `
    <table>
            <tr>
                <th></th>`;
    for (c = 0; c < columnas; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    if(flag==true){
        html += `<th>Ofertas</th>`;
    }
    html +=`</tr>`;

    for (f = 0; f <filas; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < columnas; c++) {
            if(matrizSolucion[f][c]!=0){
                html += `<td style="background-color : #f7d547;">${matriz[f][c]}</td>`;
                res.push(matriz[f][c]);
            } else {
                html += `<td>${matriz[f][c]}</td>`;
            }
        }
        if(flag==true){
            html += `<td>${ofertas[f].oferta}</td></tr>`;
        }
    }
    if(flag==true){
        html += `<tr><td>Demandas</td>`;
        for(k=0; k<columnas; k++){
            html+=`<td>${demandas[k].demanda}</td>`;
        }
        html+=`</tr>`;
    }
    html +=`</table>`;
    $("#matriz-minimizacion").html(html);
}

function getDemandas(){
    console.log(demandas);
    var arregloD = [];
    for(i=0;i<demandas.length;i++){
        console.log(demandas[i]);
        arregloD.push(demandas[i].demanda);
    }
    return arregloD;
}
function getOfertas(){
    var arregloO = [];
    for(i=0;i<ofertas.length;i++){
        arregloO.push(ofertas[i].oferta);
    }
    return arregloO;
}

function mostrarMatrizFuncionCosto(filas, columnas, maximizar){
    var arregloDemandas = getDemandas();
    var arregloOfertas = getOfertas();
    var matrizSolucion = mainFunctionForTransport(matriz,arregloDemandas,arregloOfertas,maximizar);
    let html = `
    <table>
            <tr>
                <th></th>`;
    for (c = 0; c < columnas; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    if(flag==true){
        html += `<th>Ofertas</th>`;
    }
    html +=`</tr>`;

    var aux = 0;
    for (f = 0; f <filas; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < columnas; c++) {
            if(matrizSolucion[f][c]!=0){
                html += `<td style="background-color : #f7d547;">${matrizSolucion[f][c]}</td>`;
                res.push(matrizSolucion[f][c]);
                aux++;
            } else {
                html += `<td>0</td>`;
            }
        }
        if(flag==true){
            html += `<td>${ofertas[f].oferta}</td></tr>`;
        }
    }
    if(flag==true){
        html += `<tr><td>Demandas</td>`;
        for(k=0; k<columnas; k++){
            html+=`<td>${demandas[k].demanda}</td>`;
        }
        html+=`</tr>`;
    }
    html +=`</table>`;
    $("#funcion-costo-minimo").html(html);
}
function buscarCoordenada(f, c){
    var flag = false;
    for(i=0; i<coordenadas.length; i++){
        if(coordenadas[i].fila==f && coordenadas[i].columna==c){
            flag = true;
            break;
        }
    }
    return flag;
}
function mostrarTotal(res){
    let html = ``;
    var total = 0;
    for(i=0; i<(res.length/2); i++){
        total = total + (parseInt(res[i])*parseInt(res[(res.length/2)+i]));
        html+=`(${res[i]}*${res[(res.length/2)+i]})`;
        if(i!=((res.length/2)-1)){
            html+=`+`;
        }
    }
    html+=` = ${total}`;
    $("#calculo-resultado-minimo").html(html);
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

    var contenidoOfertas= "";
    for(dato=0;dato<ofertas.length;dato++){
        contenidoOfertas+="id:"+ofertas[dato].id+",oferta:"+ofertas[dato].oferta+"|";
    }
    data+=`<div class="contenedor-ofertas"><!--${contenidoOfertas}--></div>`;

    var contenidoDemandas= "";
    for(dato=0;dato<demandas.length;dato++){
        contenidoDemandas+="id:"+demandas[dato].id+",demanda:"+demandas[dato].demanda+"|";
    }
    data+=`<div class="contenedor-demandas"><!--${contenidoDemandas}--></div>`;

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


//---------------------------------------------------------------------------------------------------------------
//Algoritmo de transporte
function mainFunctionForTransport(matrixCostos, vectorHorizontal, vectorVertical, maximaze){
    var currentSolution = [];
    refillWithZeros(currentSolution, matrixCostos.length, matrixCostos[0].length);
    console.log(currentSolution);
    for(let row = 0 ; row < matrixCostos.length ; row++){
        for(let col = 0 ; col < matrixCostos[row].length ; col++){
            var onRows = vectorVertical[row] - findSumArray(currentSolution[row]);
            var onCols = vectorHorizontal[col] - findSumCol(currentSolution, col);
            if(onRows < onCols){
                currentSolution[row][col] = onRows;
            }else{
                currentSolution[row][col] = onCols;
            }
        }
    }

    var matrixSolutions = [];
    recursiveMainFunction(currentSolution, matrixCostos,  vectorHorizontal, vectorVertical, maximaze, matrixSolutions);
    console.log('FINAL');
    console.log(matrixSolutions);
    var trulyTrueSolutions = [];
    if(matrixSolutions.length === 0){
        for(let i=0; i < currentSolution.length ; i++){
            trulyTrueSolutions.push(currentSolution[i]);
        }
    }else{
        trulyTrueSolutions = checkForTrulySolutions(matrixCostos, matrixSolutions,   maximaze);
    }
    console.log('true solution');
    console.log(trulyTrueSolutions);
    return trulyTrueSolutions;
  
 
}

function checkForTrulySolutions(costos, matrixSolutions,   maximize){
    var checkPoint = 0;
    var num = calculateAllDataMatrix(costos, matrixSolutions[checkPoint]);
    

    for(let current = 0; current < matrixSolutions.length; current++){
        var sumatoria = calculateAllDataMatrix(costos, matrixSolutions[current]);

        if(maximize){
            if(sumatoria > num){
                num = sumatoria;
                checkPoint = current;
            }
        }else{
            if(sumatoria < num){
                num = sumatoria;
                checkPoint = current;
            }
        } 
    }

    return matrixSolutions[checkPoint];
}
function calculateAllDataMatrix(costos, matrix){
    var num = 0;

    for(let i = 0; i < costos.length; i++){
        for(let j=0; j < costos[i].length; j++){
            num = num +  ( costos[i][j] * matrix[i][j] ); 
        }
    }
    return num;
}

function recursiveMainFunction(currentSolution, matrixCostos, vectorHorizontal, vectorVertical, maximaze, matrixSolutions){
    var selectValuesFromCostosBasedOnCurrent = [];
    var secondVectorVertical = [];
    var secondVectorHorizontal = [];
    var newSeletedValues = [];

    
    

    insertIntoMatrix(currentSolution, matrixCostos, newSeletedValues);
    console.log('current solution and new Selected values and matrixCostos');
    console.log(currentSolution, newSeletedValues, matrixCostos);

    
    refillVectors(secondVectorVertical,  currentSolution.length, true, newSeletedValues);
    refillVectors(secondVectorHorizontal, currentSolution[0].length, false, newSeletedValues);

    asummepositionFrOriginalMatrix( currentSolution, newSeletedValues, matrixCostos, secondVectorVertical, secondVectorHorizontal);

    console.log('currentSolution');
    console.log(currentSolution);
    console.log('new SelectedValues');
    console.log(newSeletedValues); 
    console.log('MatrixCostos');
    console.log(matrixCostos);
    console.log('momenot dos de la iteracion');
    console.log(secondVectorHorizontal);
    console.log(secondVectorVertical);

    // ya se han encontrado nlos valores que son para las columnas y los verticvews 

    var refillValuesWithSides =[];

    refillMatricWithVectors(refillValuesWithSides, secondVectorVertical, secondVectorHorizontal);

    console.log('fourth amtrix');
    console.log(refillValuesWithSides);

    var originalMinusRefilled = [];

    restarMatrices(originalMinusRefilled, matrixCostos, refillValuesWithSides);

    console.log('originalMinusRefilled');
    
    console.log(originalMinusRefilled);

    var posLookeFor    = [];
     
    getMaxOrMin( posLookeFor, originalMinusRefilled, maximaze);

    if(originalMinusRefilled[posLookeFor[0]][posLookeFor[1]] != 0){
        console.log('posLokedFor');
        console.log(posLookeFor);
        console.log(originalMinusRefilled[posLookeFor[0]][posLookeFor[1]]);

        var allPositionToIterate = [];
        getAllPOsitionsForInstance(currentSolution, allPositionToIterate, posLookeFor);

        console.log('positions to iterate');
        console.log(allPositionToIterate);
        var posiblePaths = [];
        var posibility = [];
        var positionsVisited = [];
        positionsVisited.push(transformIntoIndexOfArray(originalMinusRefilled[0].length, posLookeFor[0], posLookeFor[1]))
        getAllPosiblePaths(positionsVisited,  currentSolution, posLookeFor, allPositionToIterate, posibility, true);
        
        getAllPosiblePaths(positionsVisited, currentSolution, posLookeFor, allPositionToIterate, posibility, false);

        console.log('posibility');
        console.log(posibility);
   
        var arrayForPositionsSolution = [];
        for(let i = 0 ; i < posibility.length ; i++){
            var auxl = [];
            transformArrayIndexIntoMatrixPosition(posibility[i], auxl, originalMinusRefilled[0].length);       
            arrayForPositionsSolution.push(auxl);
        }
        
        console.log('position solutions');
        console.log(arrayForPositionsSolution); 

        var posibleRes = [];
        hasAllPairs(posibleRes , arrayForPositionsSolution);

        console.log('Check for posible Res ');
        console.log(posibleRes);

        var newCurrentSolutionminusX  = currentSolution.map(function(arr) {
            return arr.slice();
        });;
        for(let i = 0 ; i < posibleRes.length ; i++ ){
            if(posibleRes[i]){
                console.log("new current solution minus x");
                console.log(newCurrentSolutionminusX);

                console.log("current solution")
                console.log(currentSolution);

                console.log('array for position solutions ');
                console.log(arrayForPositionsSolution[i]);

                createNewMatrixWithSelectedPath(newCurrentSolutionminusX, currentSolution,  arrayForPositionsSolution[i], maximaze);
                console.log('New Matrix');
                console.log(newCurrentSolutionminusX);
                matrixSolutions.push(newCurrentSolutionminusX);
                //recursiveMainFunction(newCurrentSolutionminusX, vectorHorizontal, vectorVertical, maximaze, matrixSolutions);
                
                recursiveMainFunction(newCurrentSolutionminusX, matrixCostos, vectorHorizontal, vectorVertical, maximaze, matrixSolutions);
            }
            
        }


    }

    
  
    
}
function transformArrayIndexIntoMatrixPosition(posibility, arrayForPositionsSolution, cols){
    for(let i =0; i<posibility.length;i++){
        
        arrayForPositionsSolution.push([ parseInt(posibility[i]/cols) , posibility[i]%cols]);
    }
}

function insertIntoMatrix(currentSolution, matrixCostos, destinyValues){
    for(let i = 0; i < matrixCostos.length ; i++){
        var auxiliar3 = [];
        for(let j = 0; j < matrixCostos[i].length ; j++){
            if(currentSolution[i][j] != 0){
                auxiliar3.push(matrixCostos[i][j]);
            }else{
                auxiliar3.push(0);
            }
        }
        destinyValues.push(auxiliar3);
    }
}

function createNewMatrixWithSelectedPath(matrix, matrixOrig, arrayOfSolution, maximaze ){
    
    var auxlia = [];
    for(let i = 1 ; i < arrayOfSolution.length ; i = i + 2){
        auxlia.push(matrixOrig[ arrayOfSolution[i][0] ][ arrayOfSolution[i][1] ]);
    }
    auxlia.sort();
    console.log('auxlia');
    console.log(auxlia);
 
    var num = auxlia[0];
    for(let i = 0; i < arrayOfSolution.length; i++){    
        if(i%2 === 0 ){
            matrix[ arrayOfSolution[i][0] ][ arrayOfSolution[i][1] ] = matrixOrig[ arrayOfSolution[i][0] ][ arrayOfSolution[i][1] ] + num;
        }else{
            matrix[ arrayOfSolution[i][0] ][ arrayOfSolution[i][1] ] = matrixOrig[ arrayOfSolution[i][0] ][ arrayOfSolution[i][1] ] - num;
        }
    }
}

function hasAllPairs(posibleRes, matrix){
    for(let i = 0 ;  i < matrix.length; i++){
        var resAux  = checkAllPairsForthisArray(matrix[i]);
        posibleRes.push(resAux);
    }
}

function checkAllPairsForthisArray(array){
    var res = false;
    if(array.length%2 ===0){
        var rows = [];
        var cols = [];
        for(let i = 0; i < array.length;  i++){
            rows.push(array[i][0]);
            cols.push(array[i][1]);
        }
        rows.sort();
        cols.sort();
        for(let y = 0 ; y < array.length ; y = y+2){
            if(rows[y] === rows[y+1]){
                res = true;
                
            }else{
                res = false;
                break
            }

            if(cols[y] === cols[y+1]){
                res = true;
                
            }else{
                res = false;
                break
            }
        }
    }
    
    return res;
 

}

function uniqBy(a, key){
    var seen ={};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

function procesoInversoArrayToMatrix(arrayResult, number, nroCols){
    arrayResult.push([  parseInt(number/nroCols )  , number%nroCols  ]  );
}

function checkForDoubleArray(arrayResult, posibility){
    for(let i = 0 ; i< posibility.length ; i++){
        var current = posibility[i];
        var contador = -1;
        for(let a = i; a< posibility.length ; a++){
            if(JSON.stringify(current) === JSON.stringify(posibility[a])){
                contador++;
            }
        }
        if(contador > 0){
            arrayResult.push(posibility[i]);
        }
    }
}
function transformIntoIndexOfArray(nroCols, row, col){
    return row*nroCols + col;
}
function getAllPosiblePaths(positionsVisited, matrix, posLook, positionsToIterate, posibility, forRows){
    var aux1 = [];
    var copyPositionsVisisted  = positionsVisited.slice();

    for(let i = 0; i < positionsToIterate.length ; i++){
        var numAuxVisisted = transformIntoIndexOfArray(matrix[0].length, positionsToIterate[i][0], positionsToIterate[i][1]);
        if(!copyPositionsVisisted.includes( numAuxVisisted) ){
            if(forRows){
                if(posLook[0] === positionsToIterate[i][0]){
                    
                        aux1.push(positionsToIterate[i]);
                }
                    
                
            }else{
                if(posLook[1] === positionsToIterate[i][1]){
                    aux1.push(positionsToIterate[i]);
                }
            }
        }
        
    }
     
    if(aux1.length === 0 ){
        posibility.push(copyPositionsVisisted);
    }
     
    // if(copyPositionsVisisted.length%2 === 0 ){
    //     var aray = [];
    //     console.log('copy posiution visited');
    //     console.log(copyPositionsVisisted);
    //     transformArrayIndexIntoMatrixPosition(copyPositionsVisisted, aray, matrix[0].length);
    //      console.log(aray); 
    //     if(checkAllPairsForthisArray(aray)){
    //         console.log('POSIBLE PUTO CANDIDATO');
    //         console.log(aray);
    //     }
    // }
    for(let i = 0; i < aux1.length ; i++){
        var copyPositionsVisisted2 = copyPositionsVisisted.slice();
        var aux2 = transformIntoIndexOfArray(matrix[0].length, aux1[i][0], aux1[i][1] );
         
            
        copyPositionsVisisted2.push(aux2);
            if(copyPositionsVisisted2.length %2 === 0 ){

                var aray = [];
                transformArrayIndexIntoMatrixPosition(copyPositionsVisisted2, aray, matrix[0].length);
                if(checkAllPairsForthisArray(aray)){
                      
                    getAllPosiblePaths(copyPositionsVisisted2, matrix, aux1[i], [] , posibility, !forRows);
                }else{
                    
                    getAllPosiblePaths(copyPositionsVisisted2, matrix, aux1[i], positionsToIterate, posibility, !forRows);
                }
            }else{

                getAllPosiblePaths(copyPositionsVisisted2, matrix, aux1[i], positionsToIterate, posibility, !forRows);
            }
            
         
 

    }
    
    

}

function getAllPOsitionsForInstance(matrix, arrayForPush, posLooked){
    for(let i=0 ; i < matrix.length ; i++){
        for(let j =0 ; j < matrix[0].length ; j++){
            if(matrix[i][j] != 0){
                if(i === posLooked[0] && j === posLooked[1]){

                }else{
                    arrayForPush.push([i,j]);
                }
                
                                
            }
        }
    }
}

function getMaxOrMin(pos, matrix, max){
    var row = 0 ;
    var col = 0;
    var current = matrix[row][col];
    for(let i=0; i < matrix.length ; i++){
        for(let j = 0 ; j < matrix[i].length ; j++){
            if(max){
                if(   matrix[i][j] > current ){
                    current = matrix[i][j];
                    row = i;
                    col = j;
                }
            }else{
                if(   matrix[i][j] < current ){
                    current = matrix[i][j];
                    row = i;
                    col = j;
                }
            }
        }
    }

    pos.push(row);
    pos.push(col);
}

function restarMatrices(resMatrix, initialMatrix, minuMatrix){
    for(let i=0 ; i<initialMatrix.length ; i++){
        var aux = [];
        for(let j =0 ; j < initialMatrix[i].length ; j++){
            aux.push(initialMatrix[i][j] - minuMatrix[i][j] );

        }
        resMatrix.push(aux);
    }
}

function refillMatricWithVectors(matrix, vecVer, vecHori){
    for(let row = 0;  row < vecVer.length ; row++){
        var axu = [];
        for(let col = 0; col < vecHori.length ; col++){
            axu.push(vecHori[col]+vecVer[row]);

        }
        matrix.push(axu);
    }
}

function refillVectors(vector,size,  firstOne, selectedVals){
    for(let i = 0; i < size ; i++){
        if(firstOne){
            if(i === 0){
                vector.push(getMinOfAllMatrix(selectedVals));
            }else{
                vector.push(0); 
                
            }
        }else{
            vector.push(0);
        }
    }
}

function getMinOfAllMatrix(matrix){
    var min = getMaxOfAllMatrix(matrix);
    if(min != 0 ){
        for(let i = 0 ; i < matrix.length ; i++){
            for(let j = 0; j < matrix[0].length ; j++){
                if(matrix[i][j] < min && matrix[i][j] > 0){
                    min = matrix[i][j];
                }
            }
        }
    }
    
    return min;
}
function getMaxOfAllMatrix(matrix){
    var max = 0;
    for(let i = 0 ; i < matrix.length ; i++){
        for(let j = 0; j < matrix[0].length ; j++){
            if(matrix[i][j] > max){
                max = matrix[i][j];
            }
        }
    }
    return max;
}
function asummepositionFrOriginalMatrix(secondMatrix,  thirdMatrix, matrixCostos, secVecVert, secVecHori){
    
    var rowsUsed = [0];
    var colsUsed = [];  
    
    for(let row = 0; row < matrixCostos.length ; row++){
        var aux = [];
        for(let col = 0 ; col < matrixCostos[row].length ; col++){
             if(secondMatrix[row][col] != 0){
                aux.push(matrixCostos[row][col]);

                 var numInCostosMatrix = matrixCostos[row][col];
                 var numInVertical = secVecVert[row];
                 var numInHorizontal = secVecHori[col];

                 if(numInCostosMatrix-numInVertical-numInHorizontal != 0 ){
                     if(rowsUsed.includes(row)){
                         colsUsed.push(col);
                        secVecHori[col] = numInCostosMatrix-numInVertical-numInHorizontal;
                     }else{
                         rowsUsed.push(row);
                         secVecVert[row] = numInCostosMatrix - numInVertical - numInHorizontal;
                     }
                 }else{
                    if(rowsUsed.includes(row)){
                        colsUsed.push(col);
                   
                    }else{
                        rowsUsed.push(row);
                        
                    }
                 }
                // var auxiliar2 = [];
                // auxiliar2.push(numInCostosMatrix);
                // auxiliar2.push(numInVertical);
                // auxiliar2.push(numInHorizontal);

                // auxiliar2.sort();


             }else{
                 aux.push(0);
             }
        }
        
    }

  


}

function getNumberToPush(row, col, vectorH, vectorV, secondMatrix){
     
}
 
function refillWithZeros(matrixParaCerear , rows, cols){
    for(let i=0; i < rows;  i++){
        var auxiliar = [];
        for(let j = 0 ; j < cols; j++){
            auxiliar.push(0);
        }
        matrixParaCerear.push(auxiliar);
    }
    
}

function findSumCol(matrix, col){
    var sum = 0;
    for(let i = 0; i <  matrix.length ; i++){
        sum += matrix[i][col];
    }
    return sum;
}

function findSumArray(array){
    var sum = 0;
    for(let i = 0 ; i <  array.length ; i++){
        sum += array[i];
    }
    return sum;
}