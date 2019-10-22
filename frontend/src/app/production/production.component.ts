import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DaysService } from '../shared/days/days.service';
import { AuthService } from '../shared/auth.service';
import { NgForm } from '@angular/forms';
import { Machine } from '../machine/machine.model';
import { MachineService } from '../machine/machine.service';
import { OpService } from '../job/job-ops/operation.service';
import { ProductionService } from './production.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnDestroy {
  @ViewChild('chooseMachine') chooseMachForm: NgForm;
  machines = [];
  fullMach: Machine[] = [];
  job = '';
  machine = '';
  defaultMach = '';
  subscriptions: Subscription[] = [];

  constructor(
    private dayServ: DaysService,
    private router: Router,
    private mach: MachineService,
    public auth: AuthService,
    private pro: ProductionService,
    private opServ: OpService,
    private route: ActivatedRoute
  ){
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
      })
    )
    this.mach.fetchMachineJobs()
    .subscribe((machines: Machine[]) => {
      this.fullMach = machines;
      machines.forEach((mach)=>{
        if (mach.currentOp !== "None"){
          this.machines.push(mach.machine)
        }
      });
      this.machines.sort();
      this.defaultMach = this.machines[0];
    });
  }

  onNew(){
    this.dayServ.resetDate();
    this.router.navigate(["/production/new"])
  }

  chooseMach(){
    this.pro.proChanged.next();
    let machToSet = this.fullMach.find((mach: Machine) =>{
      return mach.machine == this.chooseMachForm.value.machine
    });
    let job = machToSet.currentJob;
    let op = machToSet.currentOp;
    if (op.includes("/")){
      op = this.opServ.slashToDash(op);
    }
    this.pro.setMach = this.chooseMachForm.value.machine;
    this.router.navigate(["/production/op=" + op + "&job=" + job])
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

}
