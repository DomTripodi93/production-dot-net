import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ProductionService } from '../production.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Production } from '../production.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Machine } from '../../machine/machine.model';
import { MachineService } from '../../machine/machine.service';
import { Subscription } from 'rxjs';
import { DaysService } from '../../shared/days/days.service';

@Component({
  selector: 'app-production-edit',
  templateUrl: './production-edit.component.html',
  styleUrls: ['./production-edit.component.css']
})
export class ProductionEditComponent implements OnInit, OnDestroy {
  @Input() id: number
  editProductionForm: FormGroup;
  production: Production;
  canInput = false;
  machines = []
  jobs = [];
  subscriptions: Subscription[] = [];
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];
  
  constructor(
    private pro: ProductionService,
    private dayServe: DaysService,
    private auth: AuthService,
    private mach: MachineService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.subscriptions.push(
      this.pro.fetchProductionBySearch(this.id).subscribe(
        lot => {
          let beginning = lot.date.substring(6,10);
          lot.date = beginning + "-" + lot.date.substring(0,4);
          this.production = lot;
          this.initForm();
        }
      )
    );
    this.subscriptions.push(
      this.mach.fetchMachineJobs()
      .subscribe(machines => {
        machines.forEach((mach)=>{
          if (mach.currentJob !== "None" && !this.jobs.includes(mach.currentJob)){
            this.jobs.push(mach.currentJob)
          }
          this.machines.push(mach.machine)
        });
      })
    );
  }


  private initForm() {
    this.editProductionForm = new FormGroup({
      'quantity': new FormControl(this.production.quantity, Validators.required),
      'jobNumber': new FormControl(this.production.jobNumber, Validators.required),
      'date': new FormControl(this.dayServe.dateForForm(this.production.date), Validators.required),
      'machine': new FormControl(this.production.machine, Validators.required),
      'shift': new FormControl(this.production.shift, Validators.required)
    });
  }

  onSubmit(){
    console.log(this.editProductionForm.value)
    this.editProduction(this.editProductionForm.value);
  }

  editProduction(data: Production) {
    this.pro.changeProduction(data, this.id).subscribe();
    setTimeout(()=>{
      this.pro.proChanged.next();
    },50);
  }

  onCancel(){
    this.pro.proChanged.next();
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    });
  }

}
