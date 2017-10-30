import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [AuthService],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = {
    oldpassword: '',
    newpassword: '',
    check: '',
  };
  errors: string;
  success: string;
  constructor(private authService: AuthService, private location: Location) {}

  goBack() {
    this.location.back();
  }

  submitPasswordChange() {
    this.errors = '';
    this.success = '';
    const { check, newpassword } = this.changePasswordForm;
    if (!check) {
      this.errors = 'No new password entered';
    } else if (check !== newpassword) {
      this.errors = 'Passwords do not match!';
    } else {
      this.authService
        .changePassword({
          oldpassword: this.changePasswordForm.oldpassword,
          newpassword: this.changePasswordForm.newpassword,
        })
        .then(res => {
          if (res.success) {
            this.success = res.message;
          } else {
            this.errors = res.message;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  ngOnInit() {}
}
