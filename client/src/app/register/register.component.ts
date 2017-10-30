import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { saveToken, currentUser } from '../../utils/authentication';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  registerModel: any = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  };
  check: string = '';
  errors: string;
  user: any;
  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  private validate() {
    const empties = Object.keys(this.registerModel).filter(t => !t);

    if (this.registerModel.password !== this.check) {
      this.errors = "Passwords don't match";
      return false;
    }

    if (empties.length > 0) {
      this.errors = 'Empty Field';
      return false;
    }

    return true;
  }

  submitRegister() {
    if (!this.validate()) return;
    this.authService
      .register(this.registerModel)
      .then(res => {
        if (!res.token) console.log(res);

        saveToken(res.token);

        this.router.navigate(['./dashboard']);
      })
      .catch(err => {
        this.errors = err.json().message;
      });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.user = currentUser();
  }
}
