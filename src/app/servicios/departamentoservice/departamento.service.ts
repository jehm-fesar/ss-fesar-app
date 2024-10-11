import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartamentoI } from '../../modelos/departamento/departamento.interface';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Auth } from '@angular/fire/auth';
import { enviroment } from '../../enviroments/enviroment';

import { Firestore, collectionData, doc, getDoc, query, updateDoc, where} from '@angular/fire/firestore';
import { Departamento } from '../../modelos/departamento/departamento.class';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private app = initializeApp(enviroment.firebaseConfig);
  private db = getFirestore(this.app);
  
  depto: DepartamentoI|any;
  departamentos!: Observable<DepartamentoI[]>;
  deptoClass!: Departamento|any;

  private titularJyT!: string;
  private idDepto!: string;

  //deptoClass = inject(Departamento);

  constructor() { }

  async getDeptoID(uid:string):Promise<string>{
    return await new Promise(async (resuelve, rechaza)=>{
      try {
        const q = query(collection(this.db, "departamentos"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach((doc)=>{
          this.idDepto = doc.id;
        });
        return await resuelve(this.idDepto);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async addDepto(depto:DepartamentoI):Promise<void>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const docRef = await addDoc(collection(this.db,"departamentos"),depto);
        const actualizaDocRef = doc(this.db, "departamentos", docRef.id);
        await updateDoc(actualizaDocRef,{id:docRef.id})
        console.log("Documento escrito en la base de datos: ",docRef.id);
        return await resuelve();  
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
  async addDeptoo(depto: DepartamentoI): Promise<void>{
    try {
      const docRef = await addDoc(collection(this.db,"departamentos"),depto);
      const nuevoDocRef = doc(this.db, "departamentos", docRef.id);
      await updateDoc(nuevoDocRef,{id:docRef.id})
      console.log("Documento escrito en la base de datos: ",docRef.id);
      
    } catch (error) {
      console.error("Error al añadir el documento: ", error);
    }
  }

  async getDepto(uid:string):Promise<DepartamentoI|any>{
    try {
      const docRef = doc(this.db,"departamentos",uid);
      const docSnap = await getDoc(docRef);
      return await getDoc(docRef);
      if (docSnap.exists()){
        console.log("Datos del documento: ", docSnap.data());
        this.depto = docSnap.data();
      return await this.depto;
      }else{
        console.log("no se encontró el documento");
      }
    } catch (error) {
      console.log("Error en la obteción del documento: ");
    }
  }

  async getDeptoClass(uid:string):Promise<Departamento>{
    try {
      return await new Promise(async (resuelve, rechaza) => {
        const q = query(collection(this.db, "departamentos"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach((doc)=>{
          this.deptoClass = doc.data();
          //console.log("doc.data() ", this.deptoClass)
        });
        return resuelve(this.deptoClass);
      });  
    } catch (error) {
      return await this.deptoClass(error);
    }
  }

  async getTitular(depto:string, coleccion: string):Promise<string>{
    return await new Promise(async (resuelve, rechaza)=>{
      try {
        const q = query(collection(this.db, coleccion), where("departamento", "==", depto));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          this.deptoClass = doc.data();
          this.titularJyT = this.deptoClass.titular;
        });
        return await resuelve(this.titularJyT);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }

  async getDeptos():Promise<any[]>{
    return await new Promise( async (resuelve, rechaza) => {
      try {
        const querySnapshot = await getDocs(collection(this.db, "departamentos"));
        const arreglo: any[] | PromiseLike<any[]> = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          arreglo.push(doc.data());
        });
        return await resuelve(arreglo);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
}
