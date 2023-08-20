import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSupplierComponent } from './components/supplier/view-supplier/view-supplier.component';
import { ViewContractorComponent } from './components/contractor/view-contractor/view-contractor.component';
import { ViewSkillsComponent } from './components/skills/view-skills/view-skills.component';
import { ViewUserComponent } from './components/User1/view-user/view-user.component';
import { ViewEquipmentComponent } from './components/equipment/view-equipment/view-equipment.component';
import { ViewStockComponent } from './components/stock/view-stock/view-stock.component';
import { ViewActivityComponent } from './components/activity/view-activity/view-activity.component';
import { ViewToolboxComponent } from './components/Toolbox/view-toolbox/view-toolbox.component';
import { ViewScheduleActivityComponent } from './components/schedule-activity/view-schedule-activity/view-schedule-activity.component';
import { HelpComponent } from './components/help/help.component';
import { PageComponent } from './components/page/page.component';
import { EditdetailsComponent } from './components/user/editdetails/editdetails.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { AuthGuard } from './components/user/guards/auth.guard';
import { LoginComponent } from './components/user/login/login.component';
import { MyprofileComponent } from './components/user/myprofile/myprofile.component';
import { RegisterAdminComponent } from './components/user/register-admin/register-admin.component';
import { SendRegisterLinkComponent } from './components/user/send-register-link/send-register-link.component';
import { ViewDashboardComponent } from './components/dashboard/view-dashboard/view-dashboard.component';
import { RoleGuard } from './components/user/guards/role.guard';
import { ViewReportsComponent } from './components/reporting/view-reports/view-reports.component';
import { GenerateUserReportComponent } from './components/reporting/generate-user-report/generate-user-report/generate-user-report.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', pathMatch: 'full' 
  },
  { 
    path: 'myprofile', 
    component: MyprofileComponent , canActivate: [AuthGuard]
  },
  { 
    path: 'editdetails', 
    component: EditdetailsComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'register-admin', 
    component: RegisterAdminComponent
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'help', 
    component: HelpComponent , canActivate: [AuthGuard]
  },
  { 
    path: 'page', 
    component: PageComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent
  },
  { 
    path: 'send-registration-link' , 
    component:SendRegisterLinkComponent
  },
  {
    path:'suppliers',
    component: ViewSupplierComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'contractors',
    component: ViewContractorComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'skills',
    component: ViewSkillsComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'users',
    component: ViewUserComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'equipment',
    component: ViewEquipmentComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'stock',
    component: ViewStockComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'activity',
    component: ViewActivityComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'toolbox',
    component: ViewToolboxComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'scheduleActivity',
    component: ViewScheduleActivityComponent, canActivate: [AuthGuard]
  },
  {
    path:'dashboard',
    component: ViewDashboardComponent, canActivate: [AuthGuard]
  },
  {
    path:'reporting',
    component: ViewReportsComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/userReport',
    component: GenerateUserReportComponent, canActivate: [AuthGuard, RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }