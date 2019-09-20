import { Component, OnInit } from '@angular/core';
import { MachineService } from 'src/app/machine/machine.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Operation } from '../operation.model';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from '../operation.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-op-edit',
  templateUrl: './op-edit.component.html',
  styleUrls: ['./op-edit.component.css']
})
export class OpEditComponent implements OnInit {
  editOpForm: FormGroup;
  operation: Operation;
  search: string;
  canInput = false;
  isError = false;
  error = "";
  machines: Machine[] = [];
  
  constructor(
    private operationServ: OpService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private mach: MachineService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.search = params['opInfo'];
    });
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.operationServ.fetchOp(this.search)
      .subscribe(operation => {
        console.log(operation)
        this.operation = operation;
        this.initForm();
      });
    });
  }


  private initForm() {
    let machine = this.operation.machine;
    let cycleTime = this.operation.cycleTime;

    this.editOpForm = new FormGroup({
      'cycleTime': new FormControl(cycleTime),
      'machine': new FormControl(machine)
    });
  }

  onSubmit(){
    this.operation = this.editOpForm.value;
    this.editOp(this.operation);
  }

  editOp(data: Operation) {
    this.isError = false;
    this.operationServ.changeOp(data, this.search).subscribe(()=>{},
    () =>{
      this.isError = true;
    });
    if (this.isError){
      this.error = "That job already exists on that machine!";
    }else{
      setTimeout(
        ()=>{
          this.operationServ.operationChanged.next();
          this.router.navigate(["../.."], {relativeTo: this.route})
        }, 50
      );
    }
  }

  onCancel(){
    window.history.back();;
  }

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.operation.opNumber + "from job # " + this.operation.jobNumber + "?")){
      this.operationServ.deleteOp(this.search).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }

}
