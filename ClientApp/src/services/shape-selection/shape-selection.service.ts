import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { Shape } from '../../models/Shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeSelectionService {

  private max_counter = 10;

  private dataSource = new ReplaySubject<Shape | undefined>(1);
  selectedShape = this.dataSource.asObservable();

  private counterSource = new BehaviorSubject<number>(0);
  counter = this.counterSource.asObservable();

  constructor() { }

  selectShape(shape: Shape) {
    this.dataSource.next(shape);
  }

  deselectShape() {
    this.dataSource.next(undefined);
  }

  setMaxCounter(value: number) {
    this.max_counter = value;
  }

  getMaxCounter() {
    return this.max_counter;
  }

  incrementCounter() {
    this.counterSource.next(this.counterSource.value + 1);
  }

  decrementCounter() {
    this.counterSource.next(this.counterSource.value - 1);
  }

}
