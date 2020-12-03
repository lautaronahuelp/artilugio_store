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
          that.RenderCatalogo();


        });

      
    }
    
    RenderCatalogo(categoria){
      let productos;
      let cat = {};

      if(categoria != undefined){
        console.log(categoria);
        
        
        console.log(typeof cat)
        Object.defineProperty(cat, categoria,{enumerable: true, writable: true});
        cat[categoria] = categoria;
        productos = that.catalogo.filter( (pr) => {
          return pr.categoria.indexOf(categoria) != -1;
        })
        
        //Limpia Pantalla
        document.getElementsByClassName('container__principal')[0].innerHTML = "";
       
      } else{
        productos = that.catalogo;
        cat = that.categorias;
      }

      console.log(cat)
      for(let ct in cat){
        console.log(ct)
        let section = document.createElement('section');
        section.classList.add('seccion__productos');
        section.classList.add(ct);

        let titulo_cat = document.createElement('h2');
        titulo_cat.innerHTML = ct;
        section.appendChild(titulo_cat);

        let frame_cat = document.createElement('div');
        frame_cat.classList.add('frame');
        section.appendChild(frame_cat);

        let contenedor_cat = document.createElement('div');
        contenedor_cat.classList.add('contenedor');
        frame_cat.appendChild(contenedor_cat);
        
        //reciclando codigo del viejo render
        for (let prod of productos) {
          if( prod.categoria.indexOf(ct) != -1) {
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
            contenedor_cat.appendChild(tarjetaProd);
      }}





        //agrego al body la cosa
        document.getElementsByClassName('container__principal')[0].appendChild(section)
      }
      
    }
        
}
    
    
