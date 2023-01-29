import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Shape } from '../../models/Shape';
import { NgForm } from '@angular/forms';
import { ShapeSelectionService } from '../../services/shape-selection/shape-selection.service';

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

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private data: ShapeSelectionService) { }

  ngOnInit(): void {
    this.data.selectedShape.subscribe((shape) => { this.shape = shape; });
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
        this.sendPostRequest(form.value);
        break;
      case "edit":
        if (this.shape) {
          let new_shape: Shape = form.value;
          new_shape.id = this.shape.id;
          new_shape.positionX = this.shape.positionX;
          new_shape.positionY = this.shape.positionY;
          this.sendPutRequest(new_shape);
        }
        break;
      case "delete":
        if (this.shape) {
          this.sendDeleteRequest(this.shape);
          this.data.deselectShape();
        }
        break;
    }

    this.remove_form.emit();
  }

  sendPostRequest(data: Shape) {    
    this.http.post(this.baseUrl + 'shapesfield', data).subscribe();
  }

  sendPutRequest(data: Shape) {
    this.http.put(this.baseUrl + 'shapesfield', data).subscribe();
  }

  sendDeleteRequest(data: Shape) {
    this.http.delete(this.baseUrl + 'shapesfield' + '/?id=' + data.id).subscribe();
  }
}
