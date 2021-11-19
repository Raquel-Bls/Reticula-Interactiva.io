// Inert polyfill https://github.com/GoogleChrome/inert-polyfill

window.addEventListener("load",function(){function h(a,b,c){if(0>b){if(a.previousElementSibling){for(a=a.previousElementSibling;a.lastElementChild;)a=a.lastElementChild;return a}return a.parentElement}if(a!=c&&a.firstElementChild)return a.firstElementChild;for(;null!=a;){if(a.nextElementSibling)return a.nextElementSibling;a=a.parentElement}return null}function g(a){for(;a&&a!==document.documentElement;){if(a.hasAttribute("inert"))return a;a=a.parentElement}return null}(function(a){var b=document.createElement("style");
b.type="text/css";b.styleSheet?b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.body.appendChild(b)})("/*[inert]*/[inert]{position:relative!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}[inert]::before{content:'';display:block;position:absolute;top:0;left:0;right:0;bottom:0}");var c=0;document.addEventListener("keydown",function(a){c=9===a.keyCode?a.shiftKey?-1:1:0});document.addEventListener("mousedown",
function(){c=0});document.body.addEventListener("focus",function(a){var b=a.target,f=g(b);if(f){if(document.hasFocus()&&0!==c){var d=document.activeElement,e=new KeyboardEvent("keydown",{keyCode:9,which:9,key:"Tab",code:"Tab",keyIdentifier:"U+0009",shiftKey:!!(0>c),bubbles:!0});Object.defineProperty(e,"keyCode",{value:9});document.activeElement.dispatchEvent(e);if(d!=document.activeElement)return;for(d=f;;){d=h(d,c,f);if(!d)break;a:{e=b;if(!(0>d.tabIndex)&&(d.focus(),document.activeElement!==e)){e=
!0;break a}e=!1}if(e)return}}b.blur();a.preventDefault();a.stopPropagation()}},!0);document.addEventListener("click",function(a){g(a.target)&&(a.preventDefault(),a.stopPropagation())},!0)});



// Global variable for the dialog close
// Variable global para el cierre del dialogo
var DialogTrigger;

