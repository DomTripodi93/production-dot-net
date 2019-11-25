import { Component, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MachineService } from './machine.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnDestroy{
  subscriptions: Subscription[] = [];


  constructor(
    public auth: AuthService,
    private machServ: MachineService,
    private route: ActivatedRoute
  ) {
    this.getMachType();
  }

  getMachType(){
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.machServ.machChanged.next();
      })
    );
  }
  //Gets machine type from url params, and updates machine components 
  // when it changes

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }
}
