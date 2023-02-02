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
  moveHandler = (event: any) => { this.move(event) };
  renderer = new SvgRenderer();

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    public signalRService: SignalrService,
    private data: ShapeSelectionService,
    private request: HttpRequestsService)
  {
    this.request.getShapesRange(0, this.shapes_max_number).subscribe(result => {
      this.shapes_array = result;
      this.initField(this.shapes_array);
    }, error => console.error(error));
    this.data.setMaxCounter(this.shapes_max_number);
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
      this.data.incrementCounter();
    }
  }

  updateShape() {
    let new_shape = this.signalRService.shape;
    if (new_shape) {
      if (JSON.stringify(new_shape) != JSON.stringify(this.selected_shape)) {
        let id = this.shapes_array.findIndex(el => el.id == new_shape?.id);
        if (id >= 0) {
          this.shapes_array[id] = structuredClone(new_shape);
          let element = document.querySelector<HTMLElement>('#' + this.shapes_id_array[id]);
          if (new_shape.id == this.selected_shape?.id) {            
            this.data.selectShape(this.shapes_array[id]);            
          }
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
      this.data.decrementCounter();
    }
  }

  initField(shapes_array: Shape[]) {
    this.shapes_container = document.querySelector<HTMLElement>('#' + this.shapes_container_id);
    shapes_array.forEach((element, index) => {
      this.appendShape(element);
      this.data.incrementCounter();
    });
  }

  appendShapeByIndex(shape: Shape, index: number) {
    let group_id = "group" + index;
    if (this.shapes_container)
      this.drawShape(shape, this.shapes_container, group_id);
  }

  appendShapeById(shape: Shape, id: string) {
    if (this.shapes_container)
      this.drawShape(shape, this.shapes_container, id);
  }

  appendShape(shape: Shape) {
    let group_id = "group" + ShapesFieldComponent.group_number;    
    ++ShapesFieldComponent.group_number;
    this.shapes_id_array.push(group_id);

    if (this.shapes_container)
      this.drawShape(shape, this.shapes_container, group_id);
  }

  drawShape(shape: Shape, shapes_container: HTMLElement, id: string) {
    this.renderer.renderShape(shape, shapes_container, id);
    document.querySelector('#' + id)!.addEventListener('mousedown', this.startMoving.bind(this));
    document.querySelector('#' + id)!.addEventListener('mouseup', this.stopMoving.bind(this));
  }

  startMoving(event: any) {
    this.removeSelection();    
    this.addSelection(event.target.parentNode);    
    this.renderer.setOffsets(event.clientX, event.clientY);
    document.addEventListener("mousemove", this.moveHandler);
  }

  stopMoving(event: any) {
    document.removeEventListener("mousemove", this.moveHandler);
    let new_pos = this.renderer.getShapePosition();
    if (this.selected_shape) { 
      if (this.selected_shape.positionX !== new_pos.x || this.selected_shape.positionY !== new_pos.y) {
        this.selected_shape.positionX = new_pos.x;
        this.selected_shape.positionY = new_pos.y;
        this.request.editShape(this.selected_shape).subscribe();
      }
    }
  }  

  move(event: any) {
    this.renderer.translateShape(event.clientX, event.clientY - 64);
  }

  deselect(event: any) {    
    this.removeSelection();
  }

  addSelection(parent_element: HTMLElement) {
    this.selected_shape = this.shapes_array[this.shapes_id_array.indexOf(parent_element.id)];
    this.data.selectShape(this.selected_shape);
    this.renderer.selectElement(parent_element);
  }
  
  removeSelection() {
    this.renderer.deselectElement();
    this.selected_shape = undefined;
    this.data.deselectShape();
  }
}

export class SvgRenderer {
  selected_element?: HTMLElement;
  outer_selection_class = "svg-shadow";
  inner_selection_class = "svg-stroke";
  width = 100;
  height = 100;
  offset_x = 0;
  offset_y = 0;

  constructor() { }

  public selectElement(element: HTMLElement) {
    this.selected_element = element;
    this.selected_element.classList.add(this.outer_selection_class);
    this.selected_element.children[0].classList.add(this.inner_selection_class);
  }

  public deselectElement() {
    if (this.selected_element) {
      this.selected_element.classList.remove(this.outer_selection_class);
      this.selected_element.children[0].classList.remove(this.inner_selection_class);
    }
  }

  public setOffsets(x: number, y: number) {
    this.offset_x = x - this.selected_element!.getBoundingClientRect().x;
    this.offset_y = y - this.selected_element!.getBoundingClientRect().y;
  }

  public translateShape(x: number, y: number) {
    this.selected_element!.setAttribute('x', "" + (x - this.offset_x));
    this.selected_element!.setAttribute('y', "" + (y - this.offset_y));
  }

  public getShapePosition(): {x: number, y:number} {
    let new_pos_x = Number(this.selected_element?.getAttribute('x'));
    let new_pos_y = Number(this.selected_element?.getAttribute('y'));

    return { x: new_pos_x, y: new_pos_y };
  }

  public renderShape(shape: Shape, shapes_container: HTMLElement, id: string) {
    let shape_element = `<svg id="${id}" x="${shape.positionX}" y="${shape.positionY}" width="${this.width}px" height="${this.height}px">`;
    switch (shape.type) {
      case 'square':
        shape_element += `<rect x="0" y="0" width="${this.width}px" height="${this.height}px" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;
      case 'circle':
        shape_element += `<circle cx="${this.width * 0.5}" cy="${this.height * 0.5}" r="${this.width * 0.5}" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;
      case 'triangle':
        shape_element += `<polygon points="0 ${this.height} ${this.width * 0.5} 0 ${this.width} ${this.height}" fill="${shape.color}" stroke-width="1" stroke="rgba(0,0,0,0.5)" />`;
        break;
    }
    shape_element += `<text x="${this.width * 0.5}" y = "${this.height * 0.5}" alignment-baseline="middle" text-anchor="middle" style="user-select: none" class="shape-name" > ${shape.name}</text>`;
    shapes_container.insertAdjacentHTML('beforeend', shape_element);
  }

}
