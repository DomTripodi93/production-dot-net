import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/production/production.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

}
