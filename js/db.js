var self;//**correccion para que metodo Canasta.LimpiaCanasto funcione ok (el addEventListener hacía que el this fuera el objeto html button) scope superior.
var that; //correccion similar para que ajaxComplete pushee los productos en la propiedad catalogo del objeto DataBase

class Producto{
  
    constructor(nombre, id, categoria, precio, stock, picture){
        this.nombre = nombre;
        this.id = id;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.picture = picture
      
    }
    
    
    AgregarAlCarrito(carrito,cantidad){
      var compra = {id: this.id, nombre: this.nombre, precio: this.precio, cantidad: cantidad, categoria: this.categoria, picture: this.picture};
      
      if(this.ComprobarStock(cantidad)){
        carrito.RecibeCarrito(compra);
        console.log('se agregó al carrito');
      } else{
        console.log('no hay stock');
      }
    }
    
    ComprobarStock(cantidad){
      if(cantidad <= this.stock){
        this.stock -= cantidad;
        return 1;
      }else{
        return 0;
      }
    }
    
}

class DataBase {

    constructor(){
      that = this;
      this.catalogo = [];
    }

    getProducts(){
      let productosObjeto= [];
        $.get("productos.json", function(data){
          productosObjeto = data.map(function(value){
            return new Producto(value.producto, value.id, value.categoria, value.precio, value.stock, value.picture);
          })

        });
      $(document).ajaxComplete(function(){
        that.catalogo.push(productosObjeto);//uso that por que sino me toma como objeto lo que pasa el jquery en vez del objeto DataBase
        RenderearCatalogo(productosObjeto);
      })
     

    }

    
}