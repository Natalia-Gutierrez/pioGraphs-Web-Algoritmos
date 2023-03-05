//Base de datos en donde se almacenan las conexiones y sus valores.
var baseDatos = [];
//Buscar el valor actual de la conexion si se lo pusieron previamente.
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
        if ((baseDatos[i].llave).includes(idNodo)) {
            baseDatos.splice(i, 1);
            i--;
        }
    }
}
//Mostrar la matriz en la division correspondiente, con la suma de filas y suma de columnas.
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
    html +=`</tr>`;

    for (f = 0; f <filas; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < columnas; c++) {
            html += `<td>${matriz[f][c]}</td>`;
        }
        html+=`</tr>`;
    }
    html +=`</table>`;
    $(ubicacion).html(html);
}

function cerearMatrizInicial(matriz, n) {
    for (i = 0; i < n * n; i++) {
        matriz[i] = 0;
    }
    return matriz;
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
//Activar y desactivar el fondo blanco o cuadriculado.
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
//Colocarle nombre al nodo.
function getNombreEstacion(index) {
    nodos = document.getElementsByClassName("control");
    contenido = nodos[index + 1].innerHTML;
    nombre = contenido.substr(contenido.indexOf("Nodo"), contenido.length);
    return nombre;
}

//------------------------------------------------------------------------------------------------------
//Opción minimización.
function matrizMinimizacion(){
    var elementosOrigen = document.getElementsByClassName("origen");
    var elementosDestino = document.getElementsByClassName("destino");
    if(elementosOrigen.length==elementosDestino.length){
        var verticesOrigen = [];
        var verticesDestino = [];
        var filas=0;
        var columnas=0;
        var dimension = elementosOrigen.length-1;

        for (i = 1; i < elementosOrigen.length; i++) {
            verticesOrigen.push(elementosOrigen[i].id);
            filas++;
        }
        for (i = 1; i < elementosDestino.length; i++) {
            verticesDestino.push(elementosDestino[i].id);
            columnas++;
        }
        //Creamos y cereamos las matriz.
        var matriz = [];
        // matriz = cerearMatriz(matriz, dimension);
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
        var minimosFilas = [];
        for (c=0; c<dimension; c++){
            minimosFilas.push(matriz[c][0]);
        }
        for (f=0; f<dimension; f++){
            for (c=0; c<dimension; c++){
                if (matriz[f][c]<minimosFilas[f]){
                    minimosFilas[f]=matriz[f][c];
                }
            }
        }
        mostrarTablaMatriz(matriz, minimosFilas, '#matriz-minimizacion', dimension, 1);
        generarMatrizA1(matriz, minimosFilas, dimension, 1);
    }
    
}
//Opción maximización.
function matrizMaximizacion(){
    var elementosOrigen = document.getElementsByClassName("origen");
    var elementosDestino = document.getElementsByClassName("destino");
    if(elementosDestino.length==elementosOrigen.length){
        var verticesOrigen = [];
        var verticesDestino = [];
        var filas=0;
        var columnas=0;
        var dimension = elementosOrigen.length-1;
        for (i = 1; i < elementosOrigen.length; i++) {
            verticesOrigen.push(elementosOrigen[i].id);
            filas++;
        }
        for (i = 1; i < elementosDestino.length; i++) {
            verticesDestino.push(elementosDestino[i].id);
            columnas++;
        }
        var matriz = [];
        // matriz = cerearMatriz(matriz, dimension);
        // matriz = cerearMatriz(matriz, dimension);
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
        var maximosFilas = [];
        for (c=0; c<dimension; c++){
            maximosFilas.push(matriz[c][0]);
        }
        for (f=0; f<dimension; f++){
            for (c=0; c<dimension; c++){
                if (matriz[f][c]>maximosFilas[f]){
                    maximosFilas[f]=matriz[f][c];
                }
            }
        }
        mostrarTablaMatriz(matriz, maximosFilas, '#matriz-maximizacion', dimension, 2);
        generarMatrizA1(matriz, maximosFilas, dimension, 2);
    }
    
}
//Mostrar la matriz con sus minimos/maximos valores por columna.
function mostrarTablaMatriz(matriz, mCol, ubicacion, d, caso){
    let html = `
        <table>
            <tr>
                <th></th>`;
    for (c = 0; c < d; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    if(caso==1){
        html+=`<th style="background-color : #A6E1BC;">Mínimos</th>`
    } else{
        html+=`<th style="background-color : #A6E1BC;">Máximos</th>`
    }
    html += `</tr>`;
    for (f = 0; f < d; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < d; c++) {
            html += `<td>${matriz[f][c]}</td>`;
        }
        html+=`<td style="background-color : #A6E1BC;">${mCol[f]}</td>`
        html += `</tr>`;
    }
    html += `</table>`;
    $(ubicacion).html(html);
}
//Generar la matriz A1.
function generarMatrizA1(matriz, mFil, d, caso){
    console.log("Matriz inicial: ", matriz);
    console.log("mFil: ", mFil);
    var a1 = [];
    a1 = cerearMatriz(a1, d);
    for(f=0; f<d; f++){
        for (c=0;c<d; c++){
            a1[f][c]=parseInt(matriz[f][c],10)-parseInt(mFil[f],10);
        }
    }
    var mColumnas = [];
    for (c=0; c<d; c++){
        mColumnas.push(a1[0][c]);
    }
    for (f=0; f<d; f++){
        for (c=0; c<d; c++){
            if(caso==1){
                if (a1[f][c]<mColumnas[c]){
                    mColumnas[c]=a1[f][c];
                }
            } 
            if (caso==2) {
                if (a1[f][c]>mColumnas[c]){
                    mColumnas[c]=a1[f][c];
                }
            }
        }
    }
    if(caso==1){
        mostrarTablaMatrizA1(a1, mColumnas, '#a1-minimizacion', d, 1);
        generarMatrizA2(a1, mColumnas, d, matriz, 1);
    } else {
        mostrarTablaMatrizA1(a1, mColumnas, '#a1-maximizacion', d, 2);
        generarMatrizA2(a1, mColumnas, d, matriz, 2);
    }
}
//Mostrar la matriz a1.
function mostrarTablaMatrizA1(matriz, mCol, ubicacion, d, caso){
    let html = `
        <table>
            <tr>
                <th></th>`;
    for (c = 0; c < d; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    html += `</tr>`;

    for (f = 0; f <d; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < d; c++) {
            html += `<td>${matriz[f][c]}</td>`;
        }
        html += `</tr>`;
    }
    html+= `<tr>`;
    if (caso==1){
        html+= `<td style="background-color : #A6E1BC;"><strong>Mínimos</strong></td>`
    } else {
        html+= `<td style="background-color : #A6E1BC;"><strong>Máximos</strong></td>`
    }
    for (c=0; c<d; c++){
        html+=`<td style="background-color : #A6E1BC;">${mCol[c]}</td>`
    }
    html+=`</tr>`;
    html += `</table>`;
    $(ubicacion).html(html);
}
//Generar la matriz a2.
function generarMatrizA2(a1, mCol, d, matrizOriginal, caso){
    console.log("Matriz A1: ", a1);
    console.log("mCol: ", mCol);
    var a2 = [];
    a2 = cerearMatriz(a2, d);
    for(f=0; f<d; f++){
        for (c=0;c<d; c++){
            a2[f][c]=parseInt(a1[f][c],10)-parseInt(mCol[c],10);
        }
    }
    if (caso == 1){
        mostrarTablaMatrizA2(a2, '#a2-minimizacion', d);
        console.log("Matriz a2: ", a2);
        obtenerSolucion(a2, '#matriz-solucion-minimizar', matrizOriginal,1);
    } else {
        mostrarTablaMatrizA2(a2, '#a2-maximizacion', d);
        console.log("Matriz a2: ", a2);
        obtenerSolucion(a2, '#matriz-solucion-maximizar', matrizOriginal,2);
    }
}
//Mostrar la matriz A2.
function mostrarTablaMatrizA2(matriz, ubicacion, d){
    let html = `
        <table>
            <tr>
                <th></th>`;
    for (c = 0; c < d; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    html += `</tr>`;

    for (f = 0; f < d; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < d; c++) {
            html += `<td>${matriz[f][c]}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    $(ubicacion).html(html);
}
//Cerea la matriz.
function cerearMatriz(matriz, dimension) {
    for (var f=0; f<dimension; f++){
        //Creamos un nuevo array que representa cada fila dentro de la tabla.
        var nuevoArray=[];
        for (var c=0; c<dimension; c++){
            //Hacemos push de ceros en el array de acuerdo a la cantidad de columnas que deseamos que tenga.
            nuevoArray.push(0);
        }
        // Por ultimo hacemos un push del array dentro de la matriz habiendo concluido una fila
        matriz.push(nuevoArray);
    }
    return matriz;
}
//--------------------------------------------------------------------------------------
//Obtener la combinacion para la solucion.
function obtenerSolucion(a2, ubicacion, matrizOriginal, caso){
    var posiblesValores = getValores0(a2);
    var casoEspecialMax = document.getElementById('caso-especial-maximizar');
    var casoEspecialMin = document.getElementById('caso-especial-minimizar');
    casoEspecialMax.innerText = '';
    casoEspecialMin.innerText = '';
    //Encontrar las posibles soluciones.
    var flag = false; 
    var solucionEncontrada=[];
    for(j=0; j<posiblesValores.length; j++){
        if(posiblesValores[j].fila == 0){
            solucionEncontrada = solucion(posiblesValores[j], posiblesValores); 
            if (solucionEncontrada.length == a2.length){
                console.log("Encontraste la solucion");
                flag = true;
                break;
            }
        }
    }
    console.log(solucionEncontrada);
    if(flag == false){
        console.log("No es posible asignar una opcion factible, necesitas manipular la matriz :(");
        if(caso==2){
            maxMatriz = getMaxMatriz(a2);
            for (i = 0; i < a2.length; i++) {
              for (j = 0; j < a2.length; j++) {
                a2[i][j] = maxMatriz - a2[i][j];
              }
            }
            casoEspecialMax.innerText = 'No es posible asignar una opcion factible, se manipulará la matriz :)';
        }else{
            casoEspecialMin.innerText = 'No es posible asignar una opcion factible, se manipulará la matriz :)';
        }
        appoint(a2);
        
        printResult(a2);
        var coordenadas = [];
        for(fila = 0;fila < a2.length;fila ++){  
            for(columna = 0;columna < a2.length;columna ++)  
                if(a2[fila][columna] == -1) {
                    coordenadas.push({fila:fila,columna:columna});
                } 
                      
        }  
        mostrarTablaMatrizSolucion(matrizOriginal,ubicacion,matrizOriginal.length, coordenadas, matrizOriginal);

    }else{
        mostrarTablaMatrizSolucion(a2,ubicacion,a2.length,solucionEncontrada, matrizOriginal);
    }

}
function getValores0(a2){
    var resultados = [];
    for(fila=0;fila<a2.length;fila++){
        for(columna = 0; columna<a2.length; columna++){
            if(a2[fila][columna]==0){
                resultados.push({fila:fila,columna:columna});
            }
        }
    }
    console.log(resultados);
    return resultados;
}
function solucion(primerValor, posiblesValores){
    var solucion = [];
    solucion[0] = primerValor;
    aux = 0;
    var columnasOcupadas = [];
    columnasOcupadas.push(primerValor.columna);
    for(i=0; i<posiblesValores.length; i++){
        if(posiblesValores[i].fila != solucion[aux].fila){
            if(!columnasOcupadas.includes(posiblesValores[i].columna)){
                aux++;
                solucion[aux] = posiblesValores[i];
                columnasOcupadas.push(solucion[aux].columna);
            }
        }
    }
    return solucion;
}
function mostrarTablaMatrizSolucion(matriz, ubicacion, d, coordenadas, matrizOriginal){
    let html = `
        <table>
            <tr>
                <th></th>`;
    for (c = 0; c < d; c++) {
        html += `<th>${getNombreDestino(c)}</th>`;
    }
    html += `</tr>`;
    var lista = "";
    var totalSuma = 0;
    for (f = 0; f < d; f++) {
        html += `<tr><td>${getNombreOrigen(f)}</td>`;
        for (c = 0; c < d; c++) {
            if(coordenadas[f].fila==f&&coordenadas[f].columna==c){
                html += `<td style="background-color : #62D6E6;">${matriz[f][c]}</td>`;
                lista+= '<li>'+matrizOriginal[f][c]+'</li>';
                totalSuma+=parseInt(matrizOriginal[f][c],10);
            }else{
                html += `<td>${matriz[f][c]}</td>`;
            }   
        }
        html += `</tr>`;
    }
    html += `</table>`;

    htmlValores=`
            <ul>
            ${lista}
            </ul>
            <h6>Total: ${totalSuma}</h6>`
    $(ubicacion+'-valores').html(htmlValores);
    $(ubicacion).html(html);
}
function manipularMatriz(a2){
    var filas = [];
    var columnas = [];
    var cantCerosFila = 0;
    var cantCerosColumna = 0;
    for(fila=0; fila<a2.length; fila++){
        cantCerosFila = 0;
        cantCerosColumna = 0;
        for(columna=0; columna<a2.length; columna++){
            if(a2[fila][columna]==0){
                cantCerosFila++;
            }
            if(a2[columna][fila]==0){
                cantCerosColumna++;
            }
        }
        if(cantCerosFila>1){
            filas.push(fila);
        }
        if(cantCerosColumna>1){
            columnas.push(fila);
        }
    }
    console.log(filas);
    console.log(columnas);
    var menorValor = [];
    for(f=0; f<a2.length; f++){
        for(c=0; c<a2.length; c++){
            if(!filas.includes(f)){
                if(!columnas.includes(c)){
                    menorValor.push(a2[f][c]);
                }
            }
        }
    }
    console.log(menorValor);
    var menor = Math.min.apply(null, menorValor);
    console.log(menor);
    var nuevaA2 = [];
    for(fil=0; fil<a2.length; fil++){
        var nuevaFila = [];
        for(col=0; col<a2.length; col++){
            if(filas.includes(fil)){
                if(columnas.includes(col)){
                    nuevaFila.push(parseInt(a2[fil][col])+menor);
                } else {
                    nuevaFila.push(parseInt(a2[fil][col]));
                }
            } else {
                if(columnas.includes(col)){
                    nuevaFila.push(parseInt(a2[fil][col]));
                } else {
                    nuevaFila.push(parseInt(a2[fil][col])-menor);
                }
            }
        }
        nuevaA2.push(nuevaFila);
    }
    console.log(nuevaA2);
    return nuevaA2;
}

//-----------------------------------------FUNCIONES CASO ESPECIAL-----------------------------------------------------------
function appoint(m){  
    N = m.length;  
    //Contrato   
    for(i = 0;i < N;i ++){  
        min = Number.MAX_VALUE;  
        for(j = 0;j < N;j ++){  
            if(m[i][j] < min)  
                min = m[i][j];  
        }  
        for(j = 0;j < N;j ++)  
            m[i][j] -= min;  
    }  
    // Listar el protocolo   
    for(j = 0;j < N;j ++){  
        min = Number.MAX_VALUE;  
        for(i = 0;i < N;i ++){  
            if(m[i][j] < min)  
                min = m[i][j];  
        }  
        if(min == 0)  
            continue;  
        for(i = 0;i < N;i ++)  
            m[i][j] -=min;  
    }  
      
    printM(m);  
      
             // Hacer una distribución de prueba   
    while(true){  
        zeroExist = true;  
        while(zeroExist){  
            zeroExist = false;  
            if(rowAppoint(m))  
                zeroExist = true;  
            if(colAppoint(m))  
                zeroExist = true;  
            printM(m);  
        }  
                     // Determinar si se alcanza la asignación óptima   
        if(isOptimal(m))  
            break;  
          
                     // Matriz de transformación   
        updataM(m);  
          
                     // Restaurar 0 elementos   
        for(i = 0;i < N;i ++){  
            for(j = 0;j < N;j ++)  
                if(m[i][j]<0)  
                    m[i][j] = 0;  
        }  
          
        printM(m);  
    }  
}  
  
function updataM(m){  
    N = m.length;  
    // Registro de verificación de fila y columna   
    rowIsChecked = [];  
    colIsChecked = [];  
    // Verifica las líneas que no están encerradas en un círculo   
    for(i = 0;i < N;i ++){  
        for(j = 0;j < N;j ++){  
            if(m[i][j] == -1){  
                rowIsChecked[i] = false;  
                break;  
            }else{  
                rowIsChecked[i] = true;  
            }  
        }  
    }  
      
    isChecked = true;  
      
    while(isChecked){  
        isChecked = false;  
          
                     // Verifique la columna donde se encuentra el elemento 0 de todas las filas marcadas   
        for(i = 0;i < N;i ++){  
            if(rowIsChecked[i]){  
                for(j = 0;j < N;j ++){  
                    if(m[i][j]==-2 && !colIsChecked[j]){  
                        colIsChecked[j] = true;  
                        isChecked = true;  
                    }  
                }  
            }  
        }  
                     // Verifique la fila de elementos cero independientes en la columna de verificación   
        for(j = 0;j < N;j ++){  
            if(colIsChecked[j]){  
                for(i = 0;i < N;i ++){  
                    if(m[i][j] == -1 && !rowIsChecked[i]){  
                        rowIsChecked[i] = true;  
                        isChecked = true;  
                    }  
                }  
            }  
        }  
    }  

             // Encuentra el número más pequeño fuera de la línea cero   
    min = Number.MAX_VALUE;  
    for(i = 0;i < N;i ++){  
        if(rowIsChecked[i]){  
            for(j = 0;j < N;j ++){  
                if(!colIsChecked[j]){  
                    if(m[i][j] < min)  
                        min = m[i][j];  
                }  
            }             
        }  
    }  
      
             // Verifica cada línea menos min   
    for(i=0;i < N;i ++){  
        if(rowIsChecked[i]){  
            for(j = 0;j < N;j ++){  
                if(m[i][j] > 0)  
                    m[i][j] -= min;  
            }  
        }  
    }  
      
             // Verifica cada columna y agrega min   
    for(j=0;j < N;j ++){  
        if(colIsChecked[j]){  
            for(i = 0;i < N;i ++){  
                if(m[i][j] > 0)  
                    m[i][j] += min;  
            }  
        }  
    }         
              
}  
  
     // Cuente el número de 0 en un círculo para determinar si se encuentra la solución óptima   
function isOptimal(m){  
    count = 0;  
    for(i = 0;i < m.length;i ++){  
        for(j = 0;j < m.length;j ++)  
            if(m[i][j] == -1)  
                count ++;  
    }  
    return count==m.length;  
}  
  
     // Encuentre una fila con solo un elemento 0, márquelo como un elemento 0 independiente (-1) y cruce el elemento 0 de la columna (-2)   
     // Devuelve verdadero si hay 0 elementos independientes   
function rowAppoint(m){  
    zeroExist = false;   
    N = m.length;  
             // Encuentra una fila (columna) con solo un elemento 0   
    for(i = 0;i < N;i ++){  
        zeroCount = 0;  
        colIndex = -1;  
        for(j = 0;j < N;j ++){  
            if(m[i][j]==0){  
                zeroCount ++;  
                colIndex = j;  
                zeroExist = true;  
            }  
        }  
                     // Marque el elemento 0 independiente como -1 (marcado), el cero en la columna correspondiente está marcado como -2 (eliminado)   
        if(zeroCount == 1){  
            m[i][colIndex] = -1;  
            for(k = 0;k < N;k ++){  
                if(k == i)  
                    continue;  
                else if(m[k][colIndex] == 0)  
                    m[k][colIndex] = -2;  
            }  
                     } else if (zeroCount == 2) {// Si hay 2 conjuntos de soluciones, seleccione aleatoriamente una de ellas para resolver el problema de múltiples soluciones   
            if(Math.random()>0.95){  
                m[i][colIndex] = -1;  
                for(k = 0;k < N;k ++){  
                    if(k == i)  
                        continue;  
                    else if(m[k][colIndex] == 0)  
                        m[k][colIndex] = -2;  
                }  
                for(j = 0;j < N;j ++){  
                    if(j == colIndex)  
                        continue;  
                    else if(m[i][j] == 0)  
                        m[i][j] = -2;  
                }  
            }  
        }  
    }  
    return zeroExist;  
}  
     // Busque una columna con un solo elemento 0, márquela como un elemento 0 independiente (-1) y cruce el elemento 0 de la fila (-2)   
     // Devuelve verdadero si hay 0 elementos independientes   
function colAppoint(m){  
    zeroExist = false;   
    N = m.length;  
    for(j = 0;j < N;j ++){  
        zeroCount = 0;  
        rowIndex = -1;  
        for(i = 0;i < N;i ++){  
            if(m[i][j]==0){  
                zeroCount ++;  
                rowIndex = i;  
                zeroExist = true;  
            }  
        }  
        if(zeroCount == 1){  
            m[rowIndex][j] = -1;  
            for(k = 0;k < N;k ++){  
                if(k == j)  
                    continue;  
                else if(m[rowIndex][k] == 0)  
                    m[rowIndex][k] = -2;  
            }  
        }  
    }  
    return zeroExist;  
}  
  

  
function printM(m){  
    console.log("---------------");  
    for(i = 0;i < m.length;i ++){  
        for(j = 0;j < m.length;j ++)  
            console.log(m[i][j] + " ");  
        console.log();  
    }  
}  
  
function printResult(m){  
    console.log("-----Result------");  
    for(i = 0;i < m.length;i ++){  
        for(j = 0;j < m.length;j ++)  
            if(m[i][j] == -1)  
                console.log(i+"--"+j+", ");  
    }                 
}
function getMaxMatriz(m) {
    max = -Number.MAX_VALUE;
    for (x = 0; x < m.length; x++) {
      for (y = 0; y < m.length; y++) {
        if (m[x][y] > max) {
          max = m[x][y];
        }
      }
    }
    return max;
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