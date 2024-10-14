import { Component, OnInit, inject } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from '@angular/material/button'
import { Router, RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { SignUpForm } from "../sign-up/sign-up.component"
import { AuthService, Credencial } from "../../../servicios/authservice/auth.service"


@Component({
    standalone: true,
    imports:[MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule, CommonModule],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})

export default class LoginComponent implements OnInit{
    hide = true;
    formBuilder = inject(FormBuilder);

    private authServicio = inject(AuthService);
    private _router = inject(Router);

    form: FormGroup<SignUpForm> = this.formBuilder.group({
        email: this.formBuilder.control('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
        psw: this.formBuilder.control('', {
          validators: Validators.required,
          nonNullable: true,
        }),
      });
    
    constructor(private router: Router){}

    ngOnInit(){

    }
    
    async logIn():Promise<void>{
        return await new Promise(async(resuelve,rechaza)=>{
            if(this.form.invalid) return resuelve();
            console.log(this.form.value);
            const credencial: Credencial = {
                email: this.form.value.email || '',
                psw:  this.form.value.psw || '' 
            };
        try {
            await this.authServicio.logInWithEmailAndPassword(credencial);
            await this._router.navigateByUrl('/');
            return await resuelve();
        } catch (error) {
            return rechaza(error);    
        }
        });

        
    }
}