import { Component, OnInit, OnDestroy } from '@angular/core';
import { Part } from '../part.model';
import { Subscription } from 'rxjs';
import { PartService } from '../part.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-part-show',
  templateUrl: './part-show.component.html',
  styleUrls: ['./part-show.component.css']
})
export class PartShowComponent implements OnInit, OnDestroy{
  parts: Part[] = [];
  subscriptions: Subscription[] =[];
  isFetching = false;
  isError = false;
  error = '';

  constructor(
    private partServ: PartService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getParts();
    this.subscriptions.push(this.partServ.partChanged.subscribe(()=>{
      setTimeout(()=>{this.getParts()}, 50);
    }));
  }

  getParts(){
    this.subscriptions.push(this.partServ.fetchAllParts()
    .subscribe(parts => {
      this.parts = parts;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }


  onDelete(part, id){
    if (confirm("Are you sure you want to delete " +part+ "?")){
      this.partServ.deletePart(id).subscribe(()=>{
        this.partServ.partChanged.next();
      });
    }
  }

  ngOnDestroy(){
    this.parts = [];
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    })
  }

}