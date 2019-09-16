import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProductionService } from '../production.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-production-by-job',
  templateUrl: './production-by-job.component.html',
  styleUrls: ['./production-by-job.component.css']
})
export class ProductionByJobComponent implements OnInit, OnDestroy{
  @ViewChild('data') jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(){
    let job = this.jobForm.value.jobNumber
    let machine =""
    if (this.jobForm.value.machine){
      machine = this.jobForm.value.machine
      machine = "&machine="+this.auth.splitJoin(machine)
    }
    let movement = "../"+job+machine;
    this.router.navigate([movement], {relativeTo: this.route})
  }

  onCancel(){
    window.history.back();
  }

  ngOnInit(){
    this.auth.hideButton(1);
  }

  ngOnDestroy(){
    this.auth.showButton(1);
  }
}
