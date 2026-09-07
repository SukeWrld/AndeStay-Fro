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
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    const accounts: AccountInfo[] = this.authService.instance.getAllAccounts();
    this.isLoggedIn = accounts.length > 0;
    if (this.isLoggedIn) {
      const account = accounts[0];
      this.userName = account.username || 'Usuario';
    }
  }

  login() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect();
  }
}