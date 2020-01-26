import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Production Management';

  public constructor(
    public auth: AuthService,
    private titleService: Title,
    private router: Router
  ){}

  ngOnInit(){
    this.auth.authChanged.subscribe(()=>{
      this.auth.apiUrl = this.auth.authApiUrl + "/" + this.auth.user;
      if (this.auth.isAuthenticated){
        this.auth.checkSettings().subscribe(()=>{},()=>{
          this.auth.logout();
        });
      };
    });
    //Subscription to logging in and out to check user token against the backend, if 
    // the token fails, there will be an error, triggering the logout function in 
    // the auth service
    
    this.checkUser();
    //Sets initial base user values, and settings

    this.setTitle(this.title)
    //Sets the page title to the app title, as opposed to the app identifier "frontend"

  }

  checkUser(){    
    this.auth.user = localStorage.getItem('id'),
    //Sets user id number to a stored value from login
    
    this.auth.token = localStorage.getItem('token');
    //Sets the authentication token in the app to a stored value from login

    if (this.auth.user){
      this.auth.getUserDetails().subscribe(()=>{
          this.auth.isAuthenticated = true; 
          this.auth.authChanged.next();
        }, ()=>{
          this.auth.logout();
          this.router.navigate(["/"]);
        }
      );
      //Sets user settings options to those stored in the database, or logs out if 
      // authentication fails
    } else {
      this.auth.logout();
      //Logs user out if no user id is available in local storage, as would be set
      // upon successful login
    }
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  //Used to set the page title to a specified value

  onActivate() {
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, 0)
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
  }
  //Scrolls to the top of the page upon navigation

}
