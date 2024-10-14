import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { DepartamentoI } from '../../modelos/departamento/departamento.interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DepartamentoService } from '../../servicios/departamentoservice/departamento.service';
import { AuthService, CredencialUID } from '../../servicios/authservice/auth.service';
import { Departamento } from '../../modelos/departamento/departamento.class';
import { getApp } from '@angular/fire/app';
import { enviroment } from '../../enviroments/enviroment';
import { Auth } from '@angular/fire/auth'

export interface DepartamentoForm{
  departamento: FormControl<string>;
  titular: FormControl<string>;
  email: FormControl<string>;
  teldirecto: FormControl<string>;
  ext: FormControl<string>;
  extt: FormControl<string>;
  psw: FormControl<string>;
}

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [ MatFormFieldModule,  MatIconModule,
            MatFormField, MatInputModule, MatButtonModule,
            RouterModule, CommonModule,
            ReactiveFormsModule,
          ],
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.scss'
})


export class DepartamentoComponent implements OnInit{
  private authServicio = inject(AuthService);
  private deptoServicio = inject(DepartamentoService);
  private router = inject(Router);

  private auth: Auth = inject(Auth);
  private usuario = this.auth.currentUser;
  private uid: string = '';
  private email!:string;

  iddepto:string = String(this.usuario?.uid);
  correo:string = String(this.usuario?.email);

  private credencial: CredencialUID|any;

  private deptoIfc!: DepartamentoI | any;
  //private depto = inject(Departamento);
  formBuilder = inject(FormBuilder);
  
  /*form: FormGroup = this.formBuilder.group({
    departamento: this.formBuilder.control('',{
      validators: [Validators.required], 
      nonNullable: true,
    }),
  });*/

  form: FormGroup = this.formBuilder.group({
    departamento: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    titular: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: this.formBuilder.control(this.correo, {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    teldirecto: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    ext: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    extt: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    /*psw: this.formBuilder.control('', {
      validators: [Validators.required],
      nonNullable: true,
    }),*/
  });

  constructor(){}

  async ngOnInit(): Promise<void> {
    //const credencialUID = this.usuario?.uid;
    //console.log("UID desde el ngOnInit: ", credencialUID);

    if(this.auth.currentUser?.emailVerified){
      this.router.navigate(['/home']);
    }else{
      console.log("Depto UID: ", this.iddepto);
      console.log("Depto email: ", this.correo);
    }
  }
  async guardar(){
    if(this.form.invalid){
      console.log("Error en el form: ",  this.form.value);
      return;
    }else{
      //this.authServicio.authState$.subscribe((datos)=>{
        //console.log(datos?.email);
      //});
      //this.credencial.email = (await this.authServicio.authStateUsuario()).email;
      //console.log("Obteniendo datos de usuario actual: ", this.credencial);
      this.deptoIfc = this.form.value;
      this.deptoIfc.uid = String(this.iddepto);
      console.log("Registrando en base de datos: ", this.form.value);
      console.log("Depto interface: ", this.deptoIfc);

      this.deptoServicio.addDepto(this.deptoIfc);
      this.authServicio.logOut();
      alert("Antes de acceder al sistema valide su correo electrónico y vuelva a acceder con sus credenciales");
      this.router.navigate(['/']);
    }

  }
}
