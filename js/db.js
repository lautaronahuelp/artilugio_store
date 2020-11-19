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
    getProducts(){
        $.get("productos.json", function(data){
          let productos = data.map(function(value){
            return new Producto(value.producto, value.id, value.categoria, value.precio, value.stock, value.picture);
          })
        
          RenderearCatalogo(productos);
        });
    }

    
}