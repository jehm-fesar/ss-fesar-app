import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs,getDoc,query, where } from "firebase/firestore";
import { enviroment } from '../enviroments/enviroment';
import { SolicitudSTI } from '../modelos/sst/solicitudesst.interface';
import { stringify } from 'node:querystring';
import { doc, docData, updateDoc } from '@angular/fire/firestore';
import { SolicitudSTClass } from '../modelos/sst/solicitudesst.class';
import { SolicitudSCPI } from '../modelos/sscp/sscpi.interface';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private app = initializeApp(enviroment.firebaseConfig);
  private db = getFirestore(this.app);
  private folio!: String|any;
  private sst: SolicitudSTI|any;
  private scp: SolicitudSCPI|any;
  private ss: SolicitudSTI|SolicitudSCPI|any;
  private ssts: SolicitudSTI[] | any;
  private sstsClass!: SolicitudSTClass[]|any[];

  constructor() { }

  editarSST(){}

  async getFolioSCP():Promise<String>{
    return await new Promise(async (resuelve,rechaza)=>{
      try {
        const querySnapshot = await getDocs(collection(this.db, "sscp"));
        return await String(querySnapshot.size+1);        
      } catch (error) {
        return await rechaza(error);
      }
    });  
  }

  async addDocccc(sst: SolicitudSTI):Promise<void>{
    await addDoc(collection(this.db, "st"),sst);
    console.log("Documento creado!!!")
  }

  async addDoc(sst:SolicitudSTI): Promise<void>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = addDoc(collection(this.db, "st"), sst);
        const actualizaDoc = doc(this.db,"st", (await docRef).id);
        updateDoc(actualizaDoc,{id:(await docRef).id});
        return await resuelve();
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async addDocumento(ss: SolicitudSTI|SolicitudSCPI, tipoServicio: string):Promise<void>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = await addDoc(collection(this.db, tipoServicio), ss);
        const actualizaDoc = doc(this.db, tipoServicio, docRef.id);
        await updateDoc(actualizaDoc,{id: await docRef.id});
        console.log("servicios: ", docRef.id);
        return await resuelve();
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async addDocumentoClass(ss: any, tipoServicio: string):Promise<any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = await addDoc(collection(this.db, tipoServicio), ss);
        const actualizaDoc = doc(this.db, tipoServicio, docRef.id);
        await updateDoc(actualizaDoc,{id: await docRef.id});
        console.log("servicios: ", docRef.id);
        return await resuelve(this.scp);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async addDocReturnID(ss:any, tipoServicio:string):Promise<string>{
    return await new Promise( async (resuelve, rechaza) => {
      try {
        const docRef = await addDoc(collection(this.db, tipoServicio), ss);
        const actualizaDoc = doc(this.db, tipoServicio, docRef.id);
        await updateDoc(actualizaDoc,{id: await docRef.id});
        return await resuelve(docRef.id);
      } catch (error) {
        return rechaza(error);
      }
    });
  }

/*
  async addDocc(sst:SolicitudSTI):Promise<any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = addDoc(collection(this.db,"st"),sst);
        sst.id = (await docRef).id;
        return await resuelve(docRef);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
*/
  async getSSTbyId(id:string):Promise<any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = doc(this.db, "st", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.sst = docSnap.data();
        } else {
          console.log("No such document!");
        }
        return await resuelve(this.sst);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async getSSbyId(id:string, servicio: string):Promise<any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = doc(this.db, servicio, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.ss = docSnap.data();
        } else {
          console.log("No such document!");
        }
        return await resuelve(this.ss);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async getFolio(tipoServicio: string):Promise<string>{
    return new Promise( async (resuelve, rechaza)=>{
      try {
        this.folio = String((await getDocs(collection(this.db,tipoServicio))).size+1);
        return await resuelve (this.folio);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
  /*
  async getFolioST():Promise<string|any>{
    return new Promise( async (resuelve, rechaza)=>{
      try {
        this.folio = String((await getDocs(collection(this.db,"st"))).size+1);
        return await resuelve (this.folio);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
*/
  async getAllSTs():Promise<any[]>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const querySnapshot = await getDocs(collection(this.db, "st"));
        const arreglo: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          //this.ssts = doc.data();
          arreglo.push(doc.data());
        });
        return resuelve(arreglo);
      } catch (error) {
        return rechaza(error);
      }
    });
  }

  async getAllSTsByIdDepto(uid:string, servicio:string):Promise<any[]>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const q = query(collection(this.db, servicio), where("departamento_id", "==", uid));
        const querySnapshot = await getDocs(q);
        const arreglo: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          arreglo.push(doc.data());
          //console.log("doc: ", doc.data());
        });
        return await resuelve(arreglo);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async getAllSSbyIdDepto(uid:string, servicio:string):Promise<any[]>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const q = query(collection(this.db, servicio), where("departamento_id", "==", uid));
        const querySnapshot = await getDocs(q);
        const arreglo: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          arreglo.push(doc.data());
          //console.log("doc: ", doc.data());
        });
        return await resuelve(arreglo);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async getSSbyFolio(folio:string, servicio:string):Promise<any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const respuesta = query(collection(this.db,servicio), where("folio", "==", folio));
        const querySnapShot = await getDocs(respuesta);
        querySnapShot.forEach((doc)=>{
          this.sst=doc.data();
        });
        return await resuelve(this.sst);
      } catch (error) {
        
      }
    });
  }

  async getAllSS(servicio:string):Promise<any[]>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const querySnapshot = await getDocs(collection(this.db, servicio));
        const arreglo: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          //this.ssts = doc.data();
          arreglo.push(doc.data());
        });
        return resuelve(arreglo);
      } catch (error) {
        return rechaza(error);
      }
    });
  }

  async getIDofSS():Promise<SolicitudSCPI>{
    
    return await new Promise( async ( resuelve, rechaza)=>{
      try {
      } catch (error) {
      
      }
    });
  }
}
