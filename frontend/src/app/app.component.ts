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
    private auth: AuthService,
    private titleService: Title
  ){}

  ngOnInit(){
    this.auth.authChanged.subscribe(()=>{
      this.auth.apiUrl = this.auth.authApiUrl + "/" + this.auth.user;
      setTimeout(()=>{
        if (this.auth.isAuthenticated){
          this.auth.checkNew().subscribe(()=>{},()=>{
            this.auth.logout();
          })
        }
      }, 50);
    });
    this.setTitle(this.title)
    this.auth.user = localStorage.getItem('id'),
    this.auth.token = localStorage.getItem('token');
    if (this.auth.user){
      this.auth.getUserDetails(this.auth.user).subscribe(()=>{
          this.auth.isAuthenticated = true; 
          this.auth.authChanged.next();
        }, ()=>{
          this.auth.logout();
        }
      );
    } else {
      this.auth.isAuthenticated = false;
      this.auth.user = "";
      this.auth.authChanged.next();
    }
  }
  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  
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

}