function ParseElements(data, elmID) {
  try {
    // Use this if the JSON is coming over the wire
    // Usar estp si el JSON viene desde un servidor
    //var JSONdata = JSON.parse(data);
    var JSONdata = data;
    // Get the container that will hold our table
    // Genera el contenedor de nuestra tabla
    var theContainer = document.getElementById(elmID);
    // Clear the placeholder non-JS content
    // Borra el contenido  que no es JS
    theContainer.innerHTML = "";
    // Create an <ol> to contain it all and add it to the page
    // Crea un <ol> para contener todo y lo agrega a la página
    var ol = document.createElement("ol");
    //Le da el id = "Table" a <ol>
    ol.setAttribute("id","Table");
    //Agrega a <ol> como un hijo del contenedor
    theContainer.appendChild(ol);
    // Grab the JSON nodes
    // Obtiene los nodos de config.js
    var filteredNodes = JSONdata.elements;
    // Blank category array
    // Arreglo de categorias en blanco
    var catLookup = {};
    var catArray = [];
    // Loop through the elements nodes
    // Un ciclo para recorrer los nodos de las materias
    for (var a = 0; a < filteredNodes.length; a++) {
      var json = filteredNodes[a];
      //console.log(filteredNodes[a])
      // Create the <li>, give it an id and row/col info
      // Crea el <li>, y le da un id e información de fila/columna
      var elementNode = document.createElement("li");
      elementNode.setAttribute("id",json.nombre);
      elementNode.classList.add("row" + json.ypos);
      elementNode.classList.add("col" + json.xpos);
      // Get the category and concatenate into the class
      //Obtiene la categoria y la concatena en la clase
      var rawCat = json.semestre;
      var stringCat = rawCat;
      //stringCat = stringCat.split(' ').join('_');
      //stringCat = stringCat.split(',').join('');
      elementNode.classList.add("cat-" + stringCat);
      
      // Make the name container and give it an id
      // Hace un contenedor del nombre y le da un id
      var nameDiv = document.createElement("div");
      nameDiv.setAttribute("id","name" + json.nombre);
      // Coloca el nombre en la posición central de cada recuadro
      nameDiv.innerHTML = json.nombre; 
      
      // Este bloque crea los div de cada categoría
      var semestreDiv = document.createElement("div"); 
      semestreDiv.innerHTML = json.semestre;
      var hrsTotales = document.createElement("div"); 
      hrsTotales.innerHTML = "Hrs. Totales: " + json.horas;
      var hrsAulaDiv = document.createElement("div"); 
      hrsAulaDiv.innerHTML = "Hrs. Aulas: " + json.horasAula;    
      var hrsLabDiv = document.createElement("div"); 
      hrsLabDiv.innerHTML = "Hrs. Lab: " + json.horasLab;
      
      // Make the button and give it an id and ARIA bits
      // Crea el bóton y le da un id y ARIA Bits (Atributo de accesibilidad)
      var detailButton = document.createElement("button");
      detailButton.innerHTML = "details.";
      detailButton.setAttribute("type","button");
      detailButton.setAttribute("id","btn" + json.nombre);
      var labelledby = "name" + json.nombre + " btn" + json.nombre;
      detailButton.setAttribute("aria-labelledby",labelledby);
      detailButton.setAttribute("onclick","OpenDialog(this.id,'" + json.nombre + "');");
      // Add all the nodes to the <li>
      // Agrega todos los nodos al elemento <li>
      elementNode.appendChild(semestreDiv);
      elementNode.appendChild(nameDiv);
      elementNode.appendChild(hrsTotales);
      elementNode.appendChild(hrsAulaDiv); 
      elementNode.appendChild(hrsLabDiv);
      elementNode.appendChild(detailButton); //Pendiente
      // Add the <li> to the <ol>
      // Agrega el elemento <li> al <ol>
      ol.appendChild(elementNode);
      // Loop through the category and add distinct to array
      // Hace un recorrido a través de las categorias y agrega los distintas al arreglo

      if (!(rawCat in catLookup)) {
        catLookup[rawCat] = 1;
        catArray.push(rawCat);
        // console.log(rawCat);
      }
    }
    // Create a <dl> to hold categories
    // Crea un <dl> que contiene laas categorias
    var dl = document.createElement("dl");
    for (var i = 0; i < catArray.length; i++) {
      var catText = catArray[i];
      var catString;
      //catString = catText.split(' ').join('_'); //Es posible que se tengan que remover
      //catString = catString.split(',').join(''); //Es posible que se tengan que remover
      catString = "cat-" + catString;
      //console.log(catString);
      // Make the color container and class it
      // Hace el contenedor de los colores y les da una clase
      var dt = document.createElement("dt");
      dt.classList.add(catString);
      // Make the category container
      // Hace un contenedor de categorías
      var dd = document.createElement("dd");
      dd.innerHTML = catText;
      dd.setAttribute("id",catString);
      // Make the button
      // Crea el botón
      var showButton = document.createElement("button");
      showButton.innerHTML = "highlighting";
      showButton.setAttribute("type","button");
      showButton.setAttribute("onmouseover","ToggleStyleBlock('" + catString + "','show');");
      showButton.setAttribute("onfocus","ToggleStyleBlock('" + catString + "','show');");
      showButton.setAttribute("onmouseout","ToggleStyleBlock('','hide');");
      showButton.setAttribute("onblur","ToggleStyleBlock('','hide');");
      showButton.setAttribute("id","btn-" + catString);
      var labelledby = " btn-" + catString + " " + catString;
      showButton.setAttribute("aria-labelledby",labelledby);
      // Append these to the <dl>
      // Concatena estas al <dl>
      dt.appendChild(showButton);
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    /* // Create a new <li>
    var keyItem = document.createElement("li");
    keyItem.setAttribute("role","presentation");
    //keyItem.setAttribute("aria-hidden","true");
    keyItem.setAttribute("id","Key");
    // Give it some context
    var h2 = document.createElement("h2");
    h2.innerHTML = "Category key:";
    // Add the context text
    keyItem.appendChild(h2);
    // Add the new list to it
    keyItem.appendChild(dl);
    // Add this entire mess to the <ol>
    ol.appendChild(keyItem);*/

    /*Todo lo anterior crea la iluminación de la busqueda por categorías
    pero es necesario sacarlo de la tabla para que no se desborde
    ***queda pendiente***/
  } catch (e) {
    console.log("ParseElements(): " + e);
  }
}

// Obtiene el json e invoca el parsing de los datos que contiene
fetch("./data/data.json")
  .then(response => response.json())
  .then(json => ParseElements(json, "Elements"));


// Oscurece la tabla ***Todavía no está implementado****
function ToggleStyleBlock(strClass, showhide) {
  try {
    if (showhide == "show") {
      // Create a style block
      // Crea un bloque de estilos
      var styleBlock = document.createElement("style");
      styleBlock.setAttribute("id","ShowCat");
      document.head.appendChild(styleBlock);
      styleBlock.sheet.insertRule(
        "#Elements li:not(#Key):not(." + strClass + ") { background-color: #999; opacity: .5; }",0
      );
      styleBlock.sheet.insertRule(
        "@media screen and (prefers-color-scheme: dark) { #Elements li:not(#Key):not(." + strClass + ") { background-color: #333; opacity: .5; } }",1
      );
      styleBlock.sheet.insertRule(
        "@media screen and ()) { #Elements li:not(#Key):not(." + strClass + ") { opacity: .25; } }",2
      );
    } else {
      var node = document.getElementById("ShowCat");
      node.parentNode.removeChild(node);
    }
  } catch (e) {
    console.log("ToggleStyleBlock(): " + e);
  }
}

// Función para abrir el dialogo que muestra el resumen de la materia
function OpenDialog(eID,elName) {
  try {
    DialogTrigger = eID;
    // Get all the elements to manipulate
    // Obtiene todos los elementos a manipular
    var body = document.getElementsByTagName("body");
    var landmarks = document.querySelectorAll("header, main, footer");
    var overlay = document.getElementById("Overlay");
    var dialog = document.getElementById("Dialog");
    var heading = document.getElementById("DialogName");
    var closeBtn = document.getElementById("DialogClose");
    // Set the heading
    // Establece la cabecera, el nombre de la materia
    heading.innerHTML = elName;
    // Call the function to populate the dialog
    // Llama a la función para poblar el dialogo

    fetch("./data/data.json")
    .then(response => response.json())
    .then(json => ParseElementDetail(json, "ElementDetail",elName));
    //ParseElementDetail(data,"ElementDetail",elName);
    
    // Hide the content regions from AT
    // Esconde las regiones de contenido para el AT
    for (var i = 0; i < landmarks.length; i++) {
      landmarks[i].setAttribute("aria-hidden","true");
      landmarks[i].setAttribute("inert","");
    }
    // Hide the content behind the overlay
    // Esconde el contenido detrás del overlay
    overlay.style.display = "block"; //overlay.style.display = "block";
    // Add click handler to overlay
    // Agrega un manejador para el overlay
    overlay.setAttribute("onclick","CloseDialog('" + eID + "');");
    // Kill the page scroll
    // Inhabilita el escroll de la página
    body[0].style.overflow = "hidden";
    // Set the dialog to modal
    // Hace el dialogo modal
    dialog.setAttribute("aria-modal","true");
    // dialog.setAttribute("data-id",eID);
    dialog.removeAttribute("hidden"); 
    // Put focus on the close button
    // Pone el foco sobre el botón cerrar
    // Normally I would put it on the modal, but this fits ****Se va a remover
    closeBtn.setAttribute("onclick","CloseDialog('" + eID + "');");
    closeBtn.focus();
  } catch (e) {
    console.log("OpenDialog(): " + e);
  }
}

// Función para cerrar los dialogos
function CloseDialog(eID) {
  try {
    // Get all the elements to manipulate
    // Obtiene todos los elementos para manipular
    var body = document.getElementsByTagName("body");
    var landmarks = document.querySelectorAll("header, main, footer");
    var overlay = document.getElementById("Overlay");
    var dialog = document.getElementById("Dialog");
    var triggerBtn = document.getElementById(eID);
    // Make the regions available to AT
    // Hace las regiones disponibles a los atributos
    for (var i = 0; i < landmarks.length; i++) {
      landmarks[i].removeAttribute("aria-hidden");
      landmarks[i].removeAttribute("inert");
    }
    // Remove the overlay
    // Remueve el overlay
    overlay.style.display = "none";
    // Return the scrollbar
    // Recupera el scrollbar
    body[0].style.overflow = "auto";
    // Kill the dialog
    // Mata el dialogo
    dialog.removeAttribute("aria-modal");
    dialog.removeAttribute("data-id");
    dialog.setAttribute("hidden","");
    // Return focus to trigger
    // Regresa el foco al trigger
    triggerBtn.focus();
  } catch (e) {
    console.log("CloseDialog(): " + e);
  }
}

// Función que hace el parsing de los detalles de cada matería, en este caso la descripción
function ParseElementDetail(data, elmID, elName) {
  try {
    // Get the container that will hold our table
    // Obtiene el contenedor con el que obtendra nuestra tabla
    var theContainer = document.getElementById(elmID);
    // Clear the placeholder non-JS content
    // Limpia el marcador de posición de cualquier contenido no-JS
    theContainer.innerHTML = "";
    // Use this if the JSON is coming over the wire
    // var JSONdata = JSON.parse(data);
    var JSONdata = data;
    // Grab the JSON nodes
    // Obtiene los nodos JSON
    var filteredNodes = JSONdata.elements;
    // Loop through the subject nodes
    // Hace un recorrido de los nodos de las materias
    for (var a = 0; a < filteredNodes.length; a++) {
      var json = filteredNodes[a];
      if (json.nombre == elName) {
        // Primer parrafo de la descprición
        var p = document.createElement("p");
        p.innerHTML = json.descripcion;
        theContainer.appendChild(p);
        // Create a <dl> to hold categories
        var dl = document.createElement("dl");

        // Segundo parrafo de la descprición
        var p = document.createElement("p");
        p.innerHTML = json.descripcion2;
        theContainer.appendChild(p);
        // Create a <dl> to hold categories
        var dl = document.createElement("dl");

        // Tercer parrafo de la descripción
        var p = document.createElement("p");
        p.innerHTML = json.descripcion3;
        theContainer.appendChild(p);
        // Create a <dl> to hold categories
        var dl = document.createElement("dl");
      }
    }
  } catch (e) {
    console.log("ParseElementDetail(): " + e);
  }
}

// Gestiona el recorrido de la tabla con el teclado, está obsoleto, se necesita reconstruir
document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape" || evt.key == "Esc";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    CloseDialog(DialogTrigger);
  }
};




