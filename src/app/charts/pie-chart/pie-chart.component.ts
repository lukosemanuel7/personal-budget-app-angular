import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subject } from 'rxjs';
import { ChartDataService } from 'src/app/chart-data.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {

  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();

  budgetValues = new Array()
  expenseValue = new Array()
  label = new Array()

  ngOnInit(){
    this.resetFormSubject.subscribe(response => {
      if(response)
        this.budgetValues = new Array();
        this.expenseValue = new Array();
        this.label = new Array();
        this.fetchChartData();
        this.refreshData();
    })
  }

  constructor(public chartDataService: ChartDataService){
      console.log(this.chartDataService.elements)
      this.fetchChartData();
  }

  fetchChartData(){

    this.chartDataService.elements.forEach(element => {
      this.budgetValues.push(element.budgetValue)
      this.expenseValue.push(element.expenseValue)
      this.label.push(element.expenseName)

    });
    console.log("Inside Pie Chart Component");
  }

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }
    },
  };

  pieChartLabels: Label[] = this.label;

  pieChartData: number[] = this.expenseValue;

  pieChartDataBudget: number[] = this.budgetValues;

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  refreshData() {
    this.pieChartData = this.expenseValue;
    this.pieChartDataBudget = this.budgetValues;
    this.pieChartLabels = this.label;
  }
}
