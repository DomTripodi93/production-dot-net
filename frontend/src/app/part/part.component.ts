import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PartService } from './part.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})
export class PartComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthService,
    public partServ: PartService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.partServ.partChanged.next();
      })
    ) 
  }

  switchActive(){
    this.partServ.onlyActive = !this.partServ.onlyActive;
    this.partServ.partChanged.next();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

}
