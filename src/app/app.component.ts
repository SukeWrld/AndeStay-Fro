import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-andestay';
  isLoggedIn = false;
  userName = '';

  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    this.authService.instance.handleRedirectPromise().then((res: AuthenticationResult | null) => {
      if (res && res.account) {
        this.authService.instance.setActiveAccount(res.account);
      }
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    const accounts: AccountInfo[] = this.authService.instance.getAllAccounts();
    this.isLoggedIn = accounts.length > 0;
    if (this.isLoggedIn) {
      const account = accounts[0];
      const claims = account.idTokenClaims as { name?: string };
      this.userName = claims?.name || account.username || 'Usuario';
    }
  }

  login() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect();
  }
}