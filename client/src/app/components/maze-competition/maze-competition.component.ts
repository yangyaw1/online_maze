import { Component, Input, OnInit, ElementRef, AfterViewInit, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { Maze } from '../../models/maze.model';
import { Subscription } from 'rxjs';
import { Observable, fromEvent } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationStart, NavigationEnd} from '@angular/router';
// import { MAZES } from '../../mock-maze';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { CompetitionService } from '../../services/competition.service';

@Component({
  selector: 'app-maze-competition',
  templateUrl: './maze-competition.component.html',
  styleUrls: ['./maze-competition.component.css']
})
export class MazeCompetitionComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy{
  // maze info
  maze: Maze;
  subscriptionMaze: Subscription;
  nodesize: number;
  cur: number;
  start_on: boolean = false;
  uname: string;
  to_show: boolean = false;
  is_waiting: boolean = false;
  roomId: number;
  countdowntime: number = 5;
  winner_name: string = '';
  winner_time: {value: number} = {value: 0};
  
  // oppo info
  oppo_info: {
    is_on: boolean;
    is_waiting: boolean;
    prev: number;
    cur: number;
    uname: string;
    flag_connect: boolean;
    flag_countdown: boolean;
    flag_position: boolean;
    flag_disconnect: boolean;
    flag_gameend: boolean
  } = {
    is_on: false,
    is_waiting: false,
    prev: -1,
    cur: -1,
    uname: '',
    flag_connect: false,
    flag_countdown: false,
    flag_position: false,
    flag_disconnect: false,
    flag_gameend: false
  }
  
  
  
  // falsh info
  flash_on: boolean = false;
  private timerFlash;
  private timerCount;
  subscriptionKeypress: Subscription;
  
  // record time
  timecount: {value: number} = {value: 0};
  
  // create canvas component
  @ViewChild('canvas_oppo', {static: false}) canvas_oppo: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @ViewChild('modalOn', {static: false}) modalOn: ElementRef;
  @ViewChild('modalCountdown', {static: false}) modalCountdown:ElementRef;
  @ViewChild('modalGameend', {static: false}) modalGameend:ElementRef;
  @ViewChild('modalDisconnect', {static: false}) modalDisconnect:ElementRef;
  @ViewChild('gameendModalCancel', {static: false}) gameendModalCancel:ElementRef;
  @ViewChild('disconnectModalCancel', {static: false}) disconnectModalCancel:ElementRef;
  
