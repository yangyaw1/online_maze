import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Maze } from '../../models/maze.model';
import { Subscription } from 'rxjs';
import { Observable, fromEvent } from 'rxjs';
import { ActivatedRoute, Params, Router, NavigationStart, NavigationEnd} from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

const DEFAULT_MAZE: Maze = Object.freeze({
  'id': 0,
  'graph': '',
  'width': 0,
  'height': 0,
  'start': 0,
  'end': 0,
  'size': ''
})

@Component({
  selector: 'app-new-maze',
  templateUrl: './new-maze.component.html',
  styleUrls: ['./new-maze.component.css']
})
export class NewMazeComponent implements OnInit {
  uname: string;
  to_show: boolean = false;
  maze: Maze = Object.assign({}, DEFAULT_MAZE);
  width: string;
  height: string;
  widthMessage: string;
  heightMessage: string;
  message: string;
  canvas_on: boolean = false;
  nodesize: number;
  create_on: boolean = true;
  submitMessage: string;
  
  @ViewChild('canvas', {static: false}) public canvas: ElementRef;
  @ViewChild('modalSubmit', {static: false}) public modalSubmit: ElementRef;
  private cx: CanvasRenderingContext2D;
  
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: DataService,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.maze = MAZES.find((maze) => maze.id === +params['mazeid']);
      this.uname = params['uname'];
      this.authService.checktoken(this.uname)
       .then(res => {this.to_show = true},
       err => {
         this.router.navigate(['/login']);
       });
      }
    );
  }
  
  createMaze(){
    if(this.widthMessage){
      this.message = this.widthMessage;
    } else if(this.heightMessage){
      this.message = this.heightMessage;
    } else if(+this.width/(+this.height) < 0.8){
      this.message = 'width is too small compare to height!'
    } else if(+this.width/(+this.height) > 1.2){
      this.message = 'height is too small compare to witdth!'
    } else{
      this.message = '';
      this.dataService.createmaze(+this.width, +this.height)
          .then(res => {
            this.maze = res;
            this.canvas_on = true;
            this.width = '';
            this.height = '';
            this.nodesize = 500/this.maze.width;
            this.create_on = false;
            this.createcanvas();
          }, err =>{
            console.log('Cannot create maze');
          });
    }
  }
  
  createcanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    
    canvasEl.width = this.nodesize*this.maze.width;
    canvasEl.height = this.nodesize*this.maze.height;
    
    // initial color
    for(let i = 0; i < this.maze.graph.length; i++){
        if(this.maze.graph[i] === '0'){
          this.drawnode(i, 'black');
        } else if(this.maze.start === i){
          this.drawnode(i, 'red');
        } else if(this.maze.end === i){
          this.drawnode(i, 'blue');
        }
    };
  }
  
  addMaze(){
    this.dataService.addmaze(this.maze)
        .then(res => {
             this.submitMessage = 'Successfully add the maze to maze list!';
             this.modalSubmit.nativeElement.click();
             this.canvas_on = false;
             this.create_on = true;
             this.maze = Object.assign({}, DEFAULT_MAZE);
          },
             err => { 
             this.submitMessage = 'Cannot add this maze to maze list!';
             this.modalSubmit.nativeElement.click();
             this.canvas_on = false;
             this.create_on = true;
             this.maze = Object.assign({}, DEFAULT_MAZE);
          });
  }
  
  cancelCreate(){
    this.canvas_on = false;
    this.create_on = true;
  }
  
  drawnode(i, color){
    let x = i%this.maze.width;
    let y = (i-x)/this.maze.width;
    this.cx.fillStyle = color;
    this.cx.fillRect(x*this.nodesize, y*this.nodesize, this.nodesize, this.nodesize);
  };
   
  checkValidWidth(){
    if(this.width){
      if(/^\d+$/.test(this.width)){
        var value = Number(this.width);
        if(this.width !== '0' && this.width[0] === '0'){
          this.widthMessage = 'The width cannot start with 0.'
        } else if(value < 5){
          this.widthMessage = 'The width should be at least 5.'
        } else if(value > 79){
          this.widthMessage = 'The width should be at most 79.'
        } else if(value%2 === 0){
          this.widthMessage = 'The width should an odd number.'
        } else {
          this.widthMessage = '';
        }
      } else{
        this.widthMessage = 'The width must be a positive integer without +.'
      }
    } else{
      this.widthMessage = '';
    }
  }
  
  checkValidHeight(){
    if(this.height){
      if(/^\d+$/.test(this.height)){
        var value = Number(this.height);
        if(this.height !== '0' && this.height[0] === '0'){
          this.heightMessage = 'The height cannot start with 0.'
        } else if(value < 5){
          this.heightMessage = 'The height should be at least 5.'
        } else if(value > 79){
          this.heightMessage = 'The height should be at most 79.'
        } else if(value%2 === 0){
          this.heightMessage = 'The height should an odd number.'
        } else {
          this.heightMessage = '';
        }
      } else{
        this.heightMessage = 'The height must be a positive integer without +.'
      }
    } else {
      this.heightMessage = '';
    }
  }
}
