import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('data') signupForm: NgForm;
  error = "";
  isError = false;
  submitted = false;
  user: User;
  
  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  onSubmit(){
    this.isError = false;
    this.submitted = true;
    this.user = this.signupForm.value;
    this.auth.registerUser(this.user)
    .subscribe(() => {
      this.router.navigate(["../login"], {relativeTo: this.route})
    },
    () => {
      this.isError = true
      this.error = "an account with that email already exists!";
    });
  }

}