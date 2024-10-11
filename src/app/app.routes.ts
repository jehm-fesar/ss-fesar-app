import { Routes } from '@angular/router';
import HomeComponent from './páginas/home/home.component';
import SignUpComponent from './páginas/auth/sign-up/sign-up.component';
import LoginComponent from './páginas/auth/login/login.component';
import { authGuard, publicGuard } from './guards/auth.guard';
import { DepartamentoComponent } from './páginas/depto/departamento.component';
import { SstComponent } from './páginas/solicitudes/ssts/sst/sst.component';
import { AllsstComponent } from './páginas/solicitudes/ssts/allsst/allsst.component';
import { AllsscpComponent } from './páginas/solicitudes/sscps/allsscp/allsscp.component';
import { SscpComponent } from './páginas/solicitudes/sscps/sscp/sscp.component';

export const routes: Routes = [
    { path: '', 
        canActivate: [authGuard],
        component: HomeComponent,
    },
    { path:'home', canActivate:[authGuard], component: HomeComponent},
    { path: 'auth',
        canActivate: [publicGuard],
        children:[
            { path: 'sign-up', component: SignUpComponent},
            { path: 'login', component: LoginComponent }
        ]
    },
    {
        path: 'depto',
        canActivate:[authGuard],
        children:[
            //{ path: 'registro', },
        ],
        component: DepartamentoComponent
    },
    {
        path: 'solicitudes',
        canActivate: [authGuard],
        children:[
            { path: 'allst', component:AllsstComponent },
            { path:'st', component:SstComponent },
            { path: 'allscp', component:AllsscpComponent },
            { path: 'scp', component:SscpComponent }
        ]
    }
];