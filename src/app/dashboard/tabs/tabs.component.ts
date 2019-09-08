import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class TabsComponent implements OnInit {
  
  buildings = [{ name: "Old Building", id: "max" },
  { name: "New Building", id: "apollo" },
  { name: "Overage Building", id: "fortis" }]

  constructor() { }

  ngOnInit() {

  }
  
  @Output() buildingSelected=new EventEmitter<string>();

  select(value:string){
   this.buildingSelected.emit(value)
  }
  
}
