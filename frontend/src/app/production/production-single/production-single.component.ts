import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-production-single',
  templateUrl: './production-single.component.html',
  styleUrls: ['./production-single.component.css']
})
export class ProductionSingleComponent implements OnInit {
  id = '';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.id = params['id'];
    });
  } 

}
