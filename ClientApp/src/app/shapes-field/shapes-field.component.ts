import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shapes-field',
  templateUrl: './shapes-field.component.html',
  styleUrls: ['./shapes-field.component.css']
})
export class ShapesFieldComponent implements OnInit {

  selected_shape_id: string = "";
  moveHandler = (event: any) => { this.move(event, this.selected_shape_id) };
  offsetX!: number;
  offsetY!: number;

  shapes_array: Shape[] = [
    {
      name: "Квадрат Степан",
      type: "square",
      color: "lightgray",
      position: [500, 200]
    },
    {
      name: "Круг",
      type: "circle",
      color: "lightgreen",
      position: [600, 150]
    },
    {
      name: "Треугольник",
      type: "triangle",
      color: "lightgray",
      position: [750, 300]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.initField(this.shapes_array);
  }

  initField(shapes_array: Shape[]) {
    shapes_array.forEach((element, index) => {
      this.drawShape(element, index);
    });
  }

  drawShape(shape: Shape, index: number) {
    let group_id = "group" + (index +100);
    let shape_element = `<svg id="${group_id}" x="${shape.position[0]}" y="${shape.position[1]}" width="100px" height="100px">`;
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
    document.querySelector<HTMLElement>('#svg-container')!.insertAdjacentHTML('beforeend', shape_element);
    
    document.querySelector('#' + group_id)!.addEventListener('mousedown', this.startMoving.bind(this));
    document.querySelector('#' + group_id)!.addEventListener('mouseup', this.stopMoving.bind(this));
  }

  startMoving(event: any) {
    this.removeSelection();    
    this.addSelection(event.target.parentNode);    

    this.selected_shape_id = '#' + event.target.parentNode.attributes.id.value;
    console.log(this.selected_shape_id + ' selected');
    let element = document.querySelector<HTMLElement>(this.selected_shape_id);
    this.offsetX = event.clientX - element!.getBoundingClientRect().x;
    this.offsetY = event.clientY - element!.getBoundingClientRect().y;
    document.addEventListener("mousemove", this.moveHandler);

    element!.classList.add('svg-shadow');
  }

  stopMoving(event: any) {    
    console.log('removing handler');
    document.removeEventListener("mousemove", this.moveHandler);    
  }  

  move(event: any, element_id: string) {    
    let element = document.querySelector<HTMLElement>(element_id);
    element!.setAttribute('x', "" + (event.clientX - this.offsetX));
    element!.setAttribute('y', "" + (event.clientY - 64 - this.offsetY));
  }

  deselect(event: any) {
    this.removeSelection();
  }

  addSelection(parent_element: HTMLElement) {
    parent_element.children[0].classList.add('svg-stroke');
  }

  removeSelection() {
    if (this.selected_shape_id) {
      console.log('removing selection');
      let element = document.querySelector<HTMLElement>(this.selected_shape_id);
      element!.classList.remove('svg-shadow');
      element!.children[0].classList.remove('svg-stroke');
      this.selected_shape_id = "";
    }
  }
}

type Shape = {
  name: string;
  type: string;
  color: string;
  position: number[];
}
