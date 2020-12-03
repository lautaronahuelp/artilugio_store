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
      this.catalogo;
      this.categorias;
    }

    GetData(){
        $.get("productos.json", function(data){
          that.catalogo = data[0]["catalogo"].map(function(value){
            return new Producto(value.producto, value.id, value.categoria, value.precio, value.stock, value.picture);
          })

          that.categorias = data[0]["categorias"][0];
          //that.RenderCatalogo();
          RenderearCatalogo(that.catalogo);


        });
    }
    
    
}