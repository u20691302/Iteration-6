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
import { GenerateUserReportComponent } from './components/reporting/generate-user-report/generate-user-report.component';
import { ViewPreviousReportsComponent } from './components/reporting/view-previous-reports/view-previous-reports.component';
import { GenerateStockReportComponent } from './components/reporting/generate-stock-report/generate-stock-report/generate-stock-report.component';
import { GenerateEquipmentReportComponent } from './components/reporting/generate-equipment-report/generate-equipment-report.component';
import { GenerateInventoryQuantitiesComponent } from './components/reporting/generate-inventory-quantities/generate-inventory-quantities.component';
import { GeneratePerformanceComponent } from './components/reporting/generate-performance/generate-performance.component';
import { GeneratePersonnelReportComponent } from './components/reporting/generate-personnel-report/generate-personnel-report.component';
import { GenerateDynamicStockReportComponent } from './components/reporting/dynamic-report/generate-dynamic-stock-report.component';
import { RatingSettingsComponent } from './components/rating-settings/rating-settings.component';
import { RegisterGuard } from './components/user/guards/register.guard';
import { RegisterFarmworkerComponent } from './components/user/register-farmworker/register-farmworker.component';
import { RegisterSupervisorComponent } from './components/user/register-supervisor/register-supervisor.component';
import { AuditActionRecordsComponent } from './components/audit-action-records/audit-action-records.component';
import { TimeoutSettingsComponent } from './components/timeout-settings/timeout-settings.component';
import { UserService } from 'src/app/services/user/user.service';


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
    path: 'register-supervisor', 
    component: RegisterSupervisorComponent
  },
  { 
    path: 'register-farmworker', 
    component: RegisterFarmworkerComponent
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
  {
    path:'reporting/stockReport',
    component: GenerateStockReportComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/equipmentReport',
    component: GenerateEquipmentReportComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/inventoryReport',
    component: GenerateInventoryQuantitiesComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/performanceReport',
    component: GeneratePerformanceComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/personnelReport',
    component: GeneratePersonnelReportComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'reporting/dynamicReport',
    component: GenerateDynamicStockReportComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'previousReport',
    component: ViewPreviousReportsComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'ratingSettings',
    component: RatingSettingsComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'audit',
    component: AuditActionRecordsComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path:'timeout-settings',
    component: TimeoutSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// , canActivate: [RegisterGuard]