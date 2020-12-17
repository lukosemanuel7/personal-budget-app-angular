import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-addnewbudget',
  templateUrl: './addnewbudget.component.html',
  styleUrls: ['./addnewbudget.component.scss'],
})
export class AddnewbudgetComponent implements OnInit {
  itemsArray: FormArray;
  budgetForm: FormGroup;
  budgetId: any;
  monthElement: any;
  yearElement: any;
  budgetJson: JSON;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.budgetForm = this.fb.group({
      budgets: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getBudgetsForUser();
    // let budget = this.newBudget();
    // budget.setValue({expenseName: 'Expense', budgetValue: '', expenseValue: ''});
    // this.budgets().push(budget);
  }

  getBudgetsForUser() {
    this.monthElement = document.querySelector('#month');
    let month = this.monthElement.value;
    this.yearElement = document.querySelector('#year');
    let year = this.yearElement.value;
    let userId = sessionStorage.getItem('id').replace('"', '').replace('"', '');

    this.budgets().clear();
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
                  data.budgets.forEach((element) => {
                    console.log(element);
                    let budget = this.newBudget();
                    budget.setValue({
                      expenseName: element.expenseName,
                      budgetValue: element.budgetValue,
                      expenseValue: element.expenseValue,
                    });
                    this.budgets().push(budget);
                  });
                },
                (error) => {
                  return;
                }
              );
          } else {
            this.authService
              .addBudgetIdToDB({ userId: userId, month: month, year: year })
              .pipe(first())
              .subscribe(
                (data) => {
                  console.log('added budget id' + data.budgetId);
                },
                (error) => {}
              );
          }
        },
        (error) => {
          return;
        }
      );
  }

  budgets(): FormArray {
    return this.budgetForm.get('budgets') as FormArray;
  }

  newBudget(): FormGroup {
    return this.fb.group({
      expenseName: '',
      budgetValue: '',
      expenseValue: '',
    });
  }

  addBudget() {
    console.log('Adding a budget');
    this.budgets().push(this.newBudget());
  }

  removeBudget(empIndex: number) {
    this.budgets().removeAt(empIndex);
  }

  onSubmit() {
    // console.log(this.budgetForm.value.budgets);
    this.budgetJson = this.budgetForm.value.budgets;

    // budgets.budgets.forEach(element => {
    //   budgets.budgets.element.budgetId = 256842;

    // });
    // this.budgetJson[0].

    var element;
    for (element in this.budgetJson) {
      this.budgetJson[element].budgetId = this.budgetId;
    }

    this.authService
      .deleteBudgetsFromDB(this.budgetId)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(this.budgetId);
          // this.budgetId = data.budgetId;

          this.authService
            .addBudgetsToDB(this.budgetJson)
            .pipe(first())
            .subscribe(
              (data) => {
                console.log('added budgets' + data.budgetId);
              },
              (error) => {}
            );
        },
        (error) => {
          return;
        }
      );

    console.log(this.budgetJson);
  }
}
