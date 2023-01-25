import { Component, OnInit, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { ActionFormComponent } from '../action-form/action-form.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild("actionForm", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  ref!: ComponentRef<ActionFormComponent>

  openForm(action_type: "create" | "edit" | "delete") {
    this.ref = this.vcr.createComponent(ActionFormComponent);
    this.ref.instance.action_type = action_type;
    this.ref.instance.remove_form.subscribe((event: any) => {
      this.closeForm();
    });
  }

  closeForm() {
    const index = this.vcr.indexOf(this.ref.hostView);
    if (index != -1) this.vcr.remove(index);
  }

  createShape() {
    this.openForm("create");
  }

  editShape() {
    this.openForm("edit");

  }

  deleteShape() {
    this.openForm("delete");
  }
}
