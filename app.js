firebase.initializeApp({
  apiKey: "AIzaSyDooj6DbnjRGC87Ts6DFK0k77moEy7pOFM",
  authDomain: "deudores-b8d84.firebaseapp.com",
  projectId: "deudores-b8d84",
});

var db = firebase.firestore();

actualizar();

function guardar() {
  let clave = document.getElementById("clave").value;
  let nombre = document.getElementById("nombre").value;
  let pagos = document.getElementById("pagos").value;
  let prestamo = document.getElementById("prestamo").value;

  // Validar que no haya campos vacíos
  if (!clave || !nombre || !pagos || !prestamo) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, complete todos los campos antes de guardar.",
    });
    return; // Detener la función si hay campos vacíos
  }

  db.collection("personas")
    .add({
      clave: clave,
      nombre: nombre,
      pagos: pagos,
      prestamo: prestamo,
    })
    .then(function (docRef) {
      console.log("ID", docRef.id);
      document.getElementById("clave").value = "";
      document.getElementById("nombre").value = "";
      document.getElementById("pagos").value = "";
      document.getElementById("prestamo").value = "";
      actualizar();
    })
    .catch(function (error) {
      console.error("Error", error);
    });
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Cliente Agregado",
    showConfirmButton: false,
    timer: 1500,
  });
}


function actualizar() {
  var tabla = document.getElementById("tabla");
  db.collection("personas")
    .get()
    .then((querySnapshot) => {
      tabla.innerHTML = "";
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "->", doc.data().nombre);
        tabla.innerHTML += `<tr class="border-b border-gray-600 alt">
        <td>${doc.data().clave}</td>
        <td>${doc.data().nombre}</td>
        <td>${doc.data().prestamo}</td>
        <td>${doc.data().pagos}</td>
        <td>
            <button class="btn p-2 m-auto text-white font-bold bg-yellow-600 rounded" onclick="editar(
            '${doc.id}','${doc.data().clave}','${doc.data().nombre}','${
          doc.data().prestamo
        }','${doc.data().pagos}')">Editar
            </button>
        </td>
        <td>
            <button class="btn p-2 m-auto text-white font-bold bg-red-600 rounded" onclick="eliminar(
            '${doc.id}')">Eliminar
            </button>
        </td>
        <td>
             <button class="btn p-2 m-auto text-white font-bold bg-purple-600 rounded" onclick="agregarTablaDeudores(
             '${doc.data().id}','${doc.data().clave}','${doc.data().nombre}','${
                doc.data().prestamo }','${doc.data().pagos}')">Deudor
             </button>
        </td>
        </tr>`;
      });
    });
}

function eliminar(id) {
  Swal.fire({
    title: "¿Seguro quiere Eliminar?",
    showDenyButton: true,
    confirmButtonText: "Sí, seguro",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Cuenta Saldada Correctamente!", "", "success");
      db.collection("personas")
        .doc(id)
        .delete()
        .then(function () {
          actualizar();
          console.loog("Cuenta Eliminada");
        })
        .catch(function (err) {
          console.error("error", err);
        });
    } else if (result.isDenied) {
      Swal.fire(
        "Enterado, puede seguir gestionando sus pagos con normalidad",
        "",
        "info"
      );
    }
  });
}

function editar(id, clave, nombre, prestamo, pagos) {
  Swal.fire({
    title: "Editar",
    html: `
            <p>Cliente: ${nombre}</p>
            <p>Clave: ${clave}</p>
            Prestamo:<input id="prestamo" class="swal2-input" value="${prestamo}" placeholder="Prestamo">
            Pagos: <input id="pagos" class="swal2-input" value="${pagos}" placeholder="No. Pagos">
            `,
    showCancelButton: true,
    confirmButtonText: "Editar",
    confirmButtonColor: "#0F842C",
    cancelButtonColor: "#BB2E1C",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: () => {
      const prestamo = parseFloat(
        Swal.getPopup().querySelector("#prestamo").value
      );
      const pagos = parseFloat(Swal.getPopup().querySelector("#pagos").value);
      return { prestamo, pagos };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { prestamo, pagos } = result.value;
      if (!isNaN(prestamo) && !isNaN(pagos)) {
        db.collection("personas")
          .doc(id)
          .update({
            prestamo: prestamo,
            pagos: pagos,
          })
          .then(() => {
            actualizar();
            console.log("Editado exitosamente.");
            Swal.fire({
              icon: "success",
              title: "Edición exitosa",
              timer: 2000,
            });
          })
          .catch((error) => {
            console.error("Error al editar:", error);
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ingrese cantidades válidas para Prestamo y No. Pagos.",
        });
      }
    } else {
      Swal.fire(
        "Enterado, puede seguir gestionando sus pagos con normalidad",
        "",
        "info"
      );
    }
  });
}

