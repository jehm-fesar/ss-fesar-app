import { Injectable, inject } from '@angular/core';
import { Auth, 
        authState, 
        createUserWithEmailAndPassword, 
        sendEmailVerification, 
        signInWithEmailAndPassword, 
        UserCredential, 
        AuthProvider, 
        onAuthStateChanged} from '@angular/fire/auth';
//import { getAuth } from 'firebase/auth';

export interface Credencial{
  email: string;
  psw: string;
}

export interface CredencialUID extends Credencial{
  uid: string;
  //displayName: string;
}

export interface CredentialUID{
  uid:string;
  email:string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private auth: Auth = inject(Auth);
  //private usuario = this.auth.currentUser;

  readonly authState$ = authState(this.auth);

  private credencial!: CredencialUID|any;
  private credentialUID!: CredentialUID;

  signUpWithEmailAndPassword(credencial: Credencial):Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.auth, 
      credencial.email, credencial.psw);
  }

  async logInWithEmailAndPassword(credencial: Credencial):Promise<UserCredential>{
    return await signInWithEmailAndPassword(
      this.auth,
      credencial.email,
      credencial.psw
    );
  }

  logOut():Promise<void>{
    return this.auth.signOut();
  }

  mandarCorreoDeVErificacion(){
    
  }

  async authStateUsuario():Promise<CredencialUID>{
    try {
      await onAuthStateChanged(this.auth, (usuario)=>{
        if(usuario){
          this.credencial.email = usuario.email;
          this.credencial.psw = '';
          this.credencial.uid = usuario.uid;
          return this.credencial;
        }else{

        }
      });
    } catch (error) {
      
    }
    return this.credencial; 
  }

  async estadoUsuarioActual():Promise<CredentialUID|any>{
    return await new Promise( async (resuelve, rechaza)=>{
      try {
        const credentialUID: any | PromiseLike<CredentialUID> = {};
        onAuthStateChanged(this.auth, (usuario) => {
          if (usuario) {
            credentialUID.email = usuario.email;
            credentialUID.uid = usuario.uid;
          }
        });
        return await resuelve(credentialUID);
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
}
