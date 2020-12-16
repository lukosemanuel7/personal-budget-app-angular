import { TestBed } from '@angular/core/testing';

import { MenuComponentService } from './menu-component.service';

describe('MenuComponentService', () => {
  let service: MenuComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
