import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpService } from '../operation.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-op-find',
  templateUrl: './op-find.component.html',
  styleUrls: ['./op-find.component.css']
})
export class OpFindComponent implements OnInit , OnDestroy{
  @ViewChild('data') jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private operationServe: OpService,
    private auth: AuthService
  ) {}

  onSubmit(){
    let operation = this.jobForm.value.operation
    let machine ="";
    let job ="";
    let searchHold = [];
    if (this.jobForm.value.job){
      job = this.jobForm.value.job;
      searchHold.push("job="+job);
    }
    if (this.jobForm.value.operation){
      operation = this.jobForm.value.operation;
      searchHold.push("operation="+operation);
    }
    if (this.jobForm.value.machine){
      machine = this.jobForm.value.machine;
      searchHold.push("machine="+this.auth.splitJoin(machine));
    }
    let search = searchHold.join("&");
    let movement = "../"+search;
    this.router.navigate([movement], {relativeTo: this.route});
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
