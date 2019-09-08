import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkChartComponent } from './link-chart.component';

describe('LinkChartComponent', () => {
  let component: LinkChartComponent;
  let fixture: ComponentFixture<LinkChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
