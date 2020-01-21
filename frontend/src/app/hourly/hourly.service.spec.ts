import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DaysService } from '../shared/days/days.service';
import { HourlyService } from './hourly.service';
import { AuthService } from '../shared/auth.service';
import { OpService } from '../job/job-ops/operation.service';
import { Hourly } from './hourly.model';
import { defer } from 'rxjs';
import {_} from 'lodash';

  
function isNotEqual(set1, set2){
  let props1 = Object.getOwnPropertyNames(set1);
  let props2 = Object.getOwnPropertyNames(set2);
  if (props1.length === props2.length){
    let count = 0
    props1.forEach(prop =>{
      if (set1[prop]==set2[prop]){
        count++
        if (count == props1.length){
          return false;
        }
      } else {
        return true;
      }
    })
  } else {
    return true;
  }
}


describe('HourlyService testing', () => {
  let clientSpy: { get: jasmine.Spy};
  let hourServ: HourlyService;
  let authServ: AuthService;
  let opServ: OpService;
  let daysServ: DaysService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        providers:[
            HourlyService,
            DaysService,
            AuthService,
            OpService
        ],
        imports:[
            HttpClientTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    clientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete'])
    authServ = new AuthService(<any> clientSpy);
    daysServ = new DaysService();
    opServ = new OpService(<any> clientSpy, authServ, daysServ);
    hourServ = new HourlyService(<any> clientSpy, authServ, opServ, daysServ);
  });

  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

  it('can get hourly for machine and date', (done)=>{
    const postStubHourly: Hourly = {
      id: 1,
      quantity: 54,
      counterQuantity: 57,
      jobNumber: "1234",
      opNumber: "2-3",
      date: "2020-07-20",
      time: "10:15PM",
      machine: "something-random",
      shift: "day",
      startTime: "10:00PM"
    }

    clientSpy.get.and.returnValue(asyncData([postStubHourly]));
    hourServ.fetchHourly("date=2020-07-27&machine=something-random").subscribe(
      hourly =>{
        expect(hourly.length == 1).toBeTruthy(), 
        fail;
        done();
      }
    );
  })

  it('can return hourly with display values for machine and date', (done)=>{
    const postStubHourly: Hourly = {
      id: 1,
      quantity: 54,
      counterQuantity: 57,
      jobNumber: "1234",
      opNumber: "2-3",
      date: "2020-07-20",
      time: "10:15PM",
      machine: "something-random",
      shift: "day",
      startTime: "10:00PM"
    }

    const getStubHourly: Hourly = {
      id: 1,
      quantity: 54,
      counterQuantity: 57,
      jobNumber: "1234",
      opNumber: "2/3",
      date: "2020-07-20",
      time: "10:15PM",
      machine: "something random",
      shift: "day",
      startTime: "10:00PM"
    }

    clientSpy.get.and.returnValue(asyncData([postStubHourly]));
    hourServ.fetchHourly("date=2020-07-27&machine=something-random").subscribe(
      hourly =>{
        expect(!isNotEqual(hourly[0], getStubHourly)).toBeTruthy(), 
        fail;
        done();
      }
    );
  })

  it('can return hourly with display values by id', (done)=>{
    const postStubHourly2: Hourly = {
      id: 2,
      quantity: 54,
      counterQuantity: 57,
      jobNumber: "1234",
      opNumber: "2-3",
      date: "2020-07-20",
      time: "10:15PM",
      machine: "something-random",
      shift: "day",
      startTime: "10:00PM"
    }

    const getStubHourly: Hourly = {
      id: 2,
      quantity: 54,
      counterQuantity: 57,
      jobNumber: "1234",
      opNumber: "2/3",
      date: "2020-07-20",
      time: "10:15PM",
      machine: "something random",
      shift: "day",
      startTime: "10:00PM"
    }

    clientSpy.get.and.returnValue(asyncData(postStubHourly2));
    hourServ.fetchHourlyById(2).subscribe(
      hourly =>{
        expect(!isNotEqual(hourly, getStubHourly)).toBeTruthy(), 
        fail;
        done();
      }
    );
  })
  
});
