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
        carrito.RecibeCanasto(compra);
      } else{
        alert('no hay stock');
      }
    }

    MasInformacion(prod){
      let modal = document.getElementById('modal');

      let container_modal = document.getElementsByClassName('container__modal')[0];
      container_modal.style.display = 'block';

      let body = document.getElementsByTagName('body')[0];
      body.style.overflow = 'hidden';

      modal.style.display = 'block';
      modal.innerHTML =  `<h1>${prod.nombre}</h1>
      <div class="producto__picture">
      <img src="productos/${prod.picture}.jpg" alt="${prod.nombre}" />
      </div>
      `;
      
      let mod_cerrar = document.createElement('button');
      mod_cerrar.classList.add('fas');
      mod_cerrar.classList.add('fa-times-circle');
      mod_cerrar.addEventListener('click', ()=>{
        modal.innerHTML = ``;
        body.style.overflow = 'scroll';
        container_modal.style.display = 'none';
      })
      modal.appendChild(mod_cerrar);
      
      let mod_info_prod = document.createElement('div');
      mod_info_prod.classList.add('producto__info');

      let mod_descr = document.createElement('div');
      mod_descr.innerHTML = `<h2>Descripción</h2>
      <p>${prod.descripcion}</p>`;
      mod_info_prod.appendChild(mod_descr);

      let mod_specs = document.createElement('div');
      mod_specs.innerHTML = `<h2>Especificaciones</h2>`;
      let tb_specs = document.createElement('table');
      for (let sp in prod.especificaciones){
        if (prod.especificaciones[sp] != null && prod.especificaciones[sp] != ''){
          let tr_specs = document.createElement('tr');
          let td_specs_name = document.createElement('td');
          td_specs_name.innerHTML = `${sp}:`;
          tr_specs.appendChild(td_specs_name);
          let td_specs_value = document.createElement('td');
          td_specs_value.innerHTML = prod.especificaciones[sp];
          tr_specs.appendChild(td_specs_value);
          tb_specs.appendChild(tr_specs);
          mod_specs.appendChild(tb_specs);
        }
      }
      mod_info_prod.appendChild(mod_specs);
      modal.appendChild(mod_info_prod);
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
        section.id = ct;
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
            pic_producto.innerHTML = `<img src="productos/${prod.picture}.jpg" alt="${prod.nombre}">`;
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
            

            if(ct == 'promociones'){
              let pre_anterior = document.createElement('div');
              pre_anterior.classList.add('producto__precioanterior');
              pre_producto.classList.add('producto__precio--promo');
              pre_anterior.innerHTML = `<span>$${prod['precio_ant']}</span>`;
              tarjetaProd.appendChild(pre_anterior);
            }

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
        //let gradiente = document.createElement('div');
        //gradiente.classList.add('gradiente');
        //section.appendChild(gradiente);

        //GRADIENTES
      let gradiente_r = document.createElement('div');
      
      gradiente_r.classList.add('gradiente');
      gradiente_r.classList.add('gradiente__r');
      section.appendChild(gradiente_r);
      let flecha_r = document.createElement('div');
      flecha_r.classList.add('fas');
      flecha_r.classList.add('fa-angle-right');
      gradiente_r.appendChild(flecha_r);

      let gradiente_l = document.createElement('div');
  
      gradiente_l.classList.add('gradiente');
      gradiente_l.classList.add('gradiente__l');
      section.appendChild(gradiente_l);
      let flecha_l = document.createElement('div');
      flecha_l.classList.add('fas');
      flecha_l.classList.add('fa-angle-left');
      gradiente_l.appendChild(flecha_l);
        


        //agrego al body la cosa
        document.getElementsByClassName('container__principal')[0].appendChild(section)
      }
      ActivaScroll();
    }

    RenderMenu(){

      let div_lista_menu = document.createElement('div');
      div_lista_menu.id = 'menu_div';

      let lista_menu = document.createElement('ul');
      lista_menu.id = 'menu_lis';
      lista_menu.classList.add('encabezado');
      lista_menu.classList.add('encabezado__menu');
      lista_menu.classList.add('encabezado__menu--lista');
      for(let ct in that.categorias){
        if(ct != 'destacados' && ct != 'promociones'){
          let item_menu = document.createElement('li');
          item_menu.innerHTML = ct;
          lista_menu.appendChild(item_menu);

          item_menu.addEventListener('click', ()=>{
            that.RenderCatalogo(ct);
          })
        }

      }

      let div_menu = document.getElementById('menu');
      div_lista_menu.appendChild(lista_menu);
      div_menu.appendChild(div_lista_menu);


      //GRADIENTES
      let gradiente_r = document.createElement('div');
      
      gradiente_r.classList.add('gradiente');
      gradiente_r.classList.add('gradiente__r');
      div_menu.appendChild(gradiente_r);
      let flecha_r = document.createElement('div');
      flecha_r.classList.add('fas');
      flecha_r.classList.add('fa-angle-right');
      gradiente_r.appendChild(flecha_r);

      let gradiente_l = document.createElement('div');
  
      gradiente_l.classList.add('gradiente');
      gradiente_l.classList.add('gradiente__l');
      div_menu.appendChild(gradiente_l);
      let flecha_l = document.createElement('div');
      flecha_l.classList.add('fas');
      flecha_l.classList.add('fa-angle-left');
      gradiente_l.appendChild(flecha_l);
    }
        
}
    
    
