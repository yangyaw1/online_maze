import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpClient: HttpClient) { }
  
  getRoomid(): Promise<Message>{
    return this.httpClient.get(`api/v1/rooms`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  createRoom(uname: string, roomid: number, mazeid: number): Promise<Message>{
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    const data = {
      roomid: roomid,
      mazeid: mazeid
    }
    return this.httpClient.post(`api/v1/rooms/create/${uname}`, data, options)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  joinRoom(uname: string, roomid: number, mazeid: number): Promise<Message>{
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };
    const data = {
      roomid: roomid,
      mazeid: mazeid
    }
    console.log('create!')
    return this.httpClient.post(`api/v1/rooms/join/${uname}`, data, options)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}
