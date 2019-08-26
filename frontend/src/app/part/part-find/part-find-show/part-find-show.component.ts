import { Component, OnInit } from '@angular/core';
import { Part } from '../../part.model';
import { Subscription } from 'rxjs';
import { PartService } from '../../part.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from '../../../shared/days/days.service';

@Component({
  selector: 'app-part-find-show',
  templateUrl: './part-find-show.component.html',
  styleUrls: ['./part-find-show.component.css']
})
export class PartFindShowComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  parts: Part[] = [];
  part = "";
  id = '';
  subscription = new Subscription;
  subscription2 = new Subscription;

  constructor(
    private auth: AuthService,
    private partServ: PartService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscription2 = this.route.params.subscribe((params: Params) =>{
      this.part = params['part'];
      this.getOnePart();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  }

  onDelete(part, id){
    if (confirm("Are you sure you want to delete " +part+ "?")){
      this.partServ.deletePart(id).subscribe(()=>{
      setTimeout(()=>{this.getOnePart()},)}
      );
      this.partServ.partChanged.next();
    }
  }

  getOnePart() {
    this.isFetching = true;
    this.partServ.fetchPart(this.part)
      .subscribe(part => {
        this.parts = part;
        this.dayServ.dates = [];
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
