import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Maze } from '../../models/maze.model';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

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
  constructor(private route: ActivatedRoute, 
  private router: Router,
  private dataService: DataService,
  private authService: AuthService) { }

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
  
  singleMode(id: number) {
    this.router.navigate(['/login', this.uname, 'mazes', id, 'single']);
  }
  
  competitionMode(id: number) {
    this.router.navigate(['/login', this.uname, 'mazes', id, 'single']);
  }

}
