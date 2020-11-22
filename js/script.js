var self; //**correccion para que metodo Canasta.LimpiaCanasto funcione ok (el addEventListener hacía que el this fuera el objeto html button) scope superior.

class Canasta{

  constructor(id){
    self = this; //**se asigna this a self para correccion
    this.id = id;
    this.compra = [];
    this.cantidad_productos = 0;
    this.preciototal = 0;
  }

  CantidadProductos(){
    let cantidad = 0;
    for (let producto of this.compra){
      cantidad += producto.cantidad;
      
    }

    this.cantidad_productos = cantidad;
  }
  
  EliminarDeCanasta(id){
    let indice_prod = this.compra.findIndex(producto => producto.id == id);

    if(typeof this.compra.find(producto => producto.id == id && producto.cantidad > 1) !== 'undefined'){
      //Obtengo el precio de una unidad dividiendo el precio total del producto por la cantidad.
      this.compra[indice_prod].precio -= (this.compra[indice_prod].precio) / (this.compra[indice_prod].cantidad);
      this.compra[indice_prod].cantidad -= 1;
      
    } else {
      this.compra.splice(indice_prod, 1);
    }
    
    this.PrecioTotal();
    this.CantidadProductos()
    this.PersistirCanasta();
    this.RenderearCanasto(0);
  }

  LimpiaCanasto(){
    //***se usa el self creado anteriormente en lugar de this
    self.compra = [];
    self.preciototal = 0;
    localStorage.removeItem('canasto');
    self.RenderearCanasto(0);
  }

  PersistirCanasta(){
    let paquete = {id : this.id, compra : this.compra, preciototal : this.preciototal, cantidad : this.cantidad_productos};
    localStorage.setItem('canasto', JSON.stringify(paquete));
  }
  
  PrecioTotal(){
    let precio_total_met = 0;
    for (let pr of this.compra) {
      precio_total_met += pr.precio;
    }

    this.preciototal = precio_total_met;
  }

  RecibeCarrito(compra) {
    
    
    if (typeof this.compra.find(producto => producto.id == compra.id) !== 'undefined'){
      let indice = this.compra.findIndex(producto => producto.id == compra.id);
      this.compra[indice].cantidad += 1;
      this.compra[indice].precio += compra.precio;
    } else {
      this.compra.push(compra);
    }
    this.PrecioTotal();
    this.CantidadProductos()
    this.RenderearCanasto(0);
    this.PersistirCanasta();

  }

  RecuperaCanasta(canastaLocal){
    let prod;
    let canastaLocalParseada = JSON.parse(canastaLocal);
    this.preciototal = canastaLocalParseada.preciototal;
    this.cantidad_productos = canastaLocalParseada.cantidad;
    for(prod of canastaLocalParseada.compra){
      this.compra.push(prod);
      this.PersistirCanasta();
    }
  

  }

  RenderearCanasto(a){

    if(localStorage.getItem('canasto') && a){

        this.RecuperaCanasta(localStorage.getItem('canasto'));
    }
    //limpia el html cada vez que se genera el canasto
    document.getElementsByClassName('encabezado__compra')[0].innerHTML = ``;

    let idEnCanasto = 1;
    let prod;

    for (prod of this.compra) {
      let tarjetaCanasteado = document.createElement('div');
      tarjetaCanasteado.id = prod['id'];
      tarjetaCanasteado.classList.add('encabezado');
      tarjetaCanasteado.classList.add('encabezado__producto');
  
      tarjetaCanasteado.innerHTML = `<img src="productos/${prod['picture']}.jpg" alt="">
      <span>${prod['nombre']}</span><span> x${prod['cantidad']}</span>
      `;
  
    
  
      let boton_del = document.createElement('button');
      boton_del.classList.add('eliminar_del_canasto');
      boton_del.innerHTML = 'X';
      tarjetaCanasteado.appendChild(boton_del);
  
        boton_del.addEventListener('click', (e) => {
          let id = e.target.parentNode.id;//uso el atributo id de html para almacenar id
          this.EliminarDeCanasta(id);
        
        })
  
      document.getElementsByClassName('encabezado__compra')[0].appendChild(tarjetaCanasteado);
      idEnCanasto += 1;
    }
    
    document.getElementsByClassName('encabezado__logo--burbuja')[0].innerHTML = this.compra.length;
    document.getElementsByClassName('encabezado__micanasto--preciototal')[0].innerHTML = '$' + this.preciototal;
    
  }
  
}


let DATABASE = new DataBase;
DATABASE.getProducts();
var miCanasto = new Canasta(1);

//RECUPERO LO QUE ESTE GUARDADO EN EL LOCALSTORAGE


miCanasto.RenderearCanasto(1);

//GENERA PRODUCTOS DESTACADOS HTML
function RenderearCatalogo(productos){
  for (prod of productos) {
      var tarjetaProd = document.createElement('div');
      tarjetaProd.id = prod['id'];
      tarjetaProd.classList.add('producto');

      tarjetaProd.innerHTML = `<h4>${prod['nombre']}</h4>
      <img src="productos/${prod['picture']}.jpg" alt="">
      <div class="producto__categoria">
          <span>${prod['categoria']}</span>
      </div>
      <div class="producto__precio">
          <span>$${prod['precio']}</span>
      </div>
      `;

      let caja = document.createElement('div');
      caja.classList.add('compra_estado');
      caja.id = prod['id'];

      let boton = document.createElement('button');
      boton.classList.add('agregar_al_canasto');
      boton.innerHTML = 'Agregar a mi canasto';
      caja.appendChild(boton);
      boton.addEventListener('click', (e) => {

        let producto = productos.find(producto => {
          return producto.id == e.target.parentNode.id;
        })

        producto.AgregarAlCarrito(miCanasto, 1);

        let comprado = document.createElement('span')
        comprado.innerHTML = 'Se agregó al canasto!'
        caja.appendChild(comprado);
        
      })

      tarjetaProd.appendChild(caja);


      document.getElementById('contenedor__productos').appendChild(tarjetaProd);
  }
}

//FUNCION LIMPIA CANASTO QUE SE VA A CONVERTIR EN FINALIZAR COMPRA
let boton_limpia = document.getElementById('finaliza_compra');
boton_limpia.addEventListener('click', miCanasto.LimpiaCanasto);

//Interacciones y efectos con JQUERY
$("#boton_canasto").click(function(){
  $("#mi_canasto").fadeToggle();
});