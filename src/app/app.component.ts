import { Component } from '@angular/core';
import { MenuComponentService } from './menu-component.service';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MenuComponentService, MenuComponent]
})
export class AppComponent {
  title = 'personal-budget-app';
}
