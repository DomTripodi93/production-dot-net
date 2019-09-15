import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { MachineService } from 'src/app/machine/machine.service';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-machine-new',
  templateUrl: './machine-new.component.html',
  styleUrls: ['./machine-new.component.css']
})
export class MachineNewComponent implements OnInit {
  error = '';
  canInput= false;
  machineForm: FormGroup;
  isError = false;
  jobs = [];
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.initForm();
    this.auth.hideButton(0);
  }
    
  private initForm() {
    let machine = '';
    this.jobs = ["None"];
    this.jobServ.fetchAllJobs().subscribe(response =>{
      response.forEach(job => {
        this.jobs.push(job.job)
      });
    })

    this.machineForm = new FormGroup({
      'machine': new FormControl(machine, Validators.required),
      'currentJob': new FormControl(this.jobs[0])
    });
  }
  
  onSubmit(){
    this.newMachine(this.machineForm.value);
  }

  newMachine(data: Machine) {
    this.mach.addMachine(data).subscribe(()=>{
      this.mach.machChanged.next();
    }, () =>
      this.error = "This machine already exists"
    );
    if (this.error){
      this.isError = true;
    }else{
      setTimeout(()=>{
      this.router.navigate([".."], {relativeTo: this.route})},50);
    }
    

  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
