import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductionService } from 'src/app/production/production.service';

@Component({
  selector: 'app-production-single',
  templateUrl: './production-single.component.html',
  styleUrls: ['./production-single.component.css']
})
export class ProductionSingleComponent implements OnInit {
  id = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pro: ProductionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.id = params['id'];
    });
  } 

  onDelete(){
    if (confirm("Are you sure you want to delete this lot?")){
      this.pro.deleteProduction(this.id).subscribe();
      this.pro.proChanged.next();
      this.router.navigate(["../.."], {relativeTo: this.route})
    }
  }

}