  private cx: CanvasRenderingContext2D;
  private cx_oppo: CanvasRenderingContext2D;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
              private authService: AuthService,
              private competitionService: CompetitionService) { }

  ngOnInit() {
    console.log('start!');
    this.route.params.subscribe(params => {
      // this.maze = MAZES.find((maze) => maze.id === +params['mazeid']);
      this.uname = params['uname'];
      this.roomId = +params['roomid']
      this.authService.checktoken(this.uname)
       .then(res => {this.to_show = true},
       err => {
        // this.to_show = true
        this.router.navigate(['/login']);
       });
      this.dataService.getmaze(+params['mazeid'])
          .then(maze => {
            this.maze = maze;
            this.nodesize = 500/this.maze.width;
            this.cur = this.maze.start;
            this.oppo_info.prev = this.cur;
            this.oppo_info.cur = this.cur;
            this.createcanvas();
            this.competitionService.init(this.oppo_info, this.roomId, this.winner_time);
            this.competitionService.connect(this.uname);
          });
      }
      );
  }
  
  ngAfterViewInit() {
    // console.log(this.canvas);
    // console.log(this.canvas_oppo);
  };
  
  ngDoCheck(){
    if(this.oppo_info.flag_connect){
       this.oppo_info.flag_connect = false;
       this.oppo_info.cur = this.maze.start;
       this.oppo_info.prev = this.maze.start;
       this.disconnectModalCancel.nativeElement.click();
    }
    if(this.oppo_info.flag_countdown){
       this.oppo_info.flag_countdown = false;
       this.countdown()
    }
    if(this.oppo_info.flag_position){
       this.oppo_info.flag_position = false;
       this.drawnode(this.cx_oppo, this.oppo_info.prev, 'white');
       this.drawnode(this.cx_oppo, this.oppo_info.cur, 'red');
       this.oppo_info.prev = this.oppo_info.cur;
    }
    if(this.oppo_info.flag_disconnect){
      this.oppo_info.flag_disconnect = false;
      if(this.start_on === true){
        this.StartOrReset();
        this.timecount.value = 0;
        this.winner_name = '';
      }
      this.gameendModalCancel.nativeElement.click();
      this.modalCountdown.nativeElement.click();
      this.modalDisconnect.nativeElement.click();
    }
    if(this.oppo_info.flag_gameend){
      this.oppo_info.flag_gameend = false;
      this.StartOrReset();
      this.modalGameend.nativeElement.click();
    }
  }
  
  createcanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;;
    const canvas_oppoEl: HTMLCanvasElement = this.canvas_oppo.nativeElement;;
    this.cx = canvasEl.getContext('2d');
    this.cx_oppo = canvas_oppoEl.getContext('2d');
    
    canvasEl.width = this.nodesize*this.maze.width;
    canvasEl.height = this.nodesize*this.maze.height;
    canvas_oppoEl.width = this.nodesize*this.maze.width;
    canvas_oppoEl.height = this.nodesize*this.maze.height;
    // initial color
    for(let i = 0; i < this.maze.graph.length; i++){
        if(this.maze.graph[i] === '0'){
          this.drawnode(this.cx_oppo, i, 'black');
          this.drawnode(this.cx, i, 'black');
        } else if(this.maze.start === i){
          this.drawnode(this.cx_oppo, i, 'red');
          this.drawnode(this.cx, i, 'red');
        } else if(this.maze.end === i){
          this.drawnode(this.cx_oppo, i, 'blue');
          this.drawnode(this.cx, i, 'blue');
        }
    };
  }
  
  // function to draw each node in maze
  drawnode(instance, i, color){
    let x = i%this.maze.width;
    let y = (i-x)/this.maze.width;
    instance.fillStyle = color;
    instance.fillRect(x*this.nodesize, y*this.nodesize, this.nodesize, this.nodesize);
  };
  
  // make current node to flash
  flashnode() {
    this.flash_on = !this.flash_on;
    let color = 'white';
    if(this.flash_on) color = 'red';
    this.drawnode(this.cx_oppo, this.oppo_info.cur, color);
    this.drawnode(this.cx, this.cur, color);
  }
  
  // waiting for oppoent
  waiting() {
    this.is_waiting = true;
    this.competitionService.ready(true);
  }
  
  // count down
  countdown() {
    if(this.is_waiting && this.oppo_info.is_waiting){
       this.is_waiting = false;
       this.oppo_info.is_waiting = false;
       this.modalOn.nativeElement.click();
       var countdownInterval = setInterval(() => {
          this.countdowntime -= 1;
          console.log(this.countdowntime);
          if(this.countdowntime === 0){
             this.countdowntime = 5;
             this.modalCountdown.nativeElement.click();
             if(this.oppo_info.is_on){
                this.StartOrReset();
             }
             clearInterval(countdownInterval);
          }
       }, 1000)
    }
  }
  
  // start or reset the game
  StartOrReset() {
    if(!this.start_on){
      this.timerCount = setInterval(() => {
         this.timecount.value +=0.01}, 10);
      this.timerFlash = setInterval(() => {
         this.flashnode()}, 400);
      this.start_on = true;
      this.subscriptionKeypress = fromEvent(document, 'keydown').subscribe(e => {
        this.handleKeyDown(e);
      });
    } else {
      this.start_on = false;
      clearInterval(this.timerFlash);
      clearInterval(this.timerCount);
      this.subscriptionKeypress.unsubscribe();
      if(this.winner_name === ''){
        this.winner_name = this.oppo_info.uname;
      }
      if(this.cur != this.maze.end){
        this.drawnode(this.cx, this.cur, 'white');
      }
      if(this.oppo_info.cur != this.maze.end){
        this.drawnode(this.cx_oppo, this.oppo_info.cur, 'white');
      }
      this.drawnode(this.cx, this.maze.end, 'blue');
      this.drawnode(this.cx_oppo, this.maze.end, 'blue');
      this.cur = this.maze.start;
      this.oppo_info.cur = this.maze.start;
      this.oppo_info.prev = this.maze.start;
      this.drawnode(this.cx, this.cur, 'red');
      this.drawnode(this.cx_oppo, this.cur, 'red');
    }
  }
  
  //close gameend modal
  gameendClose(){
    this.timecount.value = 0;
    this.winner_time.value = 0;
    this.winner_name = '';
  }
  
  // move the position when press keys
  handleKeyDown(event){
    // left, up, right, down
    let move_list = [-1, -this.maze.width, 1, this.maze.width];
    let id = (+event.keyCode-37);
    if(id >= 0 && id < 4){
      let nex = this.cur + move_list[id];
      if(nex >= 0 && nex < this.maze.graph.length && this.maze.graph[nex] === "1"){
        this.drawnode(this.cx, this.cur, 'white');
        this.cur = nex;
        if(this.cur === this.maze.end){
          this.winner_name = this.uname;
          this.competitionService.gameend(this.timecount);
          // this.gameend();
        } else {
          this.competitionService.updateLocation(this.cur);
          this.drawnode(this.cx, this.cur, 'red');
        }
      }
    };
  }
  
  
  // clear timer
  ngOnDestroy() {
    if(this.timerFlash){
      clearInterval(this.timerFlash);
    }
    if(this.timerCount){
      clearInterval(this.timerCount);
    }
    if(this.subscriptionKeypress){
      this.subscriptionKeypress.unsubscribe();
    }
  }
}

