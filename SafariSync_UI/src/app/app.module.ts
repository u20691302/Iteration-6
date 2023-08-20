import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewSupplierComponent } from './components/supplier/view-supplier/view-supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { LoginComponent } from './components/user/login/login.component';

import { SendRegisterLinkComponent } from './components/user/send-register-link/send-register-link.component';

import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes } from '@angular/router';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgToastModule } from 'ng-angular-popup';
import { NavbarstuffComponent } from './navbar/navbarstuff/navbarstuff.component';
import { AuthGuard } from './components/user/guards/auth.guard';
import { UserService } from './services/user/user.service';
import { MyprofileComponent } from './components/user/myprofile/myprofile.component';
import { EditdetailsComponent } from './components/user/editdetails/editdetails.component';
import { RegisterAdminComponent } from './components/user/register-admin/register-admin.component';
import { ViewDashboardComponent } from './components/dashboard/view-dashboard/view-dashboard.component';
import { UsernavbarComponent } from './components/usernavbar/usernavbar.component';
import { ViewReportsComponent } from './components/reporting/view-reports/view-reports.component';
import { GenerateUserReportComponent } from './components/reporting/generate-user-report/generate-user-report/generate-user-report.component';

const routes: Routes = [
  // Existing routes...
  {
    path: 'assets/PDFs/:pdfName',
    component: PdfViewerComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ViewSupplierComponent,
    ViewContractorComponent,
    ViewSkillsComponent,
    ViewUserComponent,
    ViewEquipmentComponent,
    ViewStockComponent,
    ViewActivityComponent,
    ViewToolboxComponent,
    ViewScheduleActivityComponent,
    MyprofileComponent,
    EditdetailsComponent,
    RegisterAdminComponent,
    NavbarstuffComponent,
    LoginComponent,
    HelpComponent,
    PageComponent,
    PdfViewerComponent,
    ForgotPasswordComponent,
    SendRegisterLinkComponent,
    ViewDashboardComponent,
    UsernavbarComponent,
    ViewReportsComponent,
    GenerateUserReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    NgbModalModule,
    ReactiveFormsModule,
    CommonModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    NgToastModule
  ],
  providers: [UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
