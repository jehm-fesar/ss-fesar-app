import { Component } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { Router, RouterOutlet } from '@angular/router';
import { enviroment } from './enviroments/enviroment';
import { ProviderId } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers:[ ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'siswebss';
  constructor(private router: Router){}
}
