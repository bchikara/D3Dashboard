import { Component, OnInit, ViewEncapsulation, Input, KeyValueDiffers } from '@angular/core';
import { D3Service } from '../../Services/d3.service';
import { HttpClient } from '@angular/common/http';
import { StyleService } from './../../Services/style.service';

declare const require: any;

@Component({
  selector: 'app-bubblechart',
  templateUrl: './bubblechart.component.html',
  styleUrls: ['./bubblechart.component.css']
})
export class BubblechartComponent implements OnInit {

  constructor(private chartService: D3Service, private differs: KeyValueDiffers,
    private http: HttpClient, private styleService: StyleService) {
    this.differ = this.differs.find({}).create();
  }
  differ


  @Input() building: string

  ngOnInit() {
    this.styleService.addStyle('bubble-chart', require('../../../theme/bubblechart.css'))
    this.http.get('./assets/region.json').subscribe((d) => {
      this.chartService.bubblechart(d[this.building])
    })
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem(item => {
        console.log('item changed', item.currentValue);
        this.chartService.remove()
        this.http.get('./assets/region.json').subscribe((d) => {
          this.chartService.bubblechart(d[item.currentValue])
        })
      });
    }
  }


  ngOnDestroy() {
    this.styleService.removeStyle('bubble-chart');
  }

}





