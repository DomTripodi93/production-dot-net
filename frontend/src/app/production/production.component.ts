import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DaysService } from '../shared/days/days.service';
import { AuthService } from '../shared/auth.service';
import { NgForm } from '@angular/forms';
import { Machine } from '../machine/machine.model';
import { MachineService } from '../machine/machine.service';
import { OpService } from '../job/job-ops/operation.service';
import { ProductionService } from './production.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent {
  @ViewChild('chooseMachine') chooseMachForm: NgForm;
  machines = [];
  fullMach: Machine[] = [];
  job = '';
  machine = '';
  defaultMach = '';

  constructor(
    private dayServ: DaysService,
    private router: Router,
    private mach: MachineService,
    private auth: AuthService,
    private pro: ProductionService,
    private opServ: OpService
  ){
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
    console.log(job)
    this.router.navigate(["/production/op=" + op + "&job=" + job])
  }

}
