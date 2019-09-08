import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BubblechartComponent } from './dashboard/bubblechart/bubblechart.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule, MatOptionModule, MatSelectModule, MatAutocompleteModule, MatFormFieldModule, MatTabsModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LinkChartComponent } from './dashboard/link-chart/link-chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { D3Service } from './Services/d3.service';
import { StyleService } from './Services/style.service';
import { TabsComponent } from './dashboard/tabs/tabs.component';

@NgModule({
  declarations: [
    AppComponent,
    BubblechartComponent,
    MainNavComponent,
    LinkChartComponent,
    DashboardComponent,
    SidebarComponent,
    TabsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatOptionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,  MatDialogModule, MatInputModule, 
    MatTableModule, MatProgressSpinnerModule, MatCheckboxModule,
     MatOptionModule, MatSelectModule
    ],

  providers: [D3Service,StyleService],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
