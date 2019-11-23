import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { MachineService } from '../machine/machine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    private mach: MachineService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.mach.machChanged.next();
      })
    )
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

  onNew(){
    this.router.navigate(["/"+this.auth.machType + "/production/new"])
  }

}
