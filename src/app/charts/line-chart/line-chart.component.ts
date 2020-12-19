import { Component, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ChartDataService } from '../../chart-data.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {

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

  // Array of different segments in chart
  lineChartData: ChartDataSets[] = [
    { data: this.budgetValues, label: 'Budget' },
    { data: this.expenseValue, label: 'Expense' }
  ];

  //Labels shown on the x-axis
  lineChartLabels: Label[] = this.label;

  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [

    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
    }
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  refreshData() {
    this.lineChartData[0].data = this.budgetValues;
    this.lineChartData[1].data = this.expenseValue;
    this.lineChartLabels = this.label;
  }

}
