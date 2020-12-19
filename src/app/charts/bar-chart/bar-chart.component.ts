import { Component, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartDataService } from '../../chart-data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {

  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();

  budgetValues = new Array()
  expenseValue = new Array()
  label = new Array()

  ngOnInit(){
    this.resetFormSubject.subscribe(response => {
      if(response )
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
    console.log("Inside line component")
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = this.label;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: this.budgetValues, label: 'Budget' },
    { data: this.expenseValue, label: 'Expense' }
  ];

  refreshData() {
    this.barChartData[0].data = this.budgetValues;
    this.barChartData[1].data = this.expenseValue;
    this.barChartLabels = this.label;
  }

}
