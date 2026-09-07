import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.azure.clientId,
          authority: environment.azure.authority,
          redirectUri: environment.azure.redirectUri
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['User.Read']
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map()
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
