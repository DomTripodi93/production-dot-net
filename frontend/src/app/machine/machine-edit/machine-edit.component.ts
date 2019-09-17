import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { JobService } from 'src/app/job/job.service';
import { OpService } from 'src/app/operation/operation.service';

@Component({
  selector: 'app-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.css']
})
export class MachineEditComponent implements OnInit {
  editMachineForm: FormGroup;
  machine: Machine;
  machName: string;
  canInput = false;
  jobs = ["None"];
  ops = ["None"];
  opSet: string[][] = [["None"]];
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.machName = params['mach'];
    });
    this.mach.fetchMachineByName(this.machName)
    .subscribe(machine => {
      this.machine = machine;
      this.initForm();
    });
    this.jobServ.fetchAllJobs().subscribe(response =>{
      let goneThrough = 0;
      if (response.length==0){
        this.initForm();
      } else {
        response.forEach(job => {
          this.jobs.push(job.jobNumber)
          goneThrough++;
          if (goneThrough == response.length){
            let jobsUsed = 0;
            for (let job in this.jobs){
              if (job != "0"){
                this.opServ.fetchOpByJob("job=" + this.jobs[job]).subscribe((op)=>{
                  op.forEach((set)=>{
                    this.ops.push(set.opNumber);
                  })
                  this.opSet.push(this.ops);
                  this.ops = ["none"];
                  if (jobsUsed == this.jobs.length){
                    this.initForm();
                  }
                }, ()=>{
                  this.opSet.push(this.ops);
                  this.initForm();
                });
              }
              jobsUsed++;
            }
          }
        });
      }
    });
  }


  private initForm() {

    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.machine.currentJob),
      'currentOp': new FormControl(this.machine.currentOp)
    });
  }

  onSubmit(){
    this.editMachineForm.value.currentJob = this.jobs[this.editMachineForm.value.currentJob];
    this.editMachine(this.editMachineForm.value);
  }

  editMachine(data) {
    console.log(data)
    this.mach.setCurrentJob(data, this.machName).subscribe(()=>{
      this.mach.machChanged.next();
    });
    setTimeout(
      ()=>{
        this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
  }

  onCancel(){
    window.history.back();;
  }

  changeOps(option: number){
    if (this.opSet){
      this.ops = this.opSet[option];
    }
  }

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.machine.machine+ "?")){
      this.mach.deleteMachine(this.machName).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}