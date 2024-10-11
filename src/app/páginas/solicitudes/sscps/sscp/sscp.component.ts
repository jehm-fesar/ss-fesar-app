import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { enviroment } from '../../../../enviroments/enviroment';
import { Departamento } from '../../../../modelos/departamento/departamento.class';
import { SolicitudSCPI } from '../../../../modelos/sscp/sscpi.interface';
import { AuthService, CredentialUID } from '../../../../servicios/authservice/auth.service';
import { ValidarFechas } from '../../../../servicios/validarFechas';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { GenerarPDFService } from '../../../../servicios/generar-pdf.service';
import { DepartamentoService } from '../../../../servicios/departamentoservice/departamento.service';

@Component({
  selector: 'app-sscp',
  standalone: true,
  imports: [
    MatCommonModule, MatCommonModule, MatFormFieldModule,
    ReactiveFormsModule, CommonModule, MatIconModule, MatInputModule,
    MatNativeDateModule, MatDatepickerModule, MatSelectModule,
    MatRadioModule, MatButtonModule
  ],
  templateUrl: './sscp.component.html',
  styleUrl: './sscp.component.scss'
})

export class SscpComponent implements OnInit{
  private app = initializeApp(enviroment.firebaseConfig);
  private auth = getAuth(this.app);

  private authServicio = inject(AuthService);
  private servicios = inject(ServiciosService);
  private deptoServicios = inject(DepartamentoService);
  private credencialUsuarioActual!: CredentialUID;

  formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    folio: this.formBuilder.control(''),
    
    remitente: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    destinatario: this.formBuilder.control('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    destino: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    entrega: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    tCorrespondencia: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    cantidad: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    formaEnvio: this.formBuilder.control('', {
      validators: [],
      nonNullable: true,
    }),
    tEnvio: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    anexo: this.formBuilder.control('',{
      validators:[Validators.required],
      nonNullable: true,
    }),
    infAd: this.formBuilder.control('',{
      validators:[],
      nonNullable: true,
    }),
  });

  private folio!: string;
  private ssc!: SolicitudSCPI;
  private deptoSolicitante!: Departamento;
  private deptoEjecutante!: Departamento;

  constructor(private router: Router){ }

  async ngOnInit():Promise<void>{
    //return await new Promise( async (resuelve, rechaza)=>{
      //try {
        this.credencialUsuarioActual = await this.authServicio.estadoUsuarioActual();
        //this.folio = await this.servicios.getFolio("scp");
        console.log("folio: ", this.folio);
        this.deptoSolicitante = await this.deptoServicios.getDeptoClass(this.credencialUsuarioActual.uid);
        //return await resuelve();
      //} catch (error) {
        //return await rechaza(error);
      //}
    //});
  }

  async guardar():Promise<void>{
    if(this.form.value.id==''||this.form.value.id==null||
      this.form.value==undefined){
      var entrega = Date.parse(this.form.value.entrega);
      this.form.value.entrega = ValidarFechas.fechaToString(new Date(entrega));

      this.form.value.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
      
      this.folio = await this.servicios.getFolio("scp");
      console.log("guardar()=>folio: ", this.folio);
      
      this.ssc = this.form.value;
      this.ssc.departamento_id = this.credencialUsuarioActual.uid;
      this.ssc.folio = this.folio;
      
      //console.log("Solicitud: ", this.ssc);
      this.formatearFechas();
      this.ssc.departamento_id = this.deptoSolicitante.uid;

      if(await this.validar(this.ssc)){
        //this.folio = await this.scServicio.getSSCNumeroFolioSiguiente_async();
        this.ssc.folio = this.folio;
        //await this.servicios.addDocumentoClass(this.ssc,"scp");
        this.ssc.id = await this.servicios.addDocReturnID(this.ssc,"scp");
        console.log("Solicitud: ", this.ssc);
        //await this.servicios.addDocumento(this.ssc,"scp");
        alert("Registro guardado, verificar!!!");
        GenerarPDFService.generaPDF_SC(this.ssc,this.deptoSolicitante,Number(this.ssc.folio),String(this.ssc.id));
        this.router.navigate(["solicitudes/allscp"]);
        
      }else{
        alert("Algo sucedió mal");
      }
    }else{
      //console.log("guardar() ELSE this.servicios.selectedST: ", this.servicios.selectedST);
      //console.log("guardar() ELSE this.formularioSST.value: ", this.formularioSST.value);
      
      this.formatearFechas();
      
      if (await this.validar(this.ssc)){
        if(this.ssc.folio!=null || this.ssc.folio!="" 
            && (this.deptoSolicitante.uid!=null || this.deptoSolicitante.uid!=undefined)){
          //console.log("Proceder a actualizar la solicitud !!!", this.ssci);
          //console.log("del Departamento !!!", this.deptoSesion);
          await this.servicios.addDocumento(this.ssc,"scp");
          alert("Registro actualizado, verificar!!!");
          GenerarPDFService.generaPDF_SC(this.ssc,this.deptoSolicitante,Number(this.ssc.folio),this.ssc.id);
          this.limpiarForm();
          
        }else{
          alert("Fechas no válidas!!!");
        }
      }
    }
    this.close();
  }

  async validar(ssc: SolicitudSCPI):Promise<boolean>{
    const vf: ValidarFechas = new ValidarFechas(this.ssc.entrega, this.ssc.entrega, this.ssc.fechaSol);
    if (await vf.validarFechas_SCP()){
      alert("Fecha de entrega válida");
      return await true;
    }else{
      alert("No se puede validar la fecha de entrega: Registrar al menos 1 día antes para la entrega. Favor de cancelar Solicitud o modificar fecha");
      return await false;
    }
  }

  formatearFechas(){}

  
  close(){}
  limpiarForm(){}

}
