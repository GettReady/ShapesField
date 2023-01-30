import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shape } from '../../models/Shape';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  controller = 'shapesfield';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }

  getAllShapes() {    
    return this.http.get<Shape[]>(this.baseUrl + this.controller);    
  }

  getShapesRange(skip: number, take: number) {
    return this.http.get<Shape[]>(`${this.baseUrl}${this.controller}\\skip=${skip}&take=${take}`);
  }

  addNewShape(data: Shape) {
    return this.http.post(this.baseUrl + this.controller, data);
  }

  editShape(data: Shape) {
    return this.http.put(this.baseUrl + this.controller, data);
  }

  deleteShape(data: Shape) {
    return this.http.delete(this.baseUrl + this.controller + '/?id=' + data.id);
  }
}
