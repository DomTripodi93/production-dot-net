import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  id = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.id = this.auth.isAuthenticated;
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.isAuthenticated;
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