const consultaDeudores = () => {
  var tabla = document.getElementById("tabla");
  db.collection("deudores")
    .get()
    .then((querySnapshot) => {
      tabla.innerHTML = ""; // Limpiamos la tabla
      querySnapshot.forEach((doc) => {
        tabla.innerHTML += `<tr class="border-b border-gray-600 alt">
            <td>${doc.data().clave}</td>
            <td>${doc.data().nombre}</td>
            <td>${doc.data().prestamo}</td>
            <td>${doc.data().pagos}</td>
            <td>
            <button class="btn p-2 m-auto text-white font-bold bg-red-600 rounded" onclick="eliminar2(
            '${doc.id}')">Eliminar
            </button>
        </td>
          </tr>`;
      });
    });
};

const agregarTablaDeudores = (id, clave, nombre, prestamo, pagos) => {
  // Verificar si ya existe un registro con la misma clave
  db.collection("deudores")
    .where("clave", "==", clave)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        // Ya existe un registro con la misma clave, mostrar un mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ya existe un registro con esta clave.",
        });
      } else {
        // No existe un registro con la misma clave, agregar el nuevo registro
        db.collection("deudores")
          .add({
            id: id,
            clave: clave,
            nombre: nombre,
            pagos: pagos,
            prestamo: prestamo,
          })
          .then(function (docRef) {
            console.log("ID", docRef.id);
            document.getElementById("clave").value = "";
            document.getElementById("nombre").value = "";
            document.getElementById("pagos").value = "";
            document.getElementById("prestamo").value = "";
            actualizar();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Deudor agregado",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(function (error) {
            console.error("Error", error);
          });
      }
    })
    .catch(function (error) {
      console.error("Error al verificar la clave", error);
    });
};


function eliminar2(id) {
    Swal.fire({
      title: "¿Seguro quiere eliminar?",
      showDenyButton: true,
      confirmButtonText: "Sí, seguro",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deudor Eliminado Correctamente!", "", "success");
        db.collection("deudores")
          .doc(id)
          .delete()
          .then(function () {
            actualizar();
            console.loog("Cuenta Eliminada");
          })
          .catch(function (err) {
            console.error("error", err);
          });
      } else if (result.isDenied) {
        Swal.fire(
          "Enterado, puede seguir gestionando sus pagos con normalidad",
          "",
          "info"
        );
      }
    });
  }

  function buscarPorClave() {
    const claveABuscar = document.getElementById("buscarClave").value;
  
    if (claveABuscar === "") {
      // Si el campo de búsqueda está vacío, muestra la tabla completa.
      actualizar();
    } else {
      // Si se ingresó una clave en el campo de búsqueda, realiza la búsqueda.
      db.collection("personas")
        .where("clave", "==", claveABuscar)
        .get()
        .then((querySnapshot) => {
          const tabla = document.getElementById("tabla");
          tabla.innerHTML = ""; // Limpia la tabla
  
          querySnapshot.forEach((doc) => {
            tabla.innerHTML += `<tr class="border-b border-gray-600 alt">
                <td>${doc.data().clave}</td>
                <td>${doc.data().nombre}</td>
                <td>${doc.data().prestamo}</td>
                <td>${doc.data().pagos}</td>
                <td>
                    <button class="btn p-2 m-auto text-white font-bold bg-yellow-600 rounded" onclick="editar(
                    '${doc.id}','${doc.data().clave}','${doc.data().nombre}','${
              doc.data().prestamo
            }','${doc.data().pagos}')">Editar
                    </button>
                </td>
                <td>
                    <button class="btn p-2 m-auto text-white font-bold bg-red-600 rounded" onclick="eliminar(
                    '${doc.id}')">Eliminar
                    </button>
                </td>
                <td>
                    <button class="btn p-2 m-auto text-white font-bold bg-purple-600 rounded" onclick="agregarTablaDeudores(
                    '${doc.id}','${doc.data().clave}','${doc.data().nombre}','${
              doc.data().prestamo
            }','${doc.data().pagos}')">Deudor
                    </button>
                </td>
              </tr>`;
          });
        });
    }
  }
  