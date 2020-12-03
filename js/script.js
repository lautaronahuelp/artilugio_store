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
    return cantidad;
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
    this.RenderearCanasto();
  }

  LimpiaCanasto(){
    //***se usa el self creado anteriormente en lugar de this
    self.compra = [];
    self.preciototal = 0;
    localStorage.removeItem('canasto');
    self.RenderearCanasto();
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
    this.RenderearCanasto();
    this.PersistirCanasta();

  }

  RecuperaCanasta(){
    let canasta_local = localStorage.getItem('canasto');
    let prod;
    if (canasta_local != null && canasta_local != 'undefined'){
      let canastaLocalParseada = JSON.parse(canasta_local);
      this.preciototal = canastaLocalParseada.preciototal;
      this.cantidad_productos = canastaLocalParseada.cantidad;
      for(prod of canastaLocalParseada.compra){
        this.compra.push(prod);
        this.PersistirCanasta();
      }

    }

  }

  RenderearCanasto(){

  
    //limpia el html cada vez que se genera el canasto
    document.getElementsByClassName('encabezado__compra')[0].innerHTML = ``;
  
    for (let prod of this.compra) {
      let tarjetaCanasteado = document.createElement('div');
      tarjetaCanasteado.classList.add('encabezado');
      tarjetaCanasteado.classList.add('encabezado__producto');
  
      tarjetaCanasteado.innerHTML = `<img src="productos/${prod['picture']}.jpg" alt="">
      <span>${prod['nombre']}</span>
      `;
      
  
      
      //BOTON ELIMINAR DE CANASTO
      let boton_del = document.createElement('button');
      boton_del.classList.add('eliminar_del_canasto');
      boton_del.innerHTML = '-';
      tarjetaCanasteado.appendChild(boton_del);
      boton_del.addEventListener('click', () => {
        let id = prod['id'];
        this.EliminarDeCanasta(id);
        
      })

      //CANTIDAD EN CANASTO
      let cantidad = document.createElement('span');
      cantidad.innerHTML = ` x${prod['cantidad']}`;
      tarjetaCanasteado.appendChild(cantidad);

      //BOTON AGREGAR OTRO A CANASTO
      let boton_agr = document.createElement('button');
      boton_agr.classList.add('agregar_otro_al_canasto');
      boton_agr.innerHTML = '+';
      tarjetaCanasteado.appendChild(boton_agr);
      boton_agr.addEventListener('click', () => {
        let id = prod['id'];

        
        //AGREGA PRODUCTO AL CANASTO DESDE EL CANASTO
        
        let produ = DATABASE.catalogo[0].find(pr => {
          return pr.id == id;
        })

        produ.AgregarAlCarrito(miCanasto, 1);
        
      })
  
      document.getElementsByClassName('encabezado__compra')[0].appendChild(tarjetaCanasteado);
    }
    
    document.getElementsByClassName('encabezado__logo--burbuja')[0].innerHTML = this.CantidadProductos();
    document.getElementsByClassName('encabezado__micanasto--preciototal')[0].innerHTML = '$' + this.preciototal;
    
  }
  
}


let DATABASE = new DataBase;

var miCanasto = new Canasta(1);


DATABASE.GetData();

//RECUPERO LO QUE ESTE GUARDADO EN EL LOCALSTORAGE y RENDEREO CANASTO

miCanasto.RecuperaCanasta();
miCanasto.RenderearCanasto();

//GENERA PRODUCTOS DESTACADOS HTML
function RenderearCatalogo(productos){
  for (prod of productos) {
      var tarjetaProd = document.createElement('div');
      tarjetaProd.id = prod['id'];
      tarjetaProd.classList.add('producto');


      let categoria_para_fa = '';
      switch (prod.categoria[0]) {
        case 'audio':
          categoria_para_fa = 'fas fa-headphones';
        break;

        case 'cables':
          categoria_para_fa = 'fab fa-usb';
        break;

        case 'cargadores':
          categoria_para_fa = 'fas fa-bolt';
        break;

        case 'imagen':
          categoria_para_fa = 'fas fa-camera-retro';
        break;
        
        case 'memorias':
          categoria_para_fa = 'fas fa-sd-card';
        break;
        
        case 'redes':
          categoria_para_fa = 'fas fa-wifi';
        break;
        
      }

     

      tarjetaProd.innerHTML = `<h4>${prod['nombre']}</h4>
      <div class="producto__picture">
        <img src="productos/${prod['picture']}.jpg" alt="${prod['nombre']}">
      </div>
      <div class="producto__categoria tooltip">
          <span class="icono ${categoria_para_fa}"></span>
          <span class="tooltiptext">${prod.categoria[0]}</span>
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
      //buscar si el producto esta en el canasto
      let otro = miCanasto.compra.find(producto => {
        return producto.id == prod.id;
      })
      if( otro != null && otro != 'undefined'){
        boton.innerHTML = 'Agregar otro al canasto';
      } else {
        boton.innerHTML = 'Agregar al canasto';
      }

      
      caja.appendChild(boton);
      
      $(".agregado").hide();

      boton.addEventListener('click', (e) => {

        let producto = productos.find(producto => {
          return producto.id == e.target.parentNode.id;
        })

        producto.AgregarAlCarrito(miCanasto, 1);

        
        //comprado.innerHTML = 'Se agregó al canasto!';
        
        boton.innerHTML = 'Se agregó al canasto!';
        setTimeout(() => boton.innerHTML = 'Agregar otro al canasto', 1400)
    
        
          
        
        
        
      })

      tarjetaProd.appendChild(caja);


      let categoria_estado_id = '';
      switch(prod['categoria'][1]){
        case 'destacados':
          categoria_estado_id = 'productos__destacados';
        break;
        
        case 'promociones':
          categoria_estado_id = 'productos__promo';
        break;

      }

      document.getElementById(categoria_estado_id).appendChild(tarjetaProd);
  }
}

//FUNCION LIMPIA CANASTO QUE SE VA A CONVERTIR EN FINALIZAR COMPRA
let boton_limpia = document.getElementById('finaliza_compra');
boton_limpia.addEventListener('click', miCanasto.LimpiaCanasto);

//Interacciones y efectos con JQUERY
$("#boton_canasto").click(function(){
  $("#mi_canasto").fadeToggle();
});