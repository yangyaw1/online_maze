import { Component, Input, OnInit, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Maze } from '../../models/maze.model';
import { Subscription } from 'rxjs';
import { Observable, fromEvent } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationStart, NavigationEnd} from '@angular/router';
// import { MAZES } from '../../mock-maze';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-maze-single',
  templateUrl: './maze-single.component.html',
  styleUrls: ['./maze-single.component.css']
})
export class MazeSingleComponent implements OnInit, AfterViewInit, OnDestroy {
  // maze info
  maze: Maze;
  subscriptionMaze: Subscription;
  nodesize: number;
  cur: number;
  start_on: boolean = false;
  uname: string;
  to_show: boolean = false;
  hasRestore: boolean = false;
  
  // falsh info
  flash_on: boolean = false;
  private timerFlash;
  private timerCount;
  subscriptionKeypress: Subscription;
  buttonmessage: string;
  
  // record time
  timecount: number = 0;
  
  // create canvas component
  @ViewChild('canvas', {static: false}) public canvas: ElementRef;
  @ViewChild('modalOn', {static: false}) modalOn:ElementRef;
  private cx: CanvasRenderingContext2D;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
              private authService: AuthService) { }

  ngOnInit() {
    console.log('start!');
    this.route.params.subscribe(params => {
      // this.maze = MAZES.find((maze) => maze.id === +params['mazeid']);
      this.uname = params['uname'];
      this.authService.checktoken(this.uname)
       .then(res => {this.to_show = true},
       err => {
         this.router.navigate(['/login']);
       });
      this.dataService.getmaze(+params['mazeid'])
          .then(maze => {
            this.maze = maze;
            console.log(this.maze.width);
            this.nodesize = 500/this.maze.width;
            // check if cur is stored
            this.dataService.restoreProcess(this.uname, +params['mazeid'])
                .then(data => {
                  this.cur = data.cur;
                  this.timecount = +data.timecount;
                  this.modalOn.nativeElement.click();
                  this.createcanvas();
                }, err => {
                  this.cur = this.maze.start;
                  this.timecount = 0;
                  this.createcanvas();
                });
            this.buttonmessage = 'Start the game!'
          });
      }
      );
  }
  
  ngAfterViewInit() {

  };
  
  
  createcanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    
    canvasEl.width = this.nodesize*this.maze.width;
    canvasEl.height = this.nodesize*this.maze.height;
    
    // initial color
    for(let i = 0; i < this.maze.graph.length; i++){
        if(this.maze.graph[i] === '0'){
          this.drawnode(i, 'black');
        } else if(this.cur === i){
          this.drawnode(i, 'red');
        } else if(this.maze.end === i){
          this.drawnode(i, 'blue');
        }
    };
  }
  
  // function to draw each node in maze
  drawnode(i, color){
    let x = i%this.maze.width;
    let y = (i-x)/this.maze.width;
    this.cx.fillStyle = color;
    this.cx.fillRect(x*this.nodesize, y*this.nodesize, this.nodesize, this.nodesize);
  };
  
  // make current node to flash
  flashnode() {
    this.flash_on = !this.flash_on;
    let color = 'white';
    if(this.flash_on) color = 'red';
    this.drawnode(this.cur, color);
  }
  
  // start or reset the game
  StartOrReset() {
    if(!this.start_on){
      this.timerCount = setInterval(() => {
         this.timecount+=0.01}, 10);
      this.timerFlash = setInterval(() => {
         this.flashnode()}, 400);
      this.start_on = true;
      this.subscriptionKeypress = fromEvent(document, 'keydown').subscribe(e => {
        this.handleKeyDown(e);
      })
      this.buttonmessage = 'Reset the game!';
    } else {
      this.timecount = 0;
      this.start_on = false;
      clearInterval(this.timerFlash);
      clearInterval(this.timerCount);
      this.subscriptionKeypress.unsubscribe();
      if(this.cur != this.maze.end) this.drawnode(this.cur, 'white');
      this.cur = this.maze.start;
      this.drawnode(this.cur, 'red');
      this.buttonmessage = 'Start the game!';
    }
  }
  
  // end the game
  gameend() {
    clearInterval(this.timerFlash);
    clearInterval(this.timerCount);
    this.subscriptionKeypress.unsubscribe();
  }
  
  // move the position when press keys
  handleKeyDown(event){
    // left, up, right, down
    console.log('occurs!');
    let move_list = [-1, -this.maze.width, 1, this.maze.width];
    let id = (+event.keyCode-37);
    if(id >= 0 && id < 4){
      let nex = this.cur + move_list[id];
      if(nex >= 0 && nex < this.maze.graph.length && this.maze.graph[nex] === "1"){
        this.drawnode(this.cur, 'white');
        this.cur = nex;
        if(this.cur === this.maze.end){
          this.gameend();
        } else {
          this.drawnode(this.cur, 'red');
        }
      }
    };
  }
  
  saveProcess() {
    if(this.start_on && this.timecount !== 0 && this.cur !== this.maze.end){
      console.log('hi');
      this.dataService.saveProcess(this.uname, this.maze.id, this.cur, this.timecount.toFixed(2));
    }
  }
  
  resetProcess() {
    this.drawnode(this.cur, 'white');
    this.cur = this.maze.start;
    this.drawnode(this.cur, 'red');
    this.timecount = 0;
  }
  
  // clear timer
  ngOnDestroy() {
    console.log('leave!');
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
