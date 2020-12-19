import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { MenuComponentService } from '../menu-component.service';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { ChartDataService } from '../chart-data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  budgetId: any;
  monthElement: any;
  yearElement: any;
  public elements: any[];
  loadIndex: any;
  resetFormSubject: Subject<boolean> =new Subject<boolean>();

  constructor(private router: Router, public menuComponentService: MenuComponentService, public menuComponent: MenuComponent, public authService: AuthService, public chartDataService: ChartDataService) {
    this.menuComponent.elements[0].style.visibility = "hidden";
    this.menuComponent.elements[1].style.visibility = "visible";
    this.menuComponent.elements[2].style.visibility = "visible";
  }

  title = sessionStorage.getItem('user');
  ngOnInit(): void {
    this.getDataForCharts()
  }

  addNewBudget(){
    this.router.navigate(['/addNewBudget']);

  }

  getDataForCharts() {
    this.monthElement = document.querySelector('#month');
    let month = this.monthElement.value;
    this.yearElement = document.querySelector('#year');
    let year = this.yearElement.value;
    let userId = sessionStorage.getItem('id').replace('"', '').replace('"', '');

    this.authService
      .getBudgetIdFromDB({ userId: userId, month: month, year: year })
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          this.budgetId = data.budgetId;
          if (this.budgetId != null) {
            this.authService
              .getBudgetsFromDB(this.budgetId)
              .pipe(first())
              .subscribe(
                (data) => {
                  console.log(data.budgets);
                  this.elements = data.budgets;
                  this.chartDataService.data = this.elements;
                  this.loadIndex = 2;
                  this.resetFormSubject.next(true);
                },
                (error) => {
                  return;
                }
              );
          }
        },
        (error) => {
          return;
        }
      );
  }

}
