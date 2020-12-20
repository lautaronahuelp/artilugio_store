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

  RecibeCanasto(compra) {
    
    
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
    let formu = document.getElementById('form_finaliza_compra');
    formu.innerHTML = ``;
  
    for (let prod of this.compra) {
      let tarjetaCanasteado = document.createElement('div');
      tarjetaCanasteado.classList.add('encabezado');
      tarjetaCanasteado.classList.add('encabezado__producto');
  
      tarjetaCanasteado.innerHTML = `<img src="productos/${prod['picture']}.jpg" alt="">
      <span class="nombre_producto">${prod['nombre']}</span>
      `;
      
  
      
      //BOTON ELIMINAR DE CANASTO
      let boton_del = document.createElement('button');
      boton_del.classList.add('eliminar_del_canasto');
      boton_del.classList.add('fas');
      boton_del.classList.add('fa-minus-square');
      tarjetaCanasteado.appendChild(boton_del);
      boton_del.addEventListener('click', () => {
        let id = prod['id'];
        this.EliminarDeCanasta(id);
        
      })

      //CANTIDAD EN CANASTO
      let cantidad = document.createElement('span');
      cantidad.classList.add('cantidad_producto')
      cantidad.innerHTML = ` x${prod['cantidad']}`;
      tarjetaCanasteado.appendChild(cantidad);

      //BOTON AGREGAR OTRO A CANASTO
      let boton_agr = document.createElement('button');
      boton_agr.classList.add('agregar_otro_al_canasto');
      boton_agr.classList.add('fas');
      boton_agr.classList.add('fa-plus-square');
      tarjetaCanasteado.appendChild(boton_agr);
      boton_agr.addEventListener('click', () => {
        let id = prod['id'];

        
        //AGREGA PRODUCTO AL CANASTO DESDE EL CANASTO
        
        let produ = DATABASE.catalogo.find(pr => {
          return pr.id == id;
        })

        produ.AgregarAlCarrito(miCanasto, 1);
        
      })

      //AGREGAR A FORMULARIO FINALIZAR
      
      
      let prod_para_form = document.createElement('input');
      prod_para_form.setAttribute('type', 'hidden');
      prod_para_form.setAttribute('name', 'producto-'+prod.id);

      let json_prod = `{"title":"${prod.nombre}","picture_url":"http://octaedro.000webhostapp.com/artilugio/productos/${prod.picture}.jpg","quantity":"${prod.cantidad}","unit_price":"${(prod.precio)/(prod.cantidad)}"}`;
      prod_para_form.setAttribute('value', json_prod);
      
      formu.appendChild(prod_para_form);
      


  
      document.getElementsByClassName('encabezado__compra')[0].appendChild(tarjetaCanasteado);
    }
    //BOTON FINALIZAR COMPRA
    let boton_finalizar = document.createElement('input');
      boton_finalizar.setAttribute('type', 'submit');
      boton_finalizar.setAttribute('value', 'Finalizar compra');
      boton_finalizar.setAttribute('id', 'boton_finalizar_compra');
      formu.appendChild(boton_finalizar);
    
    document.getElementsByClassName('encabezado__logo--burbuja')[0].innerHTML = this.CantidadProductos();
    document.getElementsByClassName('encabezado__micanasto--preciototal')[0].innerHTML = 'TOTAL: $' + this.preciototal;
    
  }
  
}


let DATABASE = new DataBase;

var miCanasto = new Canasta(1);

DATABASE.GetData();
miCanasto.RecuperaCanasta();
Arranque();



//RECUPERO LO QUE ESTE GUARDADO EN EL LOCALSTORAGE y RENDEREO CANASTO
function Arranque(){
  //DATABASE.RenderMenu();
  DATABASE.RenderCatalogo();
  miCanasto.RenderearCanasto();
  

}

//FUNCION LIMPIA CANASTO QUE SE VA A CONVERTIR EN FINALIZAR COMPRA
//let boton_limpia = document.getElementById('finaliza_compra');
//boton_limpia.addEventListener('click', miCanasto.LimpiaCanasto);


//Interacciones y efectos con JQUERY
$("#boton_canasto").click(function(){
  $("#mi_canasto").slideToggle();
});

$("#logo").click(function(){
  Arranque();
});




$(document).ajaxComplete(function() {
  // SCROLL MENU
  let elemento = $('#menu_div')[0];
  let gradiente__l = $("#menu_div ~ .gradiente__l");
  gradiente__l.fadeOut();
  let gradiente__r = $("#menu_div ~ .gradiente__r");
  

  if(((elemento.scrollWidth - elemento.clientWidth) - elemento.scrollLeft) < 2){
    gradiente__r.fadeOut();
  }

  $('#menu_div').scroll(function() {
    
    if (((elemento.scrollWidth - elemento.clientWidth) - elemento.scrollLeft < 2)){
      gradiente__r.fadeOut();
    } else {
      gradiente__r.fadeIn();
    }
    
    if ($(this).scrollLeft() != 0){
      gradiente__l.fadeIn();
    } else {
      gradiente__l.fadeOut();
    }
  })

  gradiente__r.click(function() {
    
    elemento.scroll(elemento.scrollLeft + elemento.clientWidth,0);
  })

  gradiente__l.click(function() {

    elemento.scroll( elemento.scrollLeft - elemento.clientWidth,0);
  })
})

function ActivaScroll(){
  //SCROLL CATÁLOGO
  let categorias_scroll = $('#container__principal').children();
  console.log(categorias_scroll);
  for (i = 0; i<categorias_scroll.length; i++){
    console.log(categorias_scroll[i].id);
  let stringito = `${categorias_scroll[i].id} .frame`;
  let elementod = $('#'+ stringito)[0];
  let gradiente__ld = $('#'+stringito+' ~ .gradiente__l');
  gradiente__ld.fadeOut();
  let gradiente__rd = $('#'+stringito+' ~ .gradiente__r');
  

  if(((elementod.scrollWidth - elementod.clientWidth) - elementod.scrollLeft) < 2){
    gradiente__rd.fadeOut();
  }

  $('#'+stringito).scroll(function() {
    
    if (((elementod.scrollWidth - elementod.clientWidth) - elementod.scrollLeft < 2)){
      gradiente__rd.fadeOut();
    } else {
      gradiente__rd.fadeIn();
    }
    
    if ($(this).scrollLeft() != 0){
      gradiente__ld.fadeIn();
    } else {
      gradiente__ld.fadeOut();
    }
  })

  gradiente__rd.click(function() {
    
    elementod.scroll(elementod.scrollLeft + elementod.clientWidth,0);
  })

  gradiente__ld.click(function() {

    elementod.scroll( elementod.scrollLeft - elementod.clientWidth,0);
  })
  }


  
  




//})
}
