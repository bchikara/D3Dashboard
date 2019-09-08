import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  svgs = [{ src: "assets/Topology.svg", name: "Topology" },
  { src: "assets/networkparam.svg", name: "NetworkParam" },
  { src: "assets/modes.svg", name: "Modes" },
  { src: "assets/Experiment.svg", name: "Experiment" },
  { src: "assets/Actions.svg", name: "Actions" },
  { src: "assets/logs.svg", name: "Logs" }]

  @Output() chartSelected=new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }
  
  icon(value:string){
    console.log(value)
     this.chartSelected.emit(value)
    } 
}
