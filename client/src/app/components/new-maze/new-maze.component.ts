import { Component, OnInit } from '@angular/core';
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
    } else if(+this.width/(+this.height) < 0.5){
      this.message = 'width is too small compare to height!'
    } else if(+this.width/(+this.height) > 2){
      this.message = 'height is too small compare to witdth!'
    } else{
      this.maze.width = +this.width;
      this.maze.height = +this.height;
      this.dataService.addmaze(this.maze);
    }
  }
   
  checkValidWidth(){
    if(this.width){
      if(/^\d+$/.test(this.width)){
        var value = Number(this.width);
        if(this.width !== '0' && this.width[0] === '0'){
          this.widthMessage = 'The width cannot start with 0.'
        } else if(value < 5){
          this.widthMessage = 'The width should be at least 5.'
        } else if(value > 100){
          this.widthMessage = 'The width should be at most 100.'
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
        } else if(value > 100){
          this.heightMessage = 'The height should be at most 100.'
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
