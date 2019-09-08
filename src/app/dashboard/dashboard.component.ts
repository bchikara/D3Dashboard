import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { D3Service } from '../Services/d3.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private d3Service:D3Service,private http:HttpClient) { }

  ngOnInit() {
  }
  
  loadedChart='Experiment'
  building='max'
  onNavigate(feature:string){
     console.log(feature)
     this.loadedChart=feature;
  }
  
  change(value:string){
   this.building=value
   console.log(this.building)
  }

}
