import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Signin } from './signin.model';
import { AuthService } from '../../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  error = "";
  isError = false;
  @ViewChild('data', {static:false}) signinForm: NgForm;
  user: Signin;


  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  onSubmit(){
    this.isError = false;
    this.user = this.signinForm.value;
    this.auth.signinUser(this.user)
    .subscribe(
      (responseData) => {
        this.auth.token = responseData.body['token'];
        localStorage.setItem('token', responseData.body['token']);
        this.auth.user = responseData.body["id"]
        localStorage.setItem('id', responseData.body["id"]);
        if (this.auth.user) {
          this.auth.isAuthenticated = true;
          this.auth.authChanged.next();
          this.router.navigate([".."], {relativeTo: this.route});
        }
      },() => {
        this.isError = true
        this.error = "This Email and Password combination is invalid!";
      }
    );
  }


}