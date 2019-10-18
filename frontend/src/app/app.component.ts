import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Production Management';
  subscription = new Subscription;
  id: number;

  public constructor(
    public auth: AuthService,
    private titleService: Title
  ){}

  ngOnInit(){
    this.auth.authChanged.subscribe(()=>{
      this.auth.apiUrl = this.auth.authApiUrl + "/" + this.auth.user;
      setTimeout(()=>{
        if (this.auth.isAuthenticated){
          this.auth.checkSettings().subscribe(()=>{},()=>{
            this.auth.logout();
          })
        }
      }, 50);
    });
    //Subscription to logging in and out to check user token against the backend, if 
    // the token fails, there will be an error, triggering the logout function in 
    // the auth service
    
    this.setTitle(this.title)
    //Sets the page title to the app title, as opposed to the app identifier "frontend"
    
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
