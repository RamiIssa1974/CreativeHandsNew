import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';
  pageTitle = 'تسجيل الدخول Login';

  constructor(private authService: AuthService,
    private router: Router) { }

  login(loginForm: NgForm) {
    //console.log("Logging in!");

    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password).subscribe(user => {
        //console.log("user: " + user);
        //console.log("this.authService.isLoggedIn: " + this.authService.isLoggedIn);
        if (user && this.authService.isLoggedIn) {
          this.router.navigateByUrl(this.authService.redirectUrl || '/');
        }
        else {
          this.errorMessage = ' المستخدم غير موجود';
        }
      });
    } else {
      this.errorMessage = 'خطأ في بيانات المستخدم';
    }
  }
}

