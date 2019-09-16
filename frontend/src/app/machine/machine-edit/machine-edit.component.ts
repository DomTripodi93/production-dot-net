import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { JobService } from 'src/app/job/job.service';

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
  jobs = [];
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
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
  }


  private initForm() {
    this.jobs = [this.machine.currentJob];
    this.jobServ.fetchAllJobs().subscribe(response =>{
      response.forEach(job => {
        if (job.jobNumber == this.machine.currentJob){
          this.jobs.push(job.jobNumber)
        }else {
          this.jobs.push(job.jobNumber)
        }
      });
    })

    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.jobs[0])
    });
  }

  onSubmit(){
    this.machine = this.editMachineForm.value;
    this.editMachine(this.machine);
  }

  editMachine(data: Machine) {
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

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.machine.machine+ "?")){
      this.mach.deleteMachine(this.machName).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}