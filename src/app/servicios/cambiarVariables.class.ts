import { Departamento } from "../modelos/departamento/departamento.class";

export class CambiarVariables{
    static async cambiarDepartamento_id_x_Departamento(arrSs: any[], deptos: Departamento[]):Promise<any[]>{
        return new Promise( async (resuelve,rechaza) =>{
          try {
            for( var i=0; i< arrSs.length; i++){
              for(var j = 0; j<deptos.length; j++){
                if (arrSs[i].departamento_id == deptos[j].uid){
                  arrSs[i].departamento_id = deptos[j].departamento;
                }
              }
            }
            return await resuelve(arrSs);
          } catch (error: any) {
            rechaza(error.message);
          }
        });
      }
    
      static async cambiarDepartamento_x_Departamento_id(arrSs: any[], deptos: Departamento[]):Promise<any[]>{
        return await new Promise( async (resuelve, rechaza) => {
          try {
            for( var i=0; i< arrSs.length; i++){
              for(var j = 0; j<deptos.length; j++){
                if (arrSs[i].departamento_id == deptos[j].departamento){
                  arrSs[i].departamento_id = deptos[j].uid;
                }
              }
            }
            return await resuelve(arrSs)
          } catch (error) {
            return await rechaza(error);
          }
        });
      }
}