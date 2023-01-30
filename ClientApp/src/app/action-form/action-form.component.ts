import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Shape } from '../../models/Shape';
import { NgForm } from '@angular/forms';
import { ShapeSelectionService } from '../../services/shape-selection/shape-selection.service';
import { HttpRequestsService } from '../../services/http-requests/http-requests.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.css']
})
export class ActionFormComponent implements OnInit {

  @Input() action_type: "create" | "edit" | "delete" = "create";
  @Output() remove_form = new EventEmitter();

  backgroundContainerId = "background-container";
  cancelButtonContainerId = "close-btn";
  formHeader: string = "";
  shape?: Shape;
  counter = 0;

  constructor(private data: ShapeSelectionService, private request: HttpRequestsService) { }

  ngOnInit(): void {
    this.data.selectedShape.subscribe((shape) => { this.shape = shape; });
    this.data.counter.subscribe((counter) => { this.counter = counter; });
    this.setUpForm(this.action_type);
  }

  closeForm(event: any) {
    if (event.target.id == this.backgroundContainerId || event.target.id == this.cancelButtonContainerId) {      
      this.remove_form.emit();
    }
  }

  setUpForm(action: "create" | "edit" | "delete") {    
    let parent = document.querySelector<HTMLElement>('#form-container');    
    switch (action) {
      case "create":
        parent!.style.height = "225px";
        this.formHeader = "Создание фигуры";
        break;
      case "edit":        
        this.formHeader = "Изменение фигуры";
        break;
      case "delete":
        this.formHeader = "Удаление фигуры";
        parent!.style.height = "200px";        
        break;
    }
  }

  onSubmit(form: NgForm) {
    switch (this.action_type) {
      case "create":
        if (this.counter < this.data.getMaxCounter()) {
          this.request.addNewShape(form.value).subscribe();
        }          
        break;
      case "edit":
        if (this.shape) {
          let new_shape: Shape = form.value;
          new_shape.id = this.shape.id;
          new_shape.positionX = this.shape.positionX;
          new_shape.positionY = this.shape.positionY;
          this.request.editShape(new_shape).subscribe();
        }
        break;
      case "delete":
        if (this.shape) {
          this.request.deleteShape(this.shape).subscribe();
          this.data.deselectShape();
        }
        break;
    }

    this.remove_form.emit();
  }
}
