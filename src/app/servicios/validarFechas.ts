export class ValidarFechas{
    MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    diferencia: number;
    diadelasemana: string;
    
    salida: Date;
    regreso: Date;
    fechasol: Date;

    dateSalida: any;
    dateRegreso: any;
    dateSolicitud: any;

    constructor(salida: string, regreso: string, fechasol: string){
      this.salida = new Date(salida);
      this.regreso = new Date(salida);
      this.fechasol = new Date(fechasol);

      this.dateSalida = Date.UTC(this.salida.getFullYear(), this.salida.getMonth(), this.salida.getDate());
      this.dateRegreso = Date.UTC(this.regreso.getFullYear(), this.regreso.getMonth(), this.regreso.getDate());
      this.dateSolicitud = Date.UTC(this.fechasol.getFullYear(), this.fechasol.getMonth(), this.fechasol.getDate());
    
      var dias=["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
      var diferencia = Math.floor((this.dateSalida - this.dateSolicitud) / this.MILISEGUNDOS_POR_DIA)+1;
      this.diferencia = diferencia;
    
      var validar = dias[this.salida.getUTCDay()];
      this.diadelasemana = validar;
    }

    getDiferencia(){ return this.diferencia; }
    getDiaDeLaSemana(){ return this.diadelasemana; }
    getSalida(){ return this.salida; }
    
    validarFechas():boolean{
      if (this.diferencia>2 && this.dateRegreso>=this.dateSalida){
        if (this.diadelasemana!="Domingo" && this.diadelasemana!="Sábado"){
          return true;
        }else{
          return false;
        }
      }
      return false;
    }

    async validarFechas_SCP():Promise<boolean>{
      return await new Promise( async(resuelve, rechaza)=>{
        try {
          if(this.diferencia>=2 && this.dateRegreso>=this.dateSalida){
            if(this.diadelasemana!="Domingo" && this.diadelasemana!="Sábado"){
              return resuelve(true);
            }
          }
        } catch (error) {
          return await rechaza(false);
        }
      });
    }

    static parseDateToStringWithFormat(date: Date): string {
      let result: string;
      let dd = date.getDate().toString();
      let mm = (date.getMonth() + 1).toString();
      let hh = date.getHours().toString();
      let min = date.getMinutes().toString();
      let ss = date.getSeconds().toString();
      dd = dd.length === 2 ? dd : "0" + dd;
      mm = mm.length === 2 ? mm : "0" + mm;
      hh = hh.length === 2 ? hh : "0" + hh;
      min = min.length === 2 ? min : "0" + min;
      ss = ss.length === 2 ? ss : "0" + ss;
        
      result = [date.getFullYear(), '-', mm, '-', dd, ' ', hh, ':', min, ':',ss].join('');
    
      return result;
    }

    static fechaToString(date: Date): string{
      let result: string;
      let dd = date.getDate().toString();
      let mm = (date.getMonth() + 1).toString();
      dd = dd.length === 2 ? dd : "0" + dd;
      mm = mm.length === 2 ? mm : "0" + mm;
      
      result = [date.getFullYear(), '-', mm, '-', dd].join('');
    
      return result;
    }

    static fechaMostlaToString(date: Date){
      let result: string;
      let dd = (date.getDate()+1).toString();
      let mm = (date.getMonth() + 1).toString();
      dd = dd.length === 2 ? dd : "0" + dd;
      mm = mm.length === 2 ? mm : "0" + mm;
      
      result = [date.getFullYear(), '-', mm, '-', dd].join('');
    
      return result;
    }
    
    static fechaToStringSC(date: Date): string{
      let result: string;
      let dd = date.getDate().toString();
      let mm = (date.getMonth() + 1).toString();
      dd = dd.length === 2 ? dd : "0" + dd;
      mm = mm.length === 2 ? mm : "0" + mm;
      
      result = [date.getFullYear(), '-', mm, '-', dd].join();
    
      return result;
    }

    static convertirFechaToMatPicker(fecha: string): string{
      let parseDate = Date.parse(fecha);
      let date = new Date(parseDate);
      let result: string;
      
      let dd = (date.getDate() + 2).toString();
      let mm = (date.getMonth() + 1).toString();
      
      dd = dd.length === 2 ? dd : "0" + dd;
      mm = mm.length === 2 ? mm : "0" + mm;
        
      result = [date.getFullYear(), '-', mm, '-', dd].join('');
    
      return result;
    }
    
}