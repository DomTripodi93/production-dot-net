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
  latheStatus = "";
  millStatus = "";
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
      if (this.auth.isNew){
        this.tutorialStatus = "Currently displaying any tutorials."
      } else {
        this.tutorialStatus = "Currently not displaying tutorials."
      }
      if (this.auth.skipLathe){
        this.latheStatus = "Currently displaying tutorials."
      } else {
        this.latheStatus = "Currently not displaying tutorials."
      }
      if (this.auth.skipMill){
        this.millStatus = "Currently displaying tutorials."
      } else {
        this.millStatus = "Currently not displaying tutorials."
      }
    });
  }
  //Checks settings and sets displayed option text for Tutorial 
  // activation and deactivation


  changeTutorial() {
    if (this.auth.isNew == true){
      if (confirm("Are you sure you want to hide these tutorials?")){
        this.auth.changeNew();
      }
    } else {
      if (confirm("Are you sure you want to show tutorials?")){
        this.auth.changeNew();
      }
    }
  }
  //Confirms decision to change All Tutorial activation status, and sends 
  // change data to backend API

  changeLathe() {
    if (this.auth.isNew == true){
      if (confirm("Are you sure you want to hide these tutorials?")){
        this.auth.changeLathe();
      }
    } else {
      if (confirm("Are you sure you want to show tutorials?")){
        this.auth.changeLathe();
      }
    }
  }
  //Confirms decision to change Lathe Tutorial activation status, and sends 
  // change data to backend API

  changeMill() {
    if (this.auth.isNew == true){
      if (confirm("Are you sure you want to hide these tutorials?")){
        this.auth.changeMill();
      }
    } else {
      if (confirm("Are you sure you want to show tutorials?")){
        this.auth.changeMill();
      }
    }
  }
  //Confirms decision to change Mill Tutorial activation status, and sends 
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
