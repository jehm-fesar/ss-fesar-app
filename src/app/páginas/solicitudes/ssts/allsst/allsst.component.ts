import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable, ReplaySubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { VistaSSTs } from '../../../../modelos/sst/VistaSSTs.interface';
import { SstComponent } from '../sst/sst.component';
import { Overlay, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {MatCardModule} from '@angular/material/card';

import { Departamento } from '../../../../modelos/departamento/departamento.class';
import { enviroment } from '../../../../enviroments/enviroment';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { ValidarFechas } from '../../../../servicios/validarFechas';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { SolicitudSTI } from '../../../../modelos/sst/solicitudesst.interface';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { DepartamentoService } from '../../../../servicios/departamentoservice/departamento.service';
import { DepartamentoI } from '../../../../modelos/departamento/departamento.interface';
import { GenerarPDFService } from '../../../../servicios/generar-pdf.service';
import { CambiarVariables } from '../../../../servicios/cambiarVariables.class';

const ELEMENT_DATA: VistaSSTs[]=[]

@Component({
  selector: 'app-allsst',
  standalone: true,
  imports: [ MatCommonModule, MatCommonModule, MatFormFieldModule,
    ReactiveFormsModule, CommonModule, MatIconModule, 
    MatInputModule, MatTableModule, MatButtonModule,
    MatCardModule],
  templateUrl: './allsst.component.html',
  styleUrl: './allsst.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class AllsstComponent implements OnInit {
  private router = inject(Router);

  private auth: Auth = inject(Auth);
  private usuario = this.auth.currentUser;

  private app = initializeApp(enviroment.firebaseConfig);
  private db = getFirestore(this.app);
  
  private sst: SolicitudSTI|any;
  private ssts!: SolicitudSTI[];
  private uidString!: string;
  private folioo!:string;

  private servicios = inject(ServiciosService);
  private deptoServicios = inject(DepartamentoService);
  
  private deptoClass: Departamento|any;
  private deptoRequisitanteClass: Departamento|any;
  private deptoInterface!: DepartamentoI;

  private deptoTitularJyT!: string;

  depto!:string;
  deptos: DepartamentoI[] =[];
  arrSstI: SolicitudSTI[] = [];
  arrSstICambio: SolicitudSTI[] = [];

  constructor(private matDialog: MatDialog, 
    private overlay: Overlay){
      this.uidString = String(this.usuario?.uid);
    }

  async ngOnInit(): Promise<void> {
    return await new Promise (async (resuelve)=>{
      this.deptoClass = await this.deptoServicios.getDeptoClass(this.uidString);
      this.deptoClass.id = (await this.deptoServicios.getDeptoID(this.uidString));
      this.deptos = await this.deptoServicios.getDeptos();
      console.log("this.deptos: ", this.deptos);
      if (this.deptoClass.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.ssts = await this.servicios.getAllSTs();
        console.log("arreglo: ", this.ssts);
        this.dataToDisplay = this.ssts;
        this.dataSource.setData(this.ssts);
        
        this.arrSstICambio = await this.cambiarDepartamento_id_x_Departamento(this.ssts, this.deptos);
        this.dataSource.setData(this.arrSstICambio);
        //console.log("this.arrSstICambio", this.arrSstICambio)
      }else{
        this.ssts = await this.servicios.getAllSTsByIdDepto(this.uidString,"st");
        this.arrSstICambio =  await CambiarVariables.cambiarDepartamento_id_x_Departamento(this.ssts, this.deptos);
        this.dataSource.setData(this.ssts);
        console.log("ssts: ", this.ssts);
      }
      
      this.deptoInterface = this.deptoClass;
      this.depto = String(this.deptoInterface.departamento); 
      console.log("uid: ",this.uidString);
      console.log("deptoId: ", this.deptoClass?.id);
      console.log("departamento: ", this.depto);
      return resuelve();
    });
  }

  displayedColumns: string[] = ['folio','fechaSol','departamento_id', 
    'destino','salidaSt','regresoSt','tServicio','tTransporte','acciones',
  ];
  
  dataToDisplay = this.ssts;

  dataSource = new ExampleDataSource(this.dataToDisplay);

  addData() {
    const randomElementIndex = Math.floor(Math.random() * this.ssts.length);
    this.dataToDisplay = [...this.dataToDisplay, this.ssts[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }
  
  onEdit(){
    this.limpiarFormulario();
    this.router.navigate(['solicitudes/st']);
    //this.openModal();
    if (Element){
      //this.servicios.selectedST = element;
      //this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
      //this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
    }
    this.ngOnInit();
  }

  openModal(): void{
    const dialogConfig = new MatDialogConfig();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    dialogConfig.data = this.dataSource
    dialogConfig.autoFocus = true;
    dialogConfig.scrollStrategy;
    dialogConfig.maxHeight = '620px';
    dialogConfig.height = '400px';
    dialogConfig.width = '800px'
    this.matDialog.open(SstComponent,dialogConfig);
  }

  limpiarFormulario(){}

  async imprimir(element: any){
    if (this.deptoClass.departamento == "JARDINERÍA Y TRANSPORTES"){
      //await this.cambiarDepartamento_x_Departamento_id(this.ssts);
      //this.arrSstICambio = await this.cambiarDepartamento_x_Departamento_id(this.ssts,this.deptos);
      //this.dataSource.setData(this.arrSstICambio);
      console.log("this.deptoClass: ",this.deptoClass);
      console.log("element.id",element.id);
      console.log("element.departamento_id; ",element.departamento_id)
      //this.deptoRequisitanteClass = await this.deptoServicios.getDepto(element.departamento_id);
      this.sst = await this.servicios.getSSTbyId(element.id);
      this.deptoRequisitanteClass = await this.deptoServicios.getDeptoClass(this.sst.departamento_id);
      console.log("imprime Jardineria: ", this.sst);
      console.log("this.deptoRequisitanteClass: ", this.deptoRequisitanteClass)
      //console.log("IMPRIME this.deptoInterface: ", this.deptoInterface);
      //console.log("IMPRIME element aka this.ssti: ", this.ssti);
      GenerarPDFService.generaPDF_ST(this.sst,
                                      this.deptoRequisitanteClass,
                                      this.sst.folio,
                                      this.sst.id);
    }else{
      console.log("Imprimiendo pdf distinto a Jardinería");
      this.deptoTitularJyT = await this.deptoServicios.getTitular("JARDINERIA Y TRANSPORTES","st");
      console.log("titular del departamento de Jardinería y Transportes: ", this.deptoTitularJyT);
      this.sst = await this.servicios.getSSbyFolio(element.folio,"st");
      console.log("this.sst: ", this.sst);
      GenerarPDFService.generaPDF_ST(this.sst,
                                this.deptoClass,
                                this.sst.folio,
                                this.sst.id);
    }
    //this.ngOnInit();
  }

  /*---async sstHoy(){
    this.hoy = ValidarFechas.fechaToString(new Date());
    this.dataSource.data = await this.stServicio.getColeccionSST_hoy(this.hoy);
    this.arrSstI = await this.stServicio.getColeccionSST_hoy(this.hoy);
    this.totalRegistros = this.arrSstI.length;
    this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.  deptos);
  }

  async sstMostla(){
    this.mostla = ValidarFechas.fechaMostlaToString(new Date());
    this.dataSource.data = await this.stServicio.getColeccionSST_hoy(this.mostla);
    this.arrSstI = await this.stServicio.getColeccionSST_hoy(this.mostla);
    this.totalRegistros = this.arrSstI.length;
    this.cambiarDepartamento_id_x_Departamento(this.arrSstI, this.deptos);
  }
  
  total(){
    return this.totalRegistros;
  }
---*/
  /*exportarAExcel(){
    this.xlsxexporter.exportarAExcel(this.dataSource.data, 'mi_exportacion');
  }*/

  async cambiarDepartamento_id_x_Departamento(arrSstI: SolicitudSTI[], deptos: DepartamentoI[]):Promise<SolicitudSTI[]>{
    return new Promise( async (resuelve,rechaza) =>{
      try {
        for( var i=0; i< arrSstI.length; i++){
          for(var j = 0; j<deptos.length; j++){
            if (arrSstI[i].departamento_id == deptos[j].uid){
              arrSstI[i].departamento_id = deptos[j].departamento;
            }
          }
        }
        //return resuelve(this.dataSource.data=arrSstI);
        return await resuelve(arrSstI);
      } catch (error: any) {
        rechaza(error.message);
      }
    });
  }

  async cambiarDepartamento_x_Departamento_id(arrSstI: SolicitudSTI[], deptos: DepartamentoI[]):Promise<SolicitudSTI[]>{
    return await new Promise( async (resuelve, rechaza) => {
      try {
        for( var i=0; i< arrSstI.length; i++){
          for(var j = 0; j<this.deptos.length; j++){
            if (arrSstI[i].departamento_id == this.deptos[j].departamento){
              this.arrSstI[i].departamento_id = this.deptos[j].uid;
            }
          }
        }
        //this.dataSource.setData(this.arrSstI);
        return await resuelve(this.arrSstI)
      } catch (error) {
        return await rechaza(error);
      }
    });
  }
/*-----
  cambia_Departamento_x_departamento_id(element: any){
    //console.log("elemento", element);
    return this.authServicio.getDeptoDepartamento(element.departamento_id)
              .where("departamento", "==", element.departamento_id)
              .get().then(doc=>{doc.forEach(
                    doc=>{
                      element.departamento_id=doc.id;
                      //console.log("element.departamento_id: ", element.departamento_id);
                      //console.log("element.folio: ", element.folio);
                      this.servicios.selectedST = element;
                      this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
                      this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
                    })
                  });
  }
-----*/

}

class ExampleDataSource extends DataSource<SolicitudSTI> {
  private _dataStream = new ReplaySubject<SolicitudSTI[]>();

  constructor(initialData: SolicitudSTI[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<SolicitudSTI[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: SolicitudSTI[]) {
    this._dataStream.next(data);
  }
}
