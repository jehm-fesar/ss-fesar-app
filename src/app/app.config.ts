import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { enviroment } from "./enviroments/enviroment";

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
              provideClientHydration(),
              provideAnimationsAsync(),
              provideFirebaseApp( () => initializeApp(enviroment.firebaseConfig)),
              provideAuth(() => getAuth()),
              provideFirestore(() => getFirestore()),
              ]
};
