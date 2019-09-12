import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductionService } from '../production.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Production } from '../production.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Machine } from '../../machine/machine.model';
import { MachineService } from '../../machine/machine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production-edit',
  templateUrl: './production-edit.component.html',
  styleUrls: ['./production-edit.component.css']
})
export class ProductionEditComponent implements OnInit, OnDestroy {
  editProductionForm: FormGroup;
  production: Production;
  id: number;
  canInput = false;
  machines = []
  jobs = [];
  subscriptions: Subscription[]=[];
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];
  
  constructor(
    private pro: ProductionService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private mach: MachineService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.subscriptions.push(this.route.params.subscribe((params: Params) =>{
      this.id = +params['id'];
    }));
    this.subscriptions.push(this.pro.fetchProductionById(this.id)
    .subscribe(pro => {
      this.production = pro;
      this.jobs.push(pro.job);
      this.initForm();
    }));
    this.subscriptions.push(
      this.mach.fetchMachineJobs()
      .subscribe(machines => {
        machines.forEach((mach)=>{
          if (!this.jobs.includes(mach.currentJob)){
            if (mach.currentJob !== "None"){
              this.jobs.push(mach.currentJob)
            }
          }
          this.machines.push(mach.machine)
        });
        this.machines.sort();
      }));
  }


  private initForm() {
    this.editProductionForm = new FormGroup({
      'quantity': new FormControl(this.production.quantity, Validators.required),
      'job': new FormControl(this.production.job, Validators.required),
      'date': new FormControl(this.production.date, Validators.required),
      'machine': new FormControl(this.production.machine, Validators.required),
      'shift': new FormControl(this.production.shift, Validators.required)
    });
  }

  onSubmit(){
    this.editProduction(this.editProductionForm.value);
  }

  editProduction(data: Production) {
    this.pro.changeProduction(data, this.id).subscribe();
    setTimeout(()=>{this.router.navigate([".."], {relativeTo: this.route})},50);
  }

  onCancel(){
    window.history.back();;
  }

  onDelete(){
    if (confirm("Are you sure you want to delete this lot?")){
      this.pro.deleteProduction(this.id).subscribe()
      this.router.navigate(["../../.."], {relativeTo: this.route});
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }

}
