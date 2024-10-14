import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { Departamento } from '../../../../modelos/departamento/departamento.class';
import { DepartamentoService } from '../../../../servicios/departamentoservice/departamento.service';
import { DepartamentoI } from '../../../../modelos/departamento/departamento.interface';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { GenerarPDFService } from '../../../../servicios/generar-pdf.service';
import { AuthService, CredentialUID } from '../../../../servicios/authservice/auth.service';
import { SolicitudSCPI } from '../../../../modelos/sscp/sscpi.interface';
import { CambiarVariables } from '../../../../servicios/cambiarVariables.class';
import { Observable, ReplaySubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { ValidarFechas } from '../../../../servicios/validarFechas';

@Component({
  selector: 'app-allsscp',
  standalone: true,
  imports: [
    MatCommonModule, MatCommonModule, MatFormFieldModule,
    ReactiveFormsModule, CommonModule, MatIconModule, 
    MatInputModule, MatTableModule, MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './allsscp.component.html',
  styleUrl: './allsscp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllsscpComponent implements OnInit{
  private authServicio = inject(AuthService);
  private servicios = inject(ServiciosService);
  private deptoServicios = inject(DepartamentoService);
  private credencialUsuarioActual!: CredentialUID;
  private deptoSolicitante!: Departamento;
  private deptoEjecutante!: Departamento;

  private sscp!: SolicitudSCPI;
  private arrSscpI: SolicitudSCPI[] = [];
  private arrSscpIcambio: SolicitudSCPI[] = [];
  private deptos: Departamento[] =[];
  totalRegistros!: number;

  displayedColumns: string[] = ['folio', 'fechaSol', 
                      'departamento_id', 'remitente', 
                      'destino','destinatario',
                      'entrega','tCorrespondencia',
                      'tEnvio','acciones'];
  
  dataToDisplay = this.arrSscpI;

  dataSource = new ExampleDataSource(this.dataToDisplay);

  constructor(private router: Router){}

  async ngOnInit(): Promise <void> {
    return await new Promise(async(resuelve)=>{
      this.credencialUsuarioActual = await this.authServicio.estadoUsuarioActual();
      this.deptoSolicitante = await this.deptoServicios.getDeptoClass(this.credencialUsuarioActual.uid);
      this.deptos = await this.deptoServicios.getDeptos();
      if(this.deptoSolicitante.departamento=="JARDINERÍA Y TRANSPORTES"){
        this.arrSscpI = await this.servicios.getAllSS("scp");
        console.log("this.arrSscpI: ", this.arrSscpI);
        this.arrSscpIcambio = await CambiarVariables.cambiarDepartamento_id_x_Departamento(this.arrSscpI,this.deptos);
        console.log("cambio de id por depto: ", this.arrSscpIcambio);
        this.dataSource.setData(this.arrSscpIcambio);
      }else{
        this.arrSscpI = await this.servicios.getAllSSbyIdDepto(this.credencialUsuarioActual.uid,"scp");
        this.dataSource.setData(this.arrSscpI);
        this.arrSscpIcambio = await CambiarVariables.cambiarDepartamento_id_x_Departamento(this.arrSscpI,this.deptos);
        console.log("this.arrSscpI: ", this.arrSscpI);
      }
      return resuelve();
    });
  }

  toHome(){ this.router.navigate(["home"]); }

  sscHoy(){}

  sscMostla(){}

  total(){}

  add(){
    //---this.limpiarFormulario();
    //console.log("presionó en add(): ", this.servicios.selectedSC);
    //---this.openModal();
    this.router.navigate(['/solicitudes/scp']);
  }

  async editar(element:any){
    if(element){
      alert("presionó en editar")
      var hoy = ValidarFechas.parseDateToStringWithFormat(new Date());
      const vf: ValidarFechas = new ValidarFechas(element.entrega, element.entrega, hoy);
      if( await vf.validarFechas_SCP()){
        //console.log("ELEMENT: ", element);
        this.sscp = element;
        //console.log("element con await: ", element);
        //Cómo poner la fecha del DATE 
        //this.servicios.selectedST.salidaSt = ValidarFechas.convertirFechaToMatPicker(element.salidaSt);
        //this.servicios.selectedST.regresoSt = ValidarFechas.convertirFechaToMatPicker(element.regresoSt);
        //------this.openModal();
      }else{
        alert("No se puede modificar: Fecha pasada");
      }
    }
    this.ngOnInit();
  }

  async imprimir(element:any):Promise<void>{
    if (this.deptoSolicitante.departamento == "JARDINERÍA Y TRANSPORTES"){

      this.arrSscpIcambio = await CambiarVariables.cambiarDepartamento_x_Departamento_id(this.arrSscpI, this.deptos);
      this.deptoSolicitante = await this.deptoServicios.getDeptoClass(element.departamento_id);
      this.sscp = await this.servicios.getSSbyId(element.id,"scp");
      GenerarPDFService.generaPDF_SC(this.sscp,this.deptoSolicitante,Number(this.sscp.folio),this.sscp.id);
    }else{
      this.sscp = await this.servicios.getSSbyFolio(element.folio,"scp");
      GenerarPDFService.generaPDF_SC(this.sscp,this.deptoSolicitante,Number(this.sscp.folio),this.sscp.id);
    }
    //this.ngOnInit();
  }


}


//--------------------------------------------------------------
class ExampleDataSource extends DataSource<SolicitudSCPI> {
  private _dataStream = new ReplaySubject<SolicitudSCPI[]>();

  constructor(initialData: SolicitudSCPI[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<SolicitudSCPI[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: SolicitudSCPI[]) {
    this._dataStream.next(data);
  }
}