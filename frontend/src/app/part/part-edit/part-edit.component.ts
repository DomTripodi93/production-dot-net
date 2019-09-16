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
  partNum: string;
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
      this.partNum = params['part'];
    });
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.partServ.fetchPart(this.partNum)
      .subscribe(part => {
        this.part = part[0];
        this.initForm();
      });
    });
  }


  private initForm() {
    let part = this.part.partNumber;

    this.editPartForm = new FormGroup({
      'partNumber': new FormControl(part, Validators.required)
    });
  }

  onSubmit(){
    this.part = this.editPartForm.value;
    this.editPart(this.part);
  }

  editPart(data: Part) {
    this.isError = false;
    this.partServ.changePart(data, this.partNum).subscribe(()=>{},
    () =>{
      this.isError = true;
    });
    if (this.isError){
      this.error = "That part already exists!";
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
    if (confirm("Are you sure you want to delete " +this.part.partNumber + "?")){
      this.partServ.deletePart(this.partNum).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}