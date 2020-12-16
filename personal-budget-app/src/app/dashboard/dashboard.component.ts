import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { MenuComponentService } from '../menu-component.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, public menuComponentService: MenuComponentService, public menuComponent: MenuComponent) {
    this.menuComponent.elements[0].style.visibility = "hidden";
    // console.log(this.menuComponent.elements[0])
    this.menuComponent.elements[1].style.visibility = "visible";
    this.menuComponent.elements[2].style.visibility = "visible";
  }

  title = sessionStorage.getItem('user');
  ngOnInit(): void {
  }

  addNewBudget(){
    this.router.navigate(['/addNewBudget']);

  }

}
