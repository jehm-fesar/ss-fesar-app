import { Component, inject, Inject, OnInit } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from "../../servicios/authservice/auth.service";
import { Auth } from "@angular/fire/auth";

@Component({
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule],
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls:['./home.component.scss']
})

export default class HomeComponent implements OnInit{
    private authServicio = inject(AuthService);

    private auth: Auth = inject(Auth);
    private usuario = this.auth.currentUser;
  
    ngOnInit(): void {
        console.log("HomePage: ", this.auth.currentUser?.uid);
    }

    async logOut(): Promise<void>{
        try {
            await this.authServicio.logOut();    
        } catch (error) {
            console.error(error);
        }
        
    }
}
