import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalenderComponent } from './shared/calender/calender.component';
import { DaysComponent } from './shared/days/days.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './register/signin/signin.component';
import { SignoutComponent } from './register/signout/signout.component';
import { ProductionComponent } from './production/production.component';
import { ProductionNewComponent } from './production/production-new/production-new.component';
import { ProductionEditComponent } from './production/production-edit/production-edit.component';
import { ProductionListComponent } from './production/production-list/production-list.component';
import { ProductionByJobSelectComponent } from './production/production-by-job/production-by-job-select/production-by-job-select.component';
import { ProductionByJobComponent } from './production/production-by-job/production-by-job.component';
import { ProductionSingleComponent } from './production/production-single/production-single.component';
import { MachineComponent } from './machine/machine.component';
import { MachineShowComponent } from './machine/machine-show/machine-show.component';
import { MachineEditComponent } from './machine/machine-edit/machine-edit.component';
import { MachineNewComponent } from './machine/machine-new/machine-new.component';
import { PartComponent } from './part/part.component';
import { PartShowComponent } from './part/part-show/part-show.component';
import { PartEditComponent } from './part/part-edit/part-edit.component';
import { PartNewComponent } from './part/part-new/part-new.component';
import { HourlyShowComponent } from './hourly/hourly-show/hourly-show.component';
import { HourlyComponent } from './hourly/hourly.component';
import { HourlyEditComponent } from './hourly/hourly-edit/hourly-edit.component';
import { HourlyNewComponent } from './hourly/hourly-new/hourly-new.component';
import { PartFindComponent } from './part/part-find/part-find.component';
import { PartFindShowComponent } from './part/part-find/part-find-show/part-find-show.component';
import { HourlyFindComponent } from './hourly/hourly-find/hourly-find.component';
import { HourlyFindShowComponent } from './hourly/hourly-find/hourly-find-show/hourly-find-show.component';
import { DaysHourlyComponent } from './shared/days/days-hourly/days-hourly.component';
import { DaysFullComponent } from './shared/days/days-full/days-full.component';
import { RemainingComponent } from './job/calculator/remaining/remaining.component';
import { ByWeightComponent } from './job/calculator/by-weight/by-weight.component';
import { JobTotalComponent } from './job/calculator/job-total/job-total.component';
import { ChangeLogComponent } from './change-log/change-log.component';
import { CalculatorComponent } from './job/calculator/calculator.component';
import { LengthComponent } from './job/calculator/by-weight/length/length.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { AuthGuard } from './guards/auth.guard';
import { JobComponent } from './job/job.component';
import { JobShowComponent } from './job/job-show/job-show.component';
import { JobEditComponent } from './job/job-edit/job-edit.component';
import { JobNewComponent } from './job/job-new/job-new.component';
import { JobFindComponent } from './job/job-find/job-find.component';
import { OperationComponent } from './operation/operation.component';
import { OpShowComponent } from './operation/op-show/op-show.component';
import { OpEditComponent } from './operation/op-edit/op-edit.component';
import { OpNewComponent } from './operation/op-new/op-new.component';
import { OpFindComponent } from './operation/op-find/op-find.component';
import { OpFindShowComponent } from './operation/op-find/op-find-show/op-find-show.component';

const appRoutes: Routes = [
    {path: '', component: CalenderComponent, pathMatch: 'full' },
    {path: 'register', component: RegisterComponent },
    {path: 'login', component: SigninComponent},
    {path: "", runGuardsAndResolvers: "always", canActivate: [AuthGuard], children: [
        {path: 'settings', component: SettingsComponent },
        {path: 'day/:year/:month/:day', component: DaysComponent, children:[
            {path: '', component: DaysFullComponent},
            {path: 'hourly', component: DaysHourlyComponent}
        ]},
        {path: 'machine', component: MachineComponent, children:[
            {path: '', component: MachineShowComponent},
            {path: 'edit/:mach', component: MachineEditComponent},
            {path: 'new', component: MachineNewComponent}
        ]},
        {path: 'parts', component: PartComponent, children:[
            {path: '', component: PartShowComponent},
            {path: 'edit/:part', component: PartEditComponent},
            {path: 'new', component: PartNewComponent},
            {path: 'find', component: PartFindComponent},
            {path: ":part", component: PartFindShowComponent},
        ]},
        {path: 'jobs', component: JobComponent, children:[
            {path: '', component: JobShowComponent},
            {path: 'edit/:job', component: JobEditComponent},
            {path: 'new', component: JobNewComponent},
            {path: 'find', component: JobFindComponent},
            {path: "calculator", component: CalculatorComponent, children:[
                {path: "", component: LengthComponent},
                {path: "weight/:jobNum", component: ByWeightComponent},
                {path: "job/:jobNum", component: JobTotalComponent},
                {path: ":jobNum", component: RemainingComponent},
            ]},
            {path: ":job", component: PartFindShowComponent},
        ]},
        {path: 'op', component: OperationComponent, children:[
            {path: '', component: OpShowComponent},
            {path: 'edit/:part', component: OpEditComponent},
            {path: 'new', component: OpNewComponent},
            {path: 'find', component: OpFindComponent},
            {path: ":part", component: OpFindShowComponent},
        ]},
        {path: 'production', component: ProductionComponent, children:[
            {path: '', component: ProductionListComponent},
            {path: 'new', component: ProductionNewComponent},
            {path: 'find', component: ProductionByJobComponent},
            {path: 'single/:id', component: ProductionSingleComponent},
            {path: 'single/:id/edit', component: ProductionEditComponent},
            {path: ":job", component: ProductionByJobSelectComponent},
        ]},
        {path: 'hourly', component: HourlyComponent, children:[
            {path: '', component: HourlyShowComponent},
            {path: 'edit/:id', component: HourlyEditComponent},
            {path: 'find', component: HourlyFindComponent},
            {path: 'find/:search', component: HourlyFindShowComponent},
            {path: 'new', component: HourlyNewComponent},
        ]},
        {path: 'changes', component: ChangeLogComponent},
        {path: 'logout', component: SignoutComponent}
    ]},
    {path: "**", redirectTo:"/", pathMatch: "full"}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRouteModule {

}