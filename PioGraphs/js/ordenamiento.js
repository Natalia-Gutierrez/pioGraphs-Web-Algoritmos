var numeros = [];
var cantidadNumeros = 0;
function comprueba(flag) {
    numeros = [];
    cantidadNumeros = 0;
    $('#insertion').html("");
    $('#selection').html("");
    $('#merge').html("");
    $('#shell').html("");
    var valor = document.getElementById('cantidadNumeros');
    if (valor.value < 0 || valor.value % 1 != 0) {
        document.getElementById('mensajeError').innerHTML = "Introduzca un numero entero positivo.";
    }
    else {
        cantidadNumeros = parseInt(valor.value, 10);
        quitarModal('#ingresoCantidadNumeros');
        if (flag == 1) {
            ingresoManual();
        }
        else {
            ingresoAleatorio();
        }
    }
}

function ingresoManual() {
    console.log("Ingreso manual");
    var html = `<h4>Introduzca los numeros a ordenar: </h4><br>`;
    for (i = 0; i < cantidadNumeros; i++) {
        if (i % 2 != 0) {//Cada dos valores se hara un salto de linea
            html += `<label style="margin-right:1vw;">Numero ${i + 1}: </label><input style = "height:1.5vw; width:4vw;" id="valor-${i + 1}"><br>`;
        }
        else {
            html += `<label style="margin-right:1vw;">Numero ${i + 1}: </label><input style = "height:1.5vw; width:4vw; margin-right:5vw;" id="valor-${i + 1}">`;
        }
    }
    $('#inputNumeros').html(html);
    $('#ingresoValores').modal({ show: true });
}

function agregarNumeros() {
    for (i = 0; i < cantidadNumeros; i++) {
        var numero = parseInt(document.getElementById("valor-" + (i + 1)).value, 10);
        numeros.push(numero);
    }
    quitarModal("#ingresoValores");
    var html = `<table><tr><td colspan="20"><h4>Numeros a ordenar</h4</td></tr><tr>`;
    for (i = 0; i < numeros.length; i++) {
        if (i % 20 == 0) {
            html += `</tr><tr><td>${numeros[i]}</td>`;
        }
        else {
            html += `<td>${numeros[i]}</td>`;
        }
    }
    html += `</table>`;
    $('#datos').html(html);
}

function ingresoAleatorio() {
    console.log("Ingreso aleatorio");
    for (i = 0; i < cantidadNumeros; i++) {
        var numeroAleatorio = Math.floor(Math.random() * 500);
        numeros.push(numeroAleatorio);
    }
    var html = `<table><tr><td colspan="20"><h4>Numeros a ordenar</h4</td></tr><tr>`;
    for (i = 0; i < numeros.length; i++) {
        if (i % 20 == 0) {
            html += `</tr><tr><td>${numeros[i]}</td>`;
        }
        else {
            html += `<td>${numeros[i]}</td>`;
        }
    }
    html += `</table>`;
    $('#datos').html(html);
}

