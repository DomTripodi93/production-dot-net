import { Component, OnInit } from '@angular/core';
import { Production } from '../production.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductionService } from '../production.service';
import { AuthService } from '../../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DaysService } from '../../shared/days/days.service';
import { Machine } from '../../machine/machine.model';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-production-new',
  templateUrl: './production-new.component.html',
  styleUrls: ['./production-new.component.css']
})
export class ProductionNewComponent implements OnInit {
  canInput= false;
  productionForm: FormGroup;
  machines = [];
  joblessMach = [];
  fullMach: Machine[] = [];
  submitted: boolean = false;
  submission: string;
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];


  constructor(
    private pro: ProductionService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dayServe: DaysService,
    private mach: MachineService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    if (!this.dayServe.today){
      this.dayServe.resetDate();
    }
    this.mach.fetchMachineJobs()
    .subscribe((machines: Machine[]) => {
      this.fullMach = machines;
      machines.forEach((mach)=>{
        if (mach.currentOp !== "None"){
          this.machines.push(mach.machine)
        } else {
          this.joblessMach.push(mach.machine)
        }
      });
      this.machines.sort();
      this.initForm();
    });
    this.auth.hideButton(0);
  }
    
  private initForm() {
    if (+this.dayServe.today < 10 && this.dayServe.today.length <2){
      this.dayServe.today = "0"+this.dayServe.today
    };
    if (+this.dayServe.month < 10 && this.dayServe.stringMonth.length <2){
      this.dayServe.stringMonth = "0"+this.dayServe.month
    };
    let date = this.dayServe.year +"-"+this.dayServe.stringMonth+"-"+this.dayServe.today;

    this.productionForm = new FormGroup({
      'quantity': new FormControl("", Validators.required),
      'date': new FormControl(date, Validators.required),
      'shift': new FormControl(this.shifts[0], Validators.required),
      'machine': new FormControl(this.machines[0], Validators.required),
      'jobNumber': new FormControl(this.machines[0], Validators.required),
      'opNumber': new FormControl(this.machines[0], Validators.required)
    });
  }
  
  onSubmitPlus(){
    let prodMach: Machine = this.fullMach.find((mach)=>{
      return mach.machine == this.productionForm.value.machine;
    });
    this.productionForm.value.jobNumber = prodMach.currentJob;
    this.productionForm.value.opNumber = prodMach.currentOp;
    this.newProductionPlus(this.productionForm.value);
    this.submitted = true;
    this.submission = "Successfully added produciton lot of " + this.productionForm.value.quantity + " pieces produced on the " + this.productionForm.value.machine;
  }
  
  onSubmit(){
    let prodMach: Machine = this.fullMach.find((mach)=>{
      return mach.machine == this.productionForm.value.machine;
    });
    this.productionForm.value.jobNumber = prodMach.currentJob;
    this.productionForm.value.opNumber = prodMach.currentOp;
    this.newProduction(this.productionForm.value);
  }

  newProductionPlus(data: Production) {
    this.pro.addProduction(data).subscribe(()=>{
      this.pro.proChanged.next();
    });
  }

  newProduction(data: Production) {
    this.pro.addProduction(data).subscribe(()=>{
      this.pro.proChanged.next();
    });
    this.router.navigate([".."], {relativeTo: this.route});
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }


}
