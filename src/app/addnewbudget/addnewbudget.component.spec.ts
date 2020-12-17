import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewbudgetComponent } from './addnewbudget.component';

describe('AddnewbudgetComponent', () => {
  let component: AddnewbudgetComponent;
  let fixture: ComponentFixture<AddnewbudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewbudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