function insertion() {
    if (cantidadNumeros == 0) {
        window.alert('Por favor ingrese los valores a ordenar antes de seleccionar el tipo de ordenamiento 😊');
    } else {
        console.log("Insertion Sort");
        var auxiliar = numeros.slice(0, numeros.lenght);
        console.log(auxiliar);
        //let numeros = [1,5,7,6,4,34,12,4,7,99,76,33,20,56];

        for (let i = 1; i < auxiliar.length; i++) {
            let current = auxiliar[i];
            let j = i - 1;
            while ((j > -1) && (current < auxiliar[j])) {
                auxiliar[j + 1] = auxiliar[j];
                j--;
            }
            auxiliar[j + 1] = current;
        }
        var html = `<table><tr><td colspan="20"><h4>Insertion</h4</td></tr><tr>`;
        for (i = 0; i < auxiliar.length; i++) {
            if (i % 20 == 0) {
                html += `</tr><tr><td>${auxiliar[i]}</td>`;
            }
            else {
                html += `<td>${auxiliar[i]}</td>`;
            }
        }
        html += `<tr><td colspan="20"><h4>Complejidad = O(n<sup>2</sup>) = ${Math.pow(cantidadNumeros, 2)}</h4</td></tr><tr>`;
        html += `</table>`;
        $('#insertion').html(html);
        console.log("Numeros desordenados", numeros);
        console.log("Numeros ordenados", auxiliar);
        // document.getElementById("insertion").innerHTML += `<h4>Insertion</h4>`;
        // document.getElementById("insertion").innerHTML += numeros;
    }

}
function selection() {
    if (cantidadNumeros == 0) {
        window.alert('Por favor ingrese los valores a ordenar antes de seleccionar el tipo de ordenamiento 😊');
    } else {
        console.log("Selection Sort");
        var auxiliar = numeros.slice(0, numeros.lenght);

        for (let i = 0; i < auxiliar.length; i++) {
            // Encontramos el menor
            let min = i;
            for (let j = i + 1; j < auxiliar.length; j++) {
                if (auxiliar[j] < auxiliar[min]) {
                    min = j;
                }
            }
            if (min != i) {
                // Intercambiamos los elementos
                let tmp = auxiliar[i];
                auxiliar[i] = auxiliar[min];
                auxiliar[min] = tmp;
            }
        }
        var html = `<table><tr><td colspan="20"><h4>Selection</h4</td></tr><tr>`;
        for (i = 0; i < auxiliar.length; i++) {
            if (i % 20 == 0) {
                html += `</tr><tr><td>${auxiliar[i]}</td>`;
            }
            else {
                html += `<td>${auxiliar[i]}</td>`;
            }
        }
        html += `<tr><td colspan="20"><h4>Complejidad = O(n<sup>2</sup>) = ${Math.pow(cantidadNumeros, 2)}</h4</td></tr><tr>`;
        html += `</table>`;
        $('#selection').html(html);
        console.log("Numeros desordenados", numeros);
        console.log("Numeros ordenados", auxiliar);
    }

}
function merge() {
    if (cantidadNumeros == 0) {
        window.alert('Por favor ingrese los valores a ordenar antes de seleccionar el tipo de ordenamiento 😊');
    } else {
        console.log("Merge Sort");
        auxiliar = numeros.slice(0, numeros.lenght);
        auxiliar = mergee(auxiliar);

        function mergee(num) {
            const half = num.length / 2
            //console.log(half);

            if (num.length <= 1) {
                return num;
            }
            //console.log(num);
            const left = num.splice(0, half);
            const right = num;
            //console.log(left);
            //console.log(right);
            //let sorted = []
            return mergeSort(mergee(left), mergee(right));
            console.log(mergeSort(mergee(left), mergee(right)));
        }

        function mergeSort(left, right) {
            //console.log("Hola");
            let arr = [];
            // Break out of loop if any one of the array gets empty
            while (left.length && right.length) {
                // Pick the smaller among the smallest element of left and right sub arrays 
                if (left[0] < right[0]) {
                    arr.push(left.shift())
                } else {
                    arr.push(right.shift())
                }
            }

            // Concatenamos los arrays
            return [...arr, ...left, ...right];
            //console.log(arr);
        }
        var html = `<table><tr><td colspan="20"><h4>Merge</h4</td></tr><tr>`;
        for (i = 0; i < auxiliar.length; i++) {
            if (i % 20 == 0) {
                html += `</tr><tr><td>${auxiliar[i]}</td>`;
            }
            else {
                html += `<td>${auxiliar[i]}</td>`;
            }
        }
        html += `<tr><td colspan="20"><h4>Complejidad = O(n logn) = ${cantidadNumeros * Math.log10(cantidadNumeros)}</h4</td></tr><tr>`;
        html += `</table>`;
        $('#merge').html(html);
    }

}
function shell() {
    if(cantidadNumeros==0){
        window.alert('Por favor ingrese los valores a ordenar antes de seleccionar el tipo de ordenamiento 😊');
    }else{
        console.log("Shell Sort");
        var auxiliar = numeros.splice(0, numeros.lenght);
        console.log(auxiliar);
        // let numeros = [1,5,7,6,4,34,12,4,7,99,76,33,20,56];
        console.log(numeros);
        console.log(shellSort(numeros));

        function shellSort(arr) {
            let n = arr.length;

            for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
                for (let i = gap; i < n; i += 1) {
                    let temp = arr[i];
                    let j;
                    for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                        arr[j] = arr[j - gap];
                    }

                    arr[j] = temp;
                }
            }
            return arr;
        }
        var html = `<table><tr><td colspan="20"><h4>Shell</h4</td></tr><tr>`;
        for (i = 0; i < numeros.length; i++) {
            if (i % 20 == 0) {
                html += `</tr><tr><td>${numeros[i]}</td>`;
            }
            else {
                html += `<td>${numeros[i]}</td>`;
            }
        }
        html += `<tr><td colspan="20"><h4>Complejidad = O(n log(n)<sup>2</sup>) = ${(parseInt(cantidadNumeros, 10) * (Math.log10(Math.pow(cantidadNumeros, 2))))}</h4</td></tr><tr>`;
        html += `</table>`;
        $('#shell').html(html);
    }

    
}
function quitarModal(modal) {
    $(modal).hide();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

function limpiar() {
    numeros = [];
    cantidadNumeros = 0;
    $('#datos').html("");
    $('#insertion').html("");
    $('#selection').html("");
    $('#merge').html("");
    $('#shell').html("");
}
//Guardar graphy
function guardarGrafo(){
    var nombreArchivo=document.getElementById("nombreArchivo").value;
    var data="";
    for(dato=0;dato<numeros.length;dato++){
        data+=numeros[dato];
        data+="\n";
    }

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
// Funcion para detectar la carga del archivo
document.querySelector('#file-input').addEventListener('change', ()=>{
    $('#insertion').html("");
    $('#selection').html("");
    $('#merge').html("");
    $('#shell').html("");
    let input = document.querySelector("#file-input");
    let files = input.files;
    if (files.lenght==0)return;
    const file = files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        const file = e.target.result;
        var aux = file.split('\n');
        aux.splice(0,0);
        aux.splice(-1);
        numeros=[];
        cantidadNumeros=Object.keys(aux).length;
        for(i=0;i<cantidadNumeros;i++){
            numeros.push(parseInt(aux[i],10));
        }
        var html = `<table><tr><td colspan="20"><h4>Numeros a ordenar</h4</td></tr><tr>`;
    for (i = 0; i < numeros.length; i++) {
        if (i % 20 == 0) {
            html += `</tr><tr><td>${numeros[i]}</td>`;
        }
        else {
            html += `<td>${numeros[i]}</td>`;
        }
    }
    html += `</table>`;
    $('#datos').html(html);
    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);
});

// Funcion para activar el input-file al presionar el boton Subir graphy.
document.getElementById("subirGrafo").addEventListener('click', function() {
    document.getElementById("file-input").click();
});