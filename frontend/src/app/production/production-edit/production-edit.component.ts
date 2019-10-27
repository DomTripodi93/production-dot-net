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
import { JobService } from '../../job/job.service';
import { OpService } from 'src/app/job/job-ops/operation.service';

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
  machines = [];
  jobs = [];
  ops = [];
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
    private mach: MachineService,
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.subscriptions.push(
      this.pro.fetchProductionBySearch(this.id).subscribe(
        lot => {
          let beginning = lot.date.substring(5,10);
          lot.date = beginning + "-" + lot.date.substring(0,4);
          this.production = lot;
          this.initForm();
        }
      )
    );
    this.subscriptions.push(
      this.mach.fetchMachinesByType()
      .subscribe(machines => {
        machines.forEach((mach)=>{
          this.machines.push(mach.machine)
        });
        this.jobServ.fetchAllJobs().subscribe(paginatedResponse =>{
          let goneThrough = 1;
          let response = paginatedResponse.result;
          if (response.length==0){
            this.initForm();
          } else {
            response.forEach(job => {
              this.jobs.push(job.jobNumber);
              goneThrough++;
              if (goneThrough == response.length+1){
                this.changeOps(this.production.jobNumber);
                this.initForm();
              }
            });
          }
        });
      })
    );
  }


  private initForm() {
    this.editProductionForm = new FormGroup({
      'partNumber': new FormControl(this.production.partNumber),
      'quantity': new FormControl(this.production.quantity, Validators.required),
      'jobNumber': new FormControl(this.production.jobNumber, Validators.required),
      'opNumber': new FormControl(this.production.opNumber, Validators.required),
      'date': new FormControl(this.dayServe.dateForForm(this.production.date), Validators.required),
      'machine': new FormControl(this.production.machine, Validators.required),
      'shift': new FormControl(this.production.shift, Validators.required),
      "machType": new FormControl(this.auth.machType)
    });
  }

  changeOps(option: String){
    this.ops = []
    if (option != "None"){
      this.opServ.fetchOpByJob(option).subscribe((ops)=>{
        ops.forEach((op)=>{
          this.ops.push(op.opNumber);
        })
      })
    }
  }

  onSubmit(){
    if (this.editProductionForm.value.opNumber.includes("/")){
      this.editProductionForm.value.opNumber = this.opServ.slashToDash(this.editProductionForm.value.opNumber);
    }
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
