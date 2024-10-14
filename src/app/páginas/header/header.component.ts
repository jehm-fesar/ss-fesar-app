import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService, Credencial } from '../../servicios/authservice/auth.service';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authServicio = inject(AuthService);
  private auth = getAuth();
  public usuarioActual$!: Observable<Credencial>;
  menuValue:boolean = true;
  menuIcon: string = "bi bi-list";
  usuarioActual!: boolean;

  constructor(private router: Router){}

  openMenu(){
    this.menuValue =! this.menuValue;
    this.menuIcon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }
  closeMenu(){
    this.menuValue=false;
    this.menuIcon = "bi bi-list";
  }

  logOut(){
    this.authServicio.logOut();
    //AppComponent.isLogged = false;
  }

}
