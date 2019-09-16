import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { MachineService } from 'src/app/machine/machine.service';
import { AuthService } from 'src/app/shared/auth.service';
import { HourlyService } from '../hourly.service';
import { Subscription } from 'rxjs';
import { Machine } from 'src/app/machine/machine.model';
import { Hourly } from '../hourly.model';

@Component({
  selector: 'app-hourly-edit',
  templateUrl: './hourly-edit.component.html',
  styleUrls: ['./hourly-edit.component.css']
})
export class HourlyEditComponent implements OnInit, OnDestroy {
  editHourlyForm: FormGroup;
  hourly: Hourly;
  id: number;
  canInput = false;
  machines: Machine[] = [];
  subscriptions: Subscription[]=[];
  shifts = [
    "Day",
    "Night",
    "Over-Night",
    "Found"
  ];
  
  constructor(
    private hourlyServ: HourlyService,
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
    this.subscriptions.push(this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
    }));
    this.subscriptions.push(this.hourlyServ.fetchHourlyById(this.id)
    .subscribe(pro => {
      this.hourly = pro;
      this.initForm();
    }));
  }


  private initForm() {
    let quantity = this.hourly.quantity;
    let counterQuantity = this.hourly.counterQuantity;
    let jobNumber = this.hourly.jobNumber;
    let date = this.hourly.date;
    let machine = this.hourly.machine;
    let time = this.hourly.time

    this.editHourlyForm = new FormGroup({
      'quantity': new FormControl(quantity, Validators.required),
      'counterQuantity': new FormControl(counterQuantity),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time, Validators.required),
      'machine': new FormControl(machine, Validators.required),
      'jobNumber': new FormControl(jobNumber, Validators.required)
    });
  }

  onSubmit(){
    this.editHourly(this.editHourlyForm.value);
  }

  editHourly(data: Hourly) {
    this.hourlyServ.changeHourly(data, this.id).subscribe();
    setTimeout(()=>{this.router.navigate(["../.."], {relativeTo: this.route})},50);
  }

  onCancel(){
    window.history.back();
  }

  onDelete(){
    if (confirm("Are you sure you want to delete this hourly production?")){
      this.hourlyServ.deleteHourly(this.id).subscribe()
      setTimeout(()=>{
        this.router.navigate(["../.."], {relativeTo: this.route});
      }, 50)
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    });
  }

}