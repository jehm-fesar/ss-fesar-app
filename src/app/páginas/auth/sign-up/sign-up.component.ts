import { Component, OnInit, inject } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from "@angular/router"
import { CommonModule, NgIf } from "@angular/common"
import { AuthService, Credencial } from "../../../servicios/authservice/auth.service"
import { Router } from "@angular/router"
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
//import { ButtonProviders } from '../components/button-providers/button-providers.component';
import { getAuth } from 'firebase/auth';
import { sendEmailVerification } from "@angular/fire/auth"


export interface SignUpForm{
    email: FormControl<string>;
    psw: FormControl<string>;
}

@Component({
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule, CommonModule,
        NgIf,
        MatSnackBarModule,
        //ButtonProviders,
    ],
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export default class SignUpComponent implements OnInit{
    hide = true;
    formBuilder = inject(FormBuilder);
    
    private _router = inject(Router);
    private authServicio = inject(AuthService);

    private auth = getAuth();
    //private usuario = this.auth.currentUser;

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
    
      private _snackBar = inject(MatSnackBar);

    get isEmailValid(): string | boolean {
        const control = this.form.get('email');

        const isInvalid = control?.invalid && control.touched;

        if (isInvalid) {
            return control.hasError('required')
                ? 'Este dato es requerido'
                : 'Introduzca un correo válido';
        }
        return false;
    }

    constructor(){}
    
    ngOnInit(): void {
        
    }

    async signUp():Promise<void>{
        if(this.form.invalid) return;
        const credencial: Credencial = { 
            email: this.form.value.email || "",
            psw: this.form.value.psw || ""
        }

        try {
            const credencialUsuario = await this.authServicio.signUpWithEmailAndPassword(credencial)
            .then((resultado)=>{
                sendEmailVerification(resultado.user)
                    .then((resultadoSend)=>{
                        console.log("Verifique su correo electrónico",resultado.user);
                    });
            });
            
            /*await this.authServicio.signUpWithEmailAndPassword(credencial)
                            .then((resultado)=>{
                                sendEmailVerification(resultado.user)
                                    .then((resultadoSend)=>{
                                        console.log("Verifique su correo electrónico",resultado.user);
                                    });
                            });*/
            console.log(credencialUsuario);
            this._router.navigateByUrl('/');
        } catch (error) {
            console.error("Error al crear usuario: ",error)
        }
        
        //console.log(this.form.value);
    }
}