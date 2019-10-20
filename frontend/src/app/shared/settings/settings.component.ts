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
  //Checks settings and sets displayed option text for Tutorial 
  // activation and deactivation


  changeTutorial() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew();
    }
  }
  //Confirms decision to change Tutorial activation status, and sends 
  // change data to backend API

  onChangeStartTime(){
    this.auth.setStartTime = true;
  }
  //Sets variable for display of form to edit default start time

  onChangeBarEnd(){
    this.auth.setBarEnd = true;
  }
  //Sets variable for display of form to edit default bar end length

  onChangeBarCut(){
    this.auth.setBarCut = true;
  }
  //Sets variable for display of form to edit default bar cut to length
  
  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    })
  }

}
