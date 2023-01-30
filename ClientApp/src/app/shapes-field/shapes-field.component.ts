import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shape } from '../../models/Shape';
import { SignalrService } from '../../services/signalr/signalr.service';
import { ShapeSelectionService } from '../../services/shape-selection/shape-selection.service';
import { HttpRequestsService } from '../../services/http-requests/http-requests.service';

@Component({
  selector: 'app-shapes-field',
  templateUrl: './shapes-field.component.html',
  styleUrls: ['./shapes-field.component.css']
})
export class ShapesFieldComponent implements OnInit {

  readonly shapes_max_number = 10;
  static group_number: number = 0;
  selected_shape?: Shape;
  selected_element?: HTMLElement;
  shapes_container?: HTMLElement | null;
  shapes_array: Shape[] = [];
  shapes_id_array: string[] = [];
  shapes_container_id = "svg-container";
  offsetX!: number;
  offsetY!: number;
  is_moving: boolean = false;
  moveHandler = (event: any) => { this.move(event) };

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    public signalRService: SignalrService,
    private data: ShapeSelectionService,
    private request: HttpRequestsService) {
    //http.get<Shape[]>(baseUrl + 'shapesfield').subscribe(result => {
    //  this.shapes_array = result;
    //  this.initField(this.shapes_array);
    //  }, error => console.error(error));
    this.request.getShapesRange(0, this.shapes_max_number).subscribe(result => {
      this.shapes_array = result;
      this.initField(this.shapes_array);
    }, error => console.error(error));;
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addNewShapeListener(this.addNewShape.bind(this));
    this.signalRService.addEditListener(this.updateShape.bind(this));
    this.signalRService.addRemoveListener(this.removeShape.bind(this));
  }

  addNewShape() {
    if (this.signalRService.shape) {
      this.shapes_array.push(this.signalRService.shape);
      this.appendShape(this.signalRService.shape);
    }
  }

  updateShape() {
    if (this.signalRService.shape) {
      if (JSON.stringify(this.signalRService.shape) != JSON.stringify(this.selected_shape)) {
        let id = this.shapes_array.findIndex(el => el.id == this.signalRService.shape?.id);
        if (id >= 0) {
          this.shapes_array[id] = structuredClone(this.signalRService.shape);
          let element = document.querySelector<HTMLElement>('#' + this.shapes_id_array[id]);
          element?.remove();
          this.appendShapeById(this.shapes_array[id], this.shapes_id_array[id]);
        }
      }
    }
  }

  removeShape(id: number) {
    let delete_id = this.shapes_array.findIndex(el => el.id == id);
    if (this.selected_shape?.id == id)
      this.data.deselectShape();
    if (delete_id >= 0) {
      let element = document.querySelector<HTMLElement>('#' + this.shapes_id_array[delete_id]);
      element?.remove();
      this.shapes_id_array.splice(delete_id, 1);
      this.shapes_array.splice(delete_id, 1);
    }
  }

  initField(shapes_array: Shape[]) {
    this.shapes_container = document.querySelector<HTMLElement>('#' + this.shapes_container_id);
    shapes_array.forEach((element, index) => {
      this.appendShape(element);
    });
  }

  appendShapeByIndex(shape: Shape, index: number) {
    let group_id = "group" + index;
    if (this.shapes_container)
      this.drawSvgShape(shape, this.shapes_container, group_id, this.startMoving, this.stopMoving);
  }

  appendShapeById(shape: Shape, id: string) {
    if (this.shapes_container)
      this.drawSvgShape(shape, this.shapes_container, id, this.startMoving, this.stopMoving);
  }

  appendShape(shape: Shape) {
    let group_id = "group" + ShapesFieldComponent.group_number;    
    ++ShapesFieldComponent.group_number;
    this.shapes_id_array.push(group_id);

    if (this.shapes_container)
      this.drawSvgShape(shape, this.shapes_container, group_id, this.startMoving, this.stopMoving);
  }

  drawSvgShape(shape: Shape, shapes_container: HTMLElement, id: string, eventHandlerStart: Function, eventHandlerStop: Function) {
    let shape_element = `<svg id="${id}" x="${shape.positionX}" y="${shape.positionY}" width="100px" height="100px">`;
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

    shapes_container.insertAdjacentHTML('beforeend', shape_element);
    document.querySelector('#' + id)!.addEventListener('mousedown', eventHandlerStart.bind(this));
    document.querySelector('#' + id)!.addEventListener('mouseup', eventHandlerStop.bind(this));
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

    if (this.is_moving) {
      if (this.selected_shape) {
        this.selected_shape.positionX = Number(this.selected_element?.getAttribute('x'));
        this.selected_shape.positionY = Number(this.selected_element?.getAttribute('y'));        
        this.request.editShape(this.selected_shape).subscribe();
      }
      this.is_moving = false;
    }
  }  

  move(event: any) {
    this.selected_element!.setAttribute('x', "" + (event.clientX - this.offsetX));
    this.selected_element!.setAttribute('y', "" + (event.clientY - 64 - this.offsetY));

    if (!this.is_moving)
      this.is_moving = true;
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
