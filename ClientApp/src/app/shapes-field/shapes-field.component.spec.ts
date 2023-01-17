import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesFieldComponent } from './shapes-field.component';

describe('ShapesFieldComponent', () => {
  let component: ShapesFieldComponent;
  let fixture: ComponentFixture<ShapesFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShapesFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapesFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
