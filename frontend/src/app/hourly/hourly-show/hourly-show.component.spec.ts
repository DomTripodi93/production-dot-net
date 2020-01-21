import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyShowComponent } from './hourly-show.component';
import { HourlyService } from '../hourly.service';
import { HourlyNewShortComponent } from '../hourly-new-short/hourly-new-short.component';
import { HourlyEditComponent } from '../hourly-edit/hourly-edit.component';
import { MachineEditComponent } from '../../machine/machine-edit/machine-edit.component';
import { HourlyShowEachComponent } from './hourly-show-each/hourly-show-each.component';
import { HourlySetTimeComponent } from '../hourly-set-time/hourly-set-time.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Machine } from 'src/app/machine/machine.model';

describe('HourlyShowComponent', () => {
  let component: HourlyShowComponent;
  let fixture: ComponentFixture<HourlyShowComponent>;
  let hourServ: HourlyService;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        providers:[
            HourlyService
        ],
        imports:[
            ReactiveFormsModule,
            FormsModule,
            HttpClientTestingModule
        ],
        declarations: [ 
            HourlyShowComponent,
            HourlyNewShortComponent,
            HourlyEditComponent,
            HourlyShowEachComponent,
            HourlySetTimeComponent,
            MachineEditComponent
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change quick[0] to true', () => {
    let fakeMach: Machine = {
        id: 1,
        machine: "something",
        currentJob: "12412",
        currentOp: "15125"
    }
    component.machines.push(fakeMach);
    component.quickInput(0);
    hourServ = TestBed.get(HourlyService);
    expect(
        hourServ.quick[0] == true 
        && hourServ.jobNumber == fakeMach.currentJob
        && hourServ.opNumber == fakeMach.currentOp
        && hourServ.machine == fakeMach
    ).toBeTruthy();
  });

  it('should change quick[0] to false', () => {
    let fakeMach: Machine = {
        id: 1,
        machine: "something",
        currentJob: "12412",
        currentOp: "15125"
    }
    component.machines.push(fakeMach);
    component.quickInput(0);
    component.onCancel(0);
    hourServ = TestBed.get(HourlyService);
    expect(
        hourServ.quick[0] == false 
        && hourServ.jobNumber == fakeMach.currentJob
        && hourServ.opNumber == fakeMach.currentOp
        && hourServ.machine == fakeMach
    ).toBeTruthy();
  });

});
