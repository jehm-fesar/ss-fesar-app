import { Component } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { Router, RouterOutlet } from '@angular/router';
import { enviroment } from './enviroments/enviroment';
import { ProviderId } from '@angular/fire/auth';
import { HeaderComponent } from './páginas/header/header.component';
import HomeComponent from "./p\u00E1ginas/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent],
  providers:[ HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SISTEMA DE GESTIÓN DE SERVICIOS';
  constructor(private router: Router){}
}
