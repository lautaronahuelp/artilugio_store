var self; //**correccion para que metodo Canasta.LimpiaCanasto funcione ok (el addEventListener hacía que el this fuera el objeto html button) scope superior.

class Canasta{

  constructor(id){
    self = this; //**se asigna this a self para correccion
    this.id = id;
    this.compra = [];
    this.preciototal = 0;
  }
  
  EliminarDeCanasta(pos){
    this.preciototal -= this.compra[pos].precio;
    this.compra.splice(pos, 1);
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
    let paquete = {id : this.id, compra : this.compra, preciototal : this.preciototal};
    localStorage.setItem('canasto', JSON.stringify(paquete));
  }
  
  RecibeCarrito(compra) {
    this.compra.push(compra);
    this.preciototal += compra.precio;
    this.PersistirCanasta();
  }

  RecuperaCanasta(canastaLocal){
    let prod;
    let canastaLocalParseada = JSON.parse(canastaLocal);
    this.preciototal = canastaLocalParseada.preciototal;
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
      tarjetaCanasteado.id = idEnCanasto;
      tarjetaCanasteado.classList.add('encabezado');
      tarjetaCanasteado.classList.add('encabezado__producto');
  
      tarjetaCanasteado.innerHTML = `<img src="productos/${prod['picture']}.jpg" alt="">
      <span>${prod['nombre']}</span>
      `;
  
    
  
      let boton_del = document.createElement('button');
      boton_del.classList.add('eliminar_del_canasto');
      boton_del.innerHTML = 'X';
      tarjetaCanasteado.appendChild(boton_del);
  
        boton_del.addEventListener('click', (e) => {
          let posicionEnArrayCompra = (e.target.parentNode.id) - 1;
          this.EliminarDeCanasta(posicionEnArrayCompra);
        
        })
  
      document.getElementsByClassName('encabezado__compra')[0].appendChild(tarjetaCanasteado);
      idEnCanasto += 1;
    }
    
    document.getElementsByClassName('encabezado__logo--burbuja')[0].innerHTML = this.compra.length;
    document.getElementsByClassName('encabezado__micanasto--preciototal')[0].innerHTML = '$' + this.preciototal;
    
  }
  
}


let DATABASE = new DataBase;
let productos = DATABASE.getProducts();
var miCanasto = new Canasta(1);

//RECUPERO LO QUE ESTE GUARDADO EN EL LOCALSTORAGE


miCanasto.RenderearCanasto(1);

//GENERA PRODUCTOS DESTACADOS HTML
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

    let boton = document.createElement('button');
    boton.classList.add('agregar_al_canasto');
    boton.innerHTML = 'Agregar a mi canasto';
    tarjetaProd.appendChild(boton);
    boton.addEventListener('click', (e) => {

      let producto = productos.find(producto => {
        return producto.id == e.target.parentNode.id;
      })

      producto.AgregarAlCarrito(miCanasto, 1);
      miCanasto.RenderearCanasto(0);
      
    })


    document.getElementById('contenedor__productos').appendChild(tarjetaProd);
}

let boton_limpia = document.getElementById('finaliza_compra');

boton_limpia.addEventListener('click', miCanasto.LimpiaCanasto);