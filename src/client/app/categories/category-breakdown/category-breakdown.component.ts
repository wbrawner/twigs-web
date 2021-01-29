import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { Category } from '../category';
import { CategoriesComponent } from '../categories.component';
import { ChartConfiguration, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-category-breakdown',
  templateUrl: './category-breakdown.component.html',
  styleUrls: ['./category-breakdown.component.css']
})
export class CategoryBreakdownComponent implements OnInit, OnChanges {
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          // beginAtZero: true
        }
      },
      y: {}
    },
    indexAxis: 'y'
  };
  @Input() barChartLabels: string[];
  @Input() barChartData: ChartDataset[] = [
    { data: [0, 0, 0, 0], label: '' },
  ];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    // if (changes.barChartLabels) {
      // this.barChartLabels = changes.barChartLabels.currentValue;
    // }
    if (changes.barChartData) {
      this.barChartData = changes.barChartData.currentValue;
    }
  }
}
