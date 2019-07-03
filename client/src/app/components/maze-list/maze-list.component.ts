import { Component, OnInit, ElementRef, ViewChild, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Maze } from '../../models/maze.model';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-maze-list',
  templateUrl: './maze-list.component.html',
  styleUrls: ['./maze-list.component.css']
})
export class MazeListComponent implements OnInit, OnDestroy  {
  uname: string;
  subsriptionMazes: Subscription;
  mazes: Maze[];
  to_show: boolean = false;
  roomidToCreate: number;
  roomidToConnect: string;
  message: string;
  showError: boolean = false;
  mazeid: number;
  
  @ViewChild('modalOn', {static: false}) modalOn:ElementRef;
  
  constructor(private route: ActivatedRoute, 
  private router: Router,
  private dataService: DataService,
  private authService: AuthService,
  private roomService: RoomService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uname = params['uname'];
      this.authService.checktoken(this.uname)
       .then(res => {this.to_show = true},
       err => {
         this.router.navigate(['/login']);
       })
      this.subsriptionMazes = this.dataService.getmazes()
       .subscribe(mazes => {
         this.mazes = mazes;
       });
      // this.to_show = true;
    });
  }
  
  ngOnDestroy() {
    this.subsriptionMazes.unsubscribe();
  }
  
  createRoomid(){
    this.roomService.getRoomid()
       .then(roomid => this.roomidToCreate = +roomid.content);
    // data === parseInt(data, 10)
  }
  
  createRoom(id: number){
    this.roomService.createRoom(this.uname, this.roomidToCreate, this.mazeid)
      .then(roomid => {
            this.router.navigate(['/login', this.uname, 'mazes', this.mazeid, 'room', this.roomidToCreate]);
        }, error => {
            this.message = 'The room is already in used. Please recreate.'
            this.modalOn.nativeElement.click();
            console.log(this.message);
        });
    // data === parseInt(data, 10)
  }
  
  joinRoom(id: number){
    this.roomService.joinRoom(this.uname, +this.roomidToConnect, this.mazeid)
      .then(roomid => {
            this.router.navigate(['/login', this.uname, 'mazes', this.mazeid, 'room', this.roomidToConnect]);
        }, error => {
            this.message = 'Room is not avaiable now!';
            this.modalOn.nativeElement.click();
            console.log(this.message);
        });
    // data === parseInt(data, 10)
  }
  mazeIdSelect(mazeid){
    this.mazeid = mazeid;
  }
  checkValidId() {
    if(this.roomidToConnect === '' || /^\d+$/.test(this.roomidToConnect)){
      this.showError = false;
    } else {
      this.showError = true;
    }
  }
  singleMode(id: number) {
    this.router.navigate(['/login', this.uname, 'mazes', id, 'single']);
  }
  
  competitionMode(id: number) {
    this.router.navigate(['/login', this.uname, 'mazes', id, 'single']);
  }

}
