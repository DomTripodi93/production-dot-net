import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Part } from '../part.model';
import { PartService } from '../part.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { Machine } from 'src/app/machine/machine.model';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-part-edit',
  templateUrl: './part-edit.component.html',
  styleUrls: ['./part-edit.component.css']
})
export class PartEditComponent implements OnInit {
  editPartForm: FormGroup;
  part: Part;
  id: number;
  canInput = false;
  isError = false;
  error = "";
  machines: Machine[] = [];
  
  constructor(
    private partServ: PartService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private mach: MachineService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.id = +params['id'];
    });
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.partServ.fetchPartById(this.id)
      .subscribe(part => {
        this.part = part;
        this.initForm();
      });
    });
  }


  private initForm() {
    let job = this.part.job;
    let part = this.part.part;
    let machine = this.part.machine;
    let cycleTime = this.part.cycleTime;
    let orderQuantity = this.part.orderQuantity;
    let weightRecieved = this.part.weightRecieved;
    let oal = this.part.oal;
    let cutOff = this.part.cutOff;
    let mainFacing = this.part.mainFacing;
    let subFacing = this.part.subFacing;

    this.editPartForm = new FormGroup({
      'job': new FormControl(job, Validators.required),
      'part': new FormControl(part, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      'machine': new FormControl(machine, Validators.required),
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing),
    });
  }

  onSubmit(){
    this.part = this.editPartForm.value;
    this.editPart(this.part);
  }

  editPart(data: Part) {
    this.isError = false;
    this.partServ.changePart(data, this.id).subscribe(()=>{},
    () =>{
      this.isError = true;
    });
    if (this.isError){
      this.error = "That job already exsists on that machine!";
    }else{
      setTimeout(
        ()=>{
          this.partServ.partChanged.next();
          this.router.navigate(["../.."], {relativeTo: this.route})
        }, 50
      );
    }
  }

  onCancel(){
    window.history.back();;
  }

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.part.part+ "?")){
      this.partServ.deletePart(this.id).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}