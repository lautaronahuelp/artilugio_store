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
        let productsAsObjects = JSON.parse(DATA);
        let productos = productsAsObjects.map(function(value){
            return new Producto(value.producto, value.id, value.categoria, value.precio, value.stock, value.picture);
        })
        
        return productos;
    }
}

const DATA = `[{
    "producto":"Parlante Bluetooth JBL Flip 4",
    "id": 1,
    "categoria":"audio",
    "precio": 12000,
    "stock": 20,
    "picture":"jbl-flip-5-00001"

},
{
    "producto":"Cable HDMI Foxbox FlatHDMI",
    "id": 2,
    "categoria":"cables",
    "precio": 260,
    "stock": 20,
    "picture":"foxbox-flat-hdmi-00002"

},
{
    "producto":"Cable USB C Foxbox Prism",
    "id": 3,
    "categoria":"cables",
    "precio": 700,
    "stock": 20,
    "picture":"foxbox-cable-usb-c-00003"

},
{
    "producto":"Auriculares Philips ActionFit SHQ2300",
    "id": 4,
    "categoria":"audio",
    "precio": 3500,
    "stock": 20,
    "picture":"philips-auriculares-shq2300-00004"

},
{
    "producto":"Cargador de pared Foxbox Volt",
    "id": 5,
    "categoria":"cargadores",
    "precio": 699,
    "stock": 20,
    "picture":"foxbox-cargador-quickcharge-00005"

},
{
    "producto":"Micro SD Sandisk Ultra 128gb",
    "id": 6,
    "categoria":"memorias",
    "precio": 2500,
    "stock": 20,
    "picture":"sandisk-memoria-ultra-128gb-00006"
}]`;