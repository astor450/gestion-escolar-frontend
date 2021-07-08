import { createApp } from "vue";
import { createStore } from 'vuex';
import App from "./App.vue";
import router from "./router";
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'

export const api_url = 'https://apicolmor.khadline.shop'
// export const api_url = 'http://localhost:5000'
export const curpValida = function(curp) {
    const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0\d|1[0-2])(?:[0-2]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
    validado = curp.match(re);

    if (!validado)  //Coincide con el formato general?
        return false;

    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17) {
      //Fuente https://consultas.curp.gob.mx/CurpSP/
      let diccionario  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
          lngSuma      = 0.0,
          lngDigito    = 0.0;
      for(var i=0; i<17; i++)
          lngSuma= lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      lngDigito = 10 - lngSuma % 10;
      if(lngDigito == 10)
          return 0;
      return lngDigito;
    }
    if (validado[2] != digitoVerificador(validado[1])) 
        return false;
      
      return true; //Validado
}


export const store = createStore({
    state() {
        return {
            aspirante: {
                curp: '',
                uid: ''
            },
            user: {
                token: localStorage.getItem('token'),
                name: localStorage.getItem('uname')
            },
            administrador: {
              correo: '',
              uid: ''
            }
        }
    },
    mutations: {
      login (state, token){
        state.user.token = token,
        localStorage.setItem('token', token)
      },
      logout (state){
        state.aspirante = {
          curp: '',
          uid: ''
        }
        state.user = {
          token: '',
          name: ''
        }
        state.administrador = {
          correo: '',
          uid: ''
        }
        localStorage.removeItem('token')
        localStorage.removeItem('uname')
        localStorage.removeItem('correo')
        // M.toast({ html: 'Sesión terminada correctamente', classes: 'green darken-2' })
        location.reload()
      },
      setAspiranteInfo (state, aspirante){
        state.aspirante = aspirante
        state.user.name = aspirante.curp
        localStorage.setItem('uname', aspirante.curp)
      },
      setAdminInfo(state, administrador){
        state.administrador = administrador,
        localStorage.setItem('uname', administrador.uname)
        localStorage.setItem('correo', administrador.correo)
      }
    }
  });

  export const correoValido = function(correo){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(correo).toLowerCase());
  }
  export const periodoValido = function(entrada){
    const re = /\d{4}-\d/g;
    return re.test(String(entrada).toLowerCase())
  }
createApp(App).use(store).use(router).mount("#app");