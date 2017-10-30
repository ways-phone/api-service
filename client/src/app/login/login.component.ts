import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

import { LoginModel } from '../models/login';
import { saveToken, isLoggedIn } from '../../utils/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginDetails: LoginModel;
  error: string;
  constructor(private loginService: LoginService, private router: Router) {
    this.loginDetails = new LoginModel();
  }

  ngOnInit() {
    if (isLoggedIn()) {
      this.router.navigate(['./dashboard']);
    }
  }

  login(): void {
    this.loginService
      .login(this.loginDetails)
      .then(data => {
        saveToken(data.token);
        this.router.navigate(['./dashboard']);
      })
      .catch(error => {
        this.error = error.json().message;
      });
  }
}
