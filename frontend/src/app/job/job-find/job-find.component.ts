import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-job-find',
  templateUrl: './job-find.component.html',
  styleUrls: ['./job-find.component.css']
})
export class JobFindComponent implements OnInit, OnDestroy{
  @ViewChild('data', {static:false}) jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(){
    let search: string;
    if (this.jobForm.value.job){
      search = (""+this.jobForm.value.job);
    } else if (this.jobForm.value.part){
      search = ("part="+this.jobForm.value.part);
    }
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
