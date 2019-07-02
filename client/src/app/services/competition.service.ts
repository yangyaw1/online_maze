import { Injectable } from '@angular/core';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  
  private CompetitionSocket: any;

  constructor() { }
  
  init(oppo_info, roomId, winner_time): void{
    this.CompetitionSocket = io(window.location.origin, {query: 'roomId='+roomId});
    
    this.CompetitionSocket.on("message", message => {
      console.log("message received from the server: " + message);
    })
    
    this.CompetitionSocket.on("oppo_connect", (uname) => {
       oppo_info.is_on = true;
       oppo_info.uname = uname;
       oppo_info.is_waiting = false;
       oppo_info.flag_connect = true;
    })
    
    this.CompetitionSocket.on("oppo_disconnect", () => {
       oppo_info.uname = '';
       oppo_info.is_waiting = false;
       oppo_info.is_on = false;
       oppo_info.flag_disconnect = true;
    })
    
    this.CompetitionSocket.on("ready", (is_waiting) => {
       oppo_info.is_waiting = true;
    })
    
    this.CompetitionSocket.on("countdown", (is_waiting) => {
       oppo_info.is_waiting = true;
       oppo_info.flag_countdown = true;
    })
    
    this.CompetitionSocket.on("gameend", (time) => {
       oppo_info.is_waiting = false;
       oppo_info.flag_gameend = true;
       winner_time.value = +(time.toFixed(2));
    })
    
    this.CompetitionSocket.on("updateLocation", (location) => {
       oppo_info.cur = +location;
       oppo_info.flag_position = true;
    })
  }  
  
  connect(uname): void{
    this.CompetitionSocket.emit("oppo_connect", uname);
  }
  
  ready(is_waiting): void{
    this.CompetitionSocket.emit("ready", is_waiting);
  }
  
  updateLocation(cur): void {
    this.CompetitionSocket.emit("updateLocation", cur);
  }
  
  gameend(timecount): void{
    this.CompetitionSocket.emit('gameend', timecount.value);
  }
}
