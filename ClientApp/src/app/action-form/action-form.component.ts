import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Shape } from '../../models/Shape';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.css']
})
export class ActionFormComponent implements OnInit {

  @Input() action_type: "create" | "edit" | "delete" = "create";
  @Output() remove_form = new EventEmitter();

  private static backgroundContainerId = "background-container";
  private static cancelButtonContainerId = "close-btn";
  formHeader: string = "";

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
    this.setUpForm(this.action_type);
  }

  closeForm(event: any) {
    if (event.target.id == ActionFormComponent.backgroundContainerId || event.target.id == ActionFormComponent.cancelButtonContainerId) {      
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
        parent!.style.height = "190px";
        break;
    }
  }

  onSubmit(form: NgForm) {
    switch (this.action_type) {
      case "create":        
        break;
      case "edit":
        console.log("Edit submit works");
        break;
      case "delete":
        console.log("Delete submit works");
        break;
    }
    console.log(form.value);
    this.sendRequest(form.value);
    this.remove_form.emit();
  }

  sendRequest(data: Shape) {
    console.log('sending request');
    this.http.post(this.baseUrl + 'shapesfield', data).subscribe();
  }

}
