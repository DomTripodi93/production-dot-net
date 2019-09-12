import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PartService } from '../part.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Part } from '../part.model';
import { Machine } from 'src/app/machine/machine.model';
import { MachineService } from '../../machine/machine.service';

@Component({
  selector: 'app-part-new',
  templateUrl: './part-new.component.html',
  styleUrls: ['./part-new.component.css']
})
export class PartNewComponent implements OnInit {
  error = '';
  canInput= false;
  partForm: FormGroup;
  isError = false;
  machines: Machine[] = []
  andCalculate = "none";
  
  constructor(
    private partServ: PartService,
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
    let part: string;
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

    this.partForm = new FormGroup({
      'job': new FormControl(job, Validators.required),
      'part': new FormControl(part, Validators.required),
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
    this.newPart(this.partForm.value);
  }

  newPart(data: Part) {
    this.error= null;
    this.isError = false;
    this.partServ.partChanged.next();
    this.partServ.addPart(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That job already exsists on that machine!";
      } else if (this.andCalculate == "length"){
        this.router.navigate(["calculator/job"], {relativeTo: this.route})
      } else if (this.andCalculate == "weight"){
        this.router.navigate(["calculator/weight"], {relativeTo: this.route})
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onAddThenCalcByLength(){
    this.partServ.holdPart(this.partForm.value)
    this.andCalculate = "length";
    this.newPart(this.partForm.value);
  }

  onAddThenCalcByWeight(){
    this.partServ.holdPart(this.partForm.value);
    this.andCalculate = "weight";
    this.newPart(this.partForm.value);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
