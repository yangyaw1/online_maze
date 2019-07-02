import { Injectable } from '@angular/core';
import { Maze } from '../models/maze.model';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { restoreProcess } from '../models/restoreProcess.model';
// import { MAZES } from '../mock-maze';
// import { USERS } from '../mock-user';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private users: User[] = USERS;
  // private mazes: Maze[] = MAZES;
  private _mazeSource = new BehaviorSubject<Maze[]>([]);
  private _userSource = new BehaviorSubject<User[]>([]);

  constructor(private httpClient: HttpClient) { }
  
  
  // getusers() {
  //   return this.users;
  // }
  getusers(): Observable<User[]>{
    this.httpClient.get(`api/v1/users`)
      .toPromise()
      .then((res: any) => {
        this._userSource.next(res);
      })
      .catch(this.handleError);
      
      return this._userSource.asObservable();
  }
  
  // getuser(uname: string) {
  //   return this.users.find((user) => user.uname === uname);
  // }
  getuser(uname: string): Promise<User>{
    return this.httpClient.get(`api/v1/users/${uname}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  // getmazes() {
  //   return this.mazes;
  // }
  getmazes(): Observable<Maze[]>{
    this.httpClient.get(`api/v1/mazes`)
      .toPromise()
      .then((res: any) => {
        this._mazeSource.next(res);
      })
      .catch(this.handleError);
      
      return this._mazeSource.asObservable();
  }

  
  saveProcess(uname: string, mazeid: number, cur: number, timecount: string): Promise<Message>{
    const data = {
      cur: cur,
      timecount: timecount
    };
    console.log(data);
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/process/${mazeid}/${uname}`, data, options)
              .toPromise()
              .then((res: any) => res)
              .catch(this.handleError);
  }
  
  restoreProcess(uname: string, mazeid: number): Promise<restoreProcess>{
    return this.httpClient.get(`api/v1/process/${mazeid}/${uname}`)
              .toPromise()
              .then((res: any) => res)
              .catch(this.handleError);
  }
  // getmaze(mazeid: number) {
  //   return this.mazes.find((maze) => maze.id === mazeid);
  // }
  getmaze(id: number): Promise<Maze>{
    return this.httpClient.get(`api/v1/mazes/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  addmaze(maze: Maze): Promise<Maze>{
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.httpClient.post(`api/v1/mazes`, maze, options)
           .toPromise()
           .then((res:any) => res)
           .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
