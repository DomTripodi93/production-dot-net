import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CalenderComponent } from './shared/calender/calender.component';
import { AppRouteModule } from './app-routing.module';
import { DaysComponent } from './shared/days/days.component';
import { ProductionComponent } from './production/production.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './register/signin/signin.component';
import { SignoutComponent } from './register/signout/signout.component';
import { HeaderComponent } from './shared/header/header.component';
import { ProductionNewComponent } from './production/production-new/production-new.component';
import { ProductionEditComponent } from './production/production-edit/production-edit.component';
import { HourlyComponent } from './hourly/hourly.component';
import { HourlyNewComponent } from './hourly/hourly-new/hourly-new.component';
import { HourlyShowComponent } from './hourly/hourly-show/hourly-show.component';
import { HourlyEditComponent } from './hourly/hourly-edit/hourly-edit.component';
import { MachineComponent } from './machine/machine.component';
import { MachineNewComponent } from './machine/machine-new/machine-new.component';
import { MachineShowComponent } from './machine/machine-show/machine-show.component';
import { MachineEditComponent } from './machine/machine-edit/machine-edit.component';
import { ProductionSingleComponent } from './production/production-single/production-single.component';
import { PartComponent } from './part/part.component';
import { PartShowComponent } from './part/part-show/part-show.component';
import { PartNewComponent } from './part/part-new/part-new.component';
import { PartFindComponent } from './part/part-find/part-find.component';
import { PartFindShowComponent } from './part/part-find/part-find-show/part-find-show.component';
import { HourlyFindComponent } from './hourly/hourly-find/hourly-find.component';
import { HourlyFindShowComponent } from './hourly/hourly-find/hourly-find-show/hourly-find-show.component';
import { ChangeLogComponent } from './shared/change-log/change-log.component';
import { DaysHourlyComponent } from './shared/days/days-hourly/days-hourly.component';
import { DaysFullComponent } from './shared/days/days-full/days-full.component';
import { HourlyNewShortComponent } from './hourly/hourly-new-short/hourly-new-short.component';
import { HourlyShowEachComponent } from './hourly/hourly-show/hourly-show-each/hourly-show-each.component';
import { CalculatorComponent } from './job/calculator/calculator.component';
import { ByWeightComponent } from './job/calculator/by-weight/by-weight.component';
import { RemainingComponent } from './job/calculator/remaining/remaining.component';
import { JobTotalComponent } from './job/calculator/job-total/job-total.component';
import { ChangeLogSetComponent } from './shared/change-log/change-log-set/change-log-set.component';
import { LengthComponent } from './job/calculator/by-weight/length/length.component';
import { AuthInterceptorService } from './shared/auth-interceptor.service';
import { DropdownDirective } from './shared/dropdown.directive';
import { TutorialComponent } from './shared/tutorial/tutorial.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { JobComponent } from './job/job.component';
import { JobNewComponent } from './job/job-new/job-new.component';
import { JobFindComponent } from './job/job-find/job-find.component';
import { JobFindShowComponent } from './job/job-find/job-find-show/job-find-show.component';
import { JobEditComponent } from './job/job-edit/job-edit.component';
import { JobShowComponent } from './job/job-show/job-show.component';
import { WelcomeComponent } from './shared/welcome/welcome.component';
import { JobOpsShowComponent } from './job/job-ops/job-ops-show/job-ops-show.component';
import { JobOpsNewComponent } from './job/job-ops/job-ops-new/job-ops-new.component';
import { JobOpsEditComponent } from './job/job-ops/job-ops-edit/job-ops-edit.component';
import { ProductionFindComponent } from './production/production-find/production-find.component';
import { ProductionFindShowComponent } from './production/production-find/production-find-show/production-find-show.component';
import { HourlySetTimeComponent } from './hourly/hourly-set-time/hourly-set-time.component';
import { ChangeValueComponent } from './shared/settings/change-value/change-value.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ProductionTotalComponent } from './production/production-total/production-total.component';
import { ProductionMillMachComponent } from './production/production-by-machine/production-mill-mach/production-mill-mach.component';
import { ProductionMillJobComponent } from './production/production-by-machine/production-mill-job/production-mill-job.component';
import { ProductionMillOpComponent } from './production/production-by-machine/production-mill-op/production-mill-op.component';
import { ProductionByMachineComponent } from './production/production-by-machine/production-by-machine.component';
import { ProductionCalenderComponent } from './production/production-by-machine/production-calender/production-calender.component';
import { ProductionDayComponent } from './production/production-by-machine/production-day/production-day.component';
import { ProductionQuantityComponent } from './production/production-quantity/production-quantity.component';

@NgModule({
  declarations: [
    AppComponent,
    CalenderComponent,
    DaysComponent,
    ProductionComponent,
    RegisterComponent,
    SigninComponent,
    SignoutComponent,
    HeaderComponent,
    ProductionNewComponent,
    ProductionEditComponent,
    HourlyComponent,
    HourlyNewComponent,
    HourlyShowComponent,
    HourlyEditComponent,
    MachineComponent,
    MachineNewComponent,
    MachineShowComponent,
    MachineEditComponent,
    ProductionSingleComponent,
    PartComponent,
    PartShowComponent,
    PartNewComponent,
    PartFindComponent,
    PartFindShowComponent,
    HourlyFindComponent,
    HourlyFindShowComponent,
    ChangeLogComponent,
    DaysHourlyComponent,
    DaysFullComponent,
    HourlyNewShortComponent,
    HourlyShowEachComponent,
    CalculatorComponent,
    ByWeightComponent,
    RemainingComponent,
    JobTotalComponent,
    ChangeLogSetComponent,
    LengthComponent,
    DropdownDirective,
    TutorialComponent,
    SettingsComponent,
    JobComponent,
    JobNewComponent,
    JobFindComponent,
    JobFindShowComponent,
    JobEditComponent,
    JobShowComponent,
    WelcomeComponent,
    JobOpsEditComponent,
    JobOpsNewComponent,
    JobOpsShowComponent,
    ProductionFindComponent,
    ProductionFindShowComponent,
    HourlySetTimeComponent,
    ChangeValueComponent,
    FooterComponent,
    ProductionTotalComponent,
    ProductionMillMachComponent,
    ProductionMillJobComponent,
    ProductionMillOpComponent,
    ProductionByMachineComponent,
    ProductionCalenderComponent,
    ProductionDayComponent,
    ProductionQuantityComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRouteModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
