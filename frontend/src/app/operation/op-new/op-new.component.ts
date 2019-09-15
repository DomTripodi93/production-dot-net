import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from 'src/app/machine/machine.model';
import { MachineService } from 'src/app/machine/machine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { OpService } from '../operation.service';
import { Operation } from '../operation.model';

@Component({
  selector: 'app-op-new',
  templateUrl: './op-new.component.html',
  styleUrls: ['./op-new.component.css']
})
export class OpNewComponent implements OnInit {
  error = '';
  canInput= false;
  operationForm: FormGroup;
  isError = false;
  machines: Machine[] = []
  andCalculate = "none";
  
  constructor(
    private operationServ: OpService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private mach: MachineService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.initForm();
    });
    this.auth.hideButton(0);
  }
    
  private initForm() {
    let operation: string;
    let job: string;
    let machine = "";
    if (this.machines.length > 0){
      machine = this.machines[0].machine;
    }
    let cycleTime: string;
    let orderQuantity: string;
    let weightRecieved: string;
    let oal: string;
    let cutOff: string;
    let mainFacing: string;
    let subFacing: string;

    this.operationForm = new FormGroup({
      'job': new FormControl(job, Validators.required),
      'operation': new FormControl(operation, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      'machine': new FormControl(machine, Validators.required),
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing)
    });
  }

  
  onSubmit(){
    this.andCalculate = "none";
    this.newOp(this.operationForm.value);
  }

  newOp(data: Operation) {
    this.error= null;
    this.isError = false;
    this.operationServ.operationChanged.next();
    this.operationServ.addOp(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That op already exsists for that job!";
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }


}
