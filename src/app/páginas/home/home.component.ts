import { Component, inject, Inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from "../../servicios/authservice/auth.service";
import { Auth } from "@angular/fire/auth";
import { Router, RouterOutlet } from "@angular/router";
import { MatMenu, MatMenuModule } from "@angular/material/menu";

@Component({
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, 
                MatButtonModule, MatMenuModule, MatMenu],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls:['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class HomeComponent implements OnInit{
    private authServicio = inject(AuthService);

    private auth: Auth = inject(Auth);
    //private usuario = this.auth.currentUser;

    constructor(private router: Router){}
  
    ngOnInit(): void {
        console.log("HomePage: ", this.auth.currentUser?.uid);
        if (this.auth.currentUser?.emailVerified){
            //programar para que vaya directo al menu de servicios
            console.log("usuario con email VERIFICADO");
            this.router.navigate(['/home']);
        }else{
            //Programar para que vaya directo a registrar departamento
            console.log("Usuario con email no verificado")
            this.router.navigate(['/']);
        }
    }

    async logOut(): Promise<void>{
        try {
            await this.authServicio.logOut();    
            this.router.navigate(['/auth/login']);
        } catch (error) {
            console.error(error);
        }
    }
    async sts(){
        this.router.navigate(['/solicitudes/allst']);
    }
    async scps(){
        this.router.navigate(['/solicitudes/allscp']);
    }
}
