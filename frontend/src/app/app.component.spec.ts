import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { TutorialComponent } from './shared/tutorial/tutorial.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientTestingModule
        ],
        declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        TutorialComponent
      ],
    }).compileComponents();
  }));
  

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Production Management'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Production Management');
  });

});
