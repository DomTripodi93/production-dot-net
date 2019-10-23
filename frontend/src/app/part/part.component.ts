import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})
export class PartComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
      })
    ) 
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

}
