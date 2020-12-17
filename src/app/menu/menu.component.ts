import { Component, OnInit } from '@angular/core';
import { MenuComponentService } from '../menu-component.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public elements: any[];

  constructor(public menuComponentService: MenuComponentService) {
    this.elements =[document.getElementById('login'),document.getElementById('logout'),document.getElementById('dashboard')]
    this.menuComponentService.data = this.elements ;
    console.log(menuComponentService.data)
  }

  ngOnInit(): void {
  }

}
