var self;//**correccion para que metodo Canasta.LimpiaCanasto funcione ok (el addEventListener hacía que el this fuera el objeto html button) scope superior.
var that; //correccion similar para que ajaxComplete pushee los productos en la propiedad catalogo del objeto DataBase

class Producto{
  
    constructor(nombre, id, categoria, descripcion, espec, precio, precio_ant, keywords, stock, picture){
        this.nombre = nombre;
        this.id = id;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.especificaciones = espec;
        this.precio = precio;
        this.precio_ant = precio_ant;
        this.keywords = keywords;
        this.stock = stock;
        this.picture = picture;
      
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

    MasInformacion(prod){
      console.log(prod);
      let modal = document.getElementById('modal');
      let container_modal = document.getElementsByClassName('container__modal')[0];
      container_modal.style.display = 'block';
      modal.style.display = 'block';
      //modal.innerHTML = `<span>${JSON.stringify(prod)}</span>`;
      modal.innerHTML =  `<h4>${prod.nombre}</h4>
      <div class="producto__picture">
      <img src="productos/${prod.picture}.jpg" alt="${prod.nombre}" />
      </div>
      <p>${prod.descripcion}</p>`;
      
      let mod_cerrar = document.createElement('button');
      mod_cerrar.classList.add('fas');
      mod_cerrar.classList.add('fa-times-circle');
      mod_cerrar.addEventListener('click', ()=>{
        modal.innerHTML = ``;
        
        container_modal.style.display = 'none';
      })

      modal.appendChild(mod_cerrar);

      let mod_specs = document.createElement('table');
      for (let sp in prod.especificaciones){
        if (prod.especificaciones[sp] != null && prod.especificaciones[sp] != ''){
          let tr_specs = document.createElement('tr');
          let td_specs_name = document.createElement('td');
          td_specs_name.innerHTML = sp;
          tr_specs.appendChild(td_specs_name);
          let td_specs_value = document.createElement('td');
          td_specs_value.innerHTML = prod.especificaciones[sp];
          tr_specs.appendChild(td_specs_value);
          mod_specs.appendChild(tr_specs);
          modal.appendChild(mod_specs);
        }
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
            return new Producto(value.producto, value.id, value.categoria, value.descripcion, value.especificaciones, value.precio, value.precio_anterior, value.keywords, value.stock, value.picture);
          })

          that.categorias = data[0]["categorias"][0];
          that.RenderCatalogo();
          that.RenderMenu();

        });

      
    }
    
    RenderCatalogo(categoria){
      let productos;
      let cat = {};

      //Limpia Pantalla
      document.getElementsByClassName('container__principal')[0].innerHTML = "";
      if(categoria != undefined){
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


      for(let ct in cat){

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
          
          
          
            let tit_producto = document.createElement('h4');
            tit_producto.innerHTML = prod.nombre;
            tarjetaProd.appendChild(tit_producto);

            let pic_producto = document.createElement('div');
            pic_producto.classList.add('producto__picture');
            pic_producto.innerHTML = `<img src="productos/${prod.picture}.jpg" alt="${prod.nombre}">}`;
            tarjetaProd.appendChild(pic_producto);

            let cat_producto = document.createElement('div');
            cat_producto.classList.add('producto__categoria');
            cat_producto.classList.add('tooltip');
            cat_producto.innerHTML = `<span class="icono ${categoria_para_fa}"></span>
            <span class="tooltiptext">${prod.categoria[0]}</span>`;
            tarjetaProd.appendChild(cat_producto);

            let pre_producto = document.createElement('div');
            pre_producto.classList.add('producto__precio');
            pre_producto.innerHTML = `<span>$${prod['precio']}</span>`;
            tarjetaProd.appendChild(pre_producto);

            tit_producto.addEventListener('click', ()=>{
              prod.MasInformacion(prod);
            })
            pic_producto.addEventListener('click', ()=>{
              prod.MasInformacion(prod);
            })

          

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
            


              boton.innerHTML = 'Se agregó al canasto!';
              setTimeout(() => boton.innerHTML = 'Agregar otro al canasto', 1400)
            





            })
            


            tarjetaProd.appendChild(caja);      
            contenedor_cat.appendChild(tarjetaProd);

            
          }
          
        }

        //GRADIENTE
        let gradiente = document.createElement('div');
        gradiente.classList.add('gradiente');
        section.appendChild(gradiente);
        


        //agrego al body la cosa
        document.getElementsByClassName('container__principal')[0].appendChild(section)
      }
      
    }

    RenderMenu(){
      let lista_menu = document.createElement('ul');
      lista_menu.classList.add('encabezado');
      lista_menu.classList.add('encabezado__menu');
      lista_menu.classList.add('encabezado__menu--lista');
      for(let ct in that.categorias){
        let item_menu = document.createElement('li');
        item_menu.innerHTML = ct;
        lista_menu.appendChild(item_menu);

        item_menu.addEventListener('click', ()=>{
          that.RenderCatalogo(ct);
        })

      }

      let div_menu = document.getElementById('menu');
      div_menu.appendChild(lista_menu);

      let encabezado = document.getElementsByClassName('encabezado')[0];

      //GRADIENTE
      let gradiente = document.createElement('div');
      gradiente.classList.add('gradiente');
      encabezado.appendChild(gradiente);
    }
        
}
    
    
