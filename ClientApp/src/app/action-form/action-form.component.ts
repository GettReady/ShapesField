import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

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

}
