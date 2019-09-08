import { Component, OnInit, ViewEncapsulation, KeyValueDiffers, Input } from '@angular/core';
import { D3Service } from '../../Services/d3.service';
import { StyleService } from './../../Services/style.service';

declare const require:any;

@Component({
  selector: 'app-link-chart',
  templateUrl: './link-chart.component.html',
  styleUrls: ['./link-chart.component.css']
})
export class LinkChartComponent implements OnInit {
  
   differ  
   
   @Input() building

  constructor(private d3Service:D3Service,private styleService:StyleService,
    private differs:KeyValueDiffers) { 
      this.differ = this.differs.find({}).create();
     }

  ngOnInit() {
    this.styleService.addStyle('link-chart', require('../../../theme/linkchart.css'))
    this.d3Service.linkChart()    
  }

  ngDoCheck(){
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem(item => {
        console.log('item changed', item.currentValue);
        this.d3Service.remove()
          this.d3Service.linkChart() 
      });
    }
  }

}
