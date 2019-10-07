import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  tutorialStatus = "";
  subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.checkStatus();
    this.subscriptions.push(
      this.auth.authChanged.subscribe(()=>{
        setTimeout(()=>{this.checkStatus()}, 50);
      })
    );
  }

  checkStatus(){
    this.auth.checkSettings().subscribe(()=>{
      if (this.auth.isNew === true){
        this.tutorialStatus = "Currently displaying tutorials."
      } else {
        this.tutorialStatus = "Currently not displaying tutorials."
      }
    });
  }


  changeTutorial() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew();
    }
  }

  onChangeStartTime(){
    this.auth.setStartTime = true;
  }

  onChangeBarEnd(){
    this.auth.setBarEnd = true;
  }

  onChangeBarCut(){
    this.auth.setBarCut = true;
  }
  
  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    })
  }

}
