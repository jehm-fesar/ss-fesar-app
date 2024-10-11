import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio'
import { Route, Router} from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Horas } from '../../../../modelos/horas.class';
import { DepartamentoService } from '../../../../servicios/departamentoservice/departamento.service';
import { DepartamentoI } from '../../../../modelos/departamento/departamento.interface';
import { Departamento } from '../../../../modelos/departamento/departamento.class';
import { enviroment } from '../../../../enviroments/enviroment';
import { query, setDoc, where } from '@angular/fire/firestore';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { ValidarFechas } from '../../../../servicios/validarFechas';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { SolicitudSTI } from '../../../../modelos/sst/solicitudesst.interface';
import { MatDialogRef,MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenerarPDFService } from '../../../../servicios/generar-pdf.service';

@Component({
  selector: 'app-sst',
  standalone: true,
  imports: [MatCommonModule,  MatFormFieldModule,
    ReactiveFormsModule, CommonModule, MatIconModule, MatInputModule,
    MatNativeDateModule, MatDatepickerModule, MatSelectModule,
    MatRadioModule, MatButtonModule
  ],
  templateUrl: './sst.component.html',
  styleUrl: './sst.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SstComponent implements OnInit{
  //private router = inject(Router);

  private auth: Auth = inject(Auth);
  private usuario = this.auth.currentUser;

  private app = initializeApp(enviroment.firebaseConfig);
  private db = getFirestore(this.app);
  
  private sst: SolicitudSTI|any;
  
  private uidString!: string;
  private folioo!:string;

  private servicios = inject(ServiciosService);
  private deptoServicios = inject(DepartamentoService);

  private deptoActual!: DepartamentoI|any;

  private deptoClass: Departamento|any;

  private fecha!: string;

  formBuilder = inject(FormBuilder);

  horas: Horas[]=[    
    { value: '07:00', viewValue: '07:00'},
    { value: '07:15', viewValue: '07:15'},
    { value: '07:30', viewValue: '07:30'},
    { value: '07:45', viewValue: '07:45'},
    { value: '08:00', viewValue: '08:00'},
    { value: '08:15', viewValue: '08:15'},
    { value: '08:30', viewValue: '08:30'},
    { value: '08:45', viewValue: '08:45'},
    { value: '09:00', viewValue: '09:00'},
    { value: '09:15', viewValue: '09:15'},
    { value: '09:30', viewValue: '09:30'},
    { value: '09:45', viewValue: '09:45'},
    { value: '10:00', viewValue: '10:00'},
    { value: '10:15', viewValue: '10:15'},
    { value: '10:30', viewValue: '10:30'},
    { value: '10:45', viewValue: '10:45'},
    { value: '11:00', viewValue: '11:00'},
    { value: '11:15', viewValue: '11:15'},
    { value: '11:30', viewValue: '11:30'},
    { value: '11:45', viewValue: '11:45'},
    { value: '12:00', viewValue: '12:00'},
    { value: '12:15', viewValue: '12:15'},
    { value: '12:30', viewValue: '12:30'},
    { value: '12:45', viewValue: '12:45'},
    { value: '13:00', viewValue: '13:00'},
    { value: '13:15', viewValue: '13:15'},
    { value: '13:30', viewValue: '13:30'},
    { value: '13:45', viewValue: '13:45'},
    { value: '14:00', viewValue: '14:00'},
    { value: '14:15', viewValue: '14:15'},
    { value: '14:30', viewValue: '14:30'},
    { value: '14:45', viewValue: '14:45'},
    { value: '15:00', viewValue: '15:00'},
    { value: '15:15', viewValue: '15:15'},
    { value: '15:30', viewValue: '15:30'},
    { value: '15:45', viewValue: '15:45'},
    { value: '16:00', viewValue: '16:00'},
    { value: '16:15', viewValue: '16:15'},
    { value: '16:30', viewValue: '16:30'},
    { value: '16:45', viewValue: '16:45'},
    { value: '17:00', viewValue: '17:00'},
    { value: '17:15', viewValue: '17:15'},
    { value: '17:30', viewValue: '17:30'},
    { value: '17:45', viewValue: '17:45'},
    { value: '18:00', viewValue: '18:00'},
    { value: '18:15', viewValue: '18:15'},
    { value: '18:30', viewValue: '18:30'},
    { value: '18:45', viewValue: '18:45'},
    { value: '19:00', viewValue: '19:00'},
    { value: '19:15', viewValue: '19:15'},
    { value: '19:30', viewValue: '19:30'},
    { value: '19:45', viewValue: '19:45'},
    { value: '20:00', viewValue: '20:00'},
    { value: '20:15', viewValue: '20:15'},
    { value: '20:30', viewValue: '20:30'},
    { value: '20:45', viewValue: '20:45'},
    { value: '21:00', viewValue: '21:00'},
    { value: '21:15', viewValue: '21:15'},
    { value: '21:30', viewValue: '21:30'},
    { value: '21:45', viewValue: '21:45'},
  ];

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    folio: this.formBuilder.control(''),
    destino: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    pasajeros: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    nPasajeros: this.formBuilder.control('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    salidaSt: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    horaS: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    regresoSt: this.formBuilder.control('',{
      validators: [],
      nonNullable: true,
    }),
    horaR: this.formBuilder.control('', {
      validators: [],
      nonNullable: true,
    }),
    tServicio: this.formBuilder.control('',{
      validators: [Validators.required],
      nonNullable: true,
    }),
    tTansporte: this.formBuilder.control('',{
      validators:[Validators.required],
      nonNullable: true,
    }),
    infAd: this.formBuilder.control('',{
      validators:[Validators.required],
      nonNullable: true,
    }),
  });

  constructor(private router: Router
    //private dialogRef: MatDialogRef<SstComponent>,
    //@Inject(MAT_DIALOG_DATA) public data:SolicitudSTI|any
  ){
    this.uidString = String(this.usuario?.uid);
  }

  async ngOnInit():Promise<void>{
    //console.log("Depto UID: ", this.uidString);
    this.folioo = await this.servicios.getFolio("st");
    console.log("folio: ", this.folioo);
  }

 guardar(){
    this.fecha = new Date().toISOString().slice(0,16);

    if (this.form.value.id == null
      || this.form.value.id == ''){

        this.solicitarST();

    }else{
      this.form.value.salidaSt = ValidarFechas.fechaToString(new Date(Date.parse(this.form.value.salidaSt)));
      this.form.value.regresoSt = ValidarFechas.fechaToString(new Date(Date.parse(this.form.value.regresoSt)));
      //this.servicios.editarSST(/*this.form.value*/);
    }
  }

  async solicitarST(){
    try {
      this.sst = this.form.value;

      this.form.value.fechaSol = ValidarFechas.parseDateToStringWithFormat(new Date());
      var salst = Date.parse(this.form.value.salidaSt);
      this.form.value.salidaSt = ValidarFechas.fechaToString(new Date(salst));
      this.form.value.regresoSt = ValidarFechas.fechaToString(new Date(this.form.value.regresoSt));
      
      this.sst.departamento_id = this.uidString;
      this.sst.folio = this.folioo;
      
      console.log("Solicitud: ", this.sst);
      //await this.servicios.addDoc(this.sst);
      this.deptoActual = await this.deptoServicios.getDeptoClass(this.uidString);
      this.sst.id = await this.servicios.addDocReturnID(this.sst,"st");
      alert("Verificar fechas antes de continuar");
      alert("Solicitud registrada en base de datos!!!");
      await GenerarPDFService.generaPDF_ST(this.sst, this.deptoActual, this.sst.folio,this.sst.id);
      this.router.navigate(['solicitudes/allst']);
    } catch (error) {
      console.log(error);
    }
  }

  async limpiarFormulario():Promise<void>{
    await this.form.reset();
  }
}
