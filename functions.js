document.getElementById("content").style.display = "block";

function panelAdd() {
  var panel = document.getElementById("panelAdd");
  if (panel.style.display === "none") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

function panelGestionar() {
  var panel = document.getElementById("panelGestionar");
  if (panel.style.display === "none") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

function abonos() {
  var panel = document.getElementById("abonos");
  if (panel.style.display === "none") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }
}

 // Obtenemos todos los elementos de tipo checkbox
 const checkboxes = document.querySelectorAll('input[type="checkbox"]');
 const prestamo = document.getElementById('prestamo');
 // Escuchamos el evento de cambio en cada checkbox
 checkboxes.forEach((checkbox) => {
     checkbox.addEventListener('change', () => {
         if (checkbox.checked) {
             prestamo.value = checkbox.value;
         } else {
             prestamo.value = '';
         }
         // Desmarcamos los otros checkboxes para asegurarnos de que solo uno esté seleccionado
         checkboxes.forEach((otherCheckbox) => {
             if (otherCheckbox !== checkbox) {
                 otherCheckbox.checked = false;
             }
         });
     });
 });