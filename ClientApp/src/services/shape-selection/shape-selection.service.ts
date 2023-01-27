import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Shape } from '../../models/Shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeSelectionService {

  private dataSource = new ReplaySubject<Shape | undefined>();
  selectedShape = this.dataSource.asObservable();

  constructor() { }

  selectShape(shape: Shape) {
    this.dataSource.next(shape);
  }

  deselectShape() {
    this.dataSource.next(undefined);
  }

}
