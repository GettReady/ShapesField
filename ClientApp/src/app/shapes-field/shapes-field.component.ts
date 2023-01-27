import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shape } from '../../models/Shape';
import { SignalrService } from '../../services/signalr/signalr.service';
import { ShapeSelectionService } from '../../services/shape-selection/shape-selection.service';

@Component({
  selector: 'app-shapes-field',
  templateUrl: './shapes-field.component.html',
  styleUrls: ['./shapes-field.component.css']
})
export class ShapesFieldComponent implements OnInit {

  static group_number: number = 0;
  selected_shape?: Shape;
  selected_element?: HTMLElement;
  shapes_container?: HTMLElement | null;
  shapes_array: Shape[] = [];
  shapes_id_array: string[] = [];
  shapes_container_id = "svg-container";
  offsetX!: number;
  offsetY!: number;
  moveHandler = (event: any) => { this.move(event) };

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, public signalRService: SignalrService, private data: ShapeSelectionService) {
    http.get<Shape[]>(baseUrl + 'shapesfield').subscribe(result => {      
      this.shapes_array = result;      
      this.initField(this.shapes_array);
    }, error => console.error(error));
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addDataListener(this.updateShape.bind(this));
  }

  updateShape() {
    if (this.signalRService.shape) {
      this.shapes_array.push(this.signalRService.shape);
      this.drawShape(this.signalRService.shape, 0);
    }    
  }

  initField(shapes_array: Shape[]) {
    this.shapes_container = document.querySelector<HTMLElement>('#' + this.shapes_container_id);
    shapes_array.forEach((element, index) => {
      this.drawShape(element, index);
    });
  }

  drawShape(shape: Shape, index: number) {    
    let group_id = "group" + ShapesFieldComponent.group_number;
    ++ShapesFieldComponent.group_number;

    this.shapes_id_array.push(group_id);
    let shape_element = `<svg id="${group_id}" x="${shape.positionX}" y="${shape.positionY}" width="100px" height="100px">`;
    switch (shape.type) {
      case 'square':
        shape_element += `<rect x="0" y="0" width="100" height="100" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;  
      case 'circle':
        shape_element += `<circle cx="50" cy="50" r="50" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;
      case 'triangle':
        shape_element += `<polygon points="0 100 50 0 100 100" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;
    }
    shape_element += `<text x="50" y = "50" alignment-baseline="middle" text-anchor="middle" style="user-select: none" class="shape-name" > ${shape.name}</text>`;

    if (this.shapes_container) {
      this.shapes_container.insertAdjacentHTML('beforeend', shape_element);
      document.querySelector('#' + group_id)!.addEventListener('mousedown', this.startMoving.bind(this));
      document.querySelector('#' + group_id)!.addEventListener('mouseup', this.stopMoving.bind(this));
    }    
  }

  startMoving(event: any) {
    this.removeSelection();    
    this.addSelection(event.target.parentNode);    

    this.offsetX = event.clientX - this.selected_element!.getBoundingClientRect().x;
    this.offsetY = event.clientY - this.selected_element!.getBoundingClientRect().y;

    document.addEventListener("mousemove", this.moveHandler);
    this.selected_element!.classList.add('svg-shadow');
  }

  stopMoving(event: any) {
    document.removeEventListener("mousemove", this.moveHandler);    
  }  

  move(event: any) {
    this.selected_element!.setAttribute('x', "" + (event.clientX - this.offsetX));
    this.selected_element!.setAttribute('y', "" + (event.clientY - 64 - this.offsetY));
  }

  deselect(event: any) {
    this.removeSelection();
  }

  addSelection(parent_element: HTMLElement) {
    this.selected_element = parent_element;
    this.selected_shape = this.shapes_array[this.shapes_id_array.indexOf(parent_element.id)];

    this.data.selectShape(this.selected_shape);

    parent_element.children[0].classList.add('svg-stroke');
  }

  removeSelection() {
    if (this.selected_element) {      
      this.selected_element!.classList.remove('svg-shadow');
      this.selected_element!.children[0].classList.remove('svg-stroke');
      this.selected_element = undefined;
      this.selected_shape = undefined;

      this.data.deselectShape();
    }
  }
}
