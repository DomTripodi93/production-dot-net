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
  id: number;
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
      this.id = +params['id'];
    });
    this.mach.fetchMachineById(this.id)
    .subscribe(machine => {
      this.machine = machine;
      this.initForm();
    });
  }


  private initForm() {
    let machine = this.machine.machine;
    this.jobs = [this.machine.currentJob];
    this.jobServ.fetchAllJobs().subscribe(response =>{
      response.forEach(job => {
        if (job.job == this.machine.currentJob){
          this.jobs.push(job.job)
        }else {
          this.jobs.push(job.job)
        }
      });
    })

    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.jobs[0]),
      'machine': new FormControl(machine, Validators.required)
    });
  }

  onSubmit(){
    this.machine = this.editMachineForm.value;
    this.editMachine(this.machine);
  }

  editMachine(data: Machine) {
    this.mach.changeMachine(data, this.id).subscribe(()=>{
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
      this.mach.deleteMachine(this.id).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}