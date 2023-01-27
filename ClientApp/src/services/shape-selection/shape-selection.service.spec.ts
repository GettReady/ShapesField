import { TestBed } from '@angular/core/testing';

import { ShapeSelectionService } from './shape-selection.service';

describe('ShapeSelectionService', () => {
  let service: ShapeSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
