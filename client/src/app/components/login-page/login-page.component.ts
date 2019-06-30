import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  users: User[];
  subscriptionUsers: Subscription;
  uname: string;
  password: string;
  message: string;
  toShow: boolean = false;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.homecheck()
       .then(res => {
         this.router.navigate(['/login', res, 'mazes']);
       },
       err => {
         this.toShow = true;
         this.uname = ''
         this.password = '';
         this.message = '';
       });
    this.uname = '';
    this.password = '';
    this.message = '';
  }
  
  loginCheck(){
    if(!this.uname){
      this.message = 'Please enter username!'
      return;
    }
    if(!this.password){
      this.message = 'Please enter password!'
      return;
    }
    this.authService.login(this.uname, this.password)
        .then((res) => {
          this.message = 'Correct';
          this.login();
        }, (err) => {
          this.message = 'Incorrect username or password!';
        })
    // let user = this.users.find(user => user.uname === this.uname);
    // console.log(user);
    // if(user){
    //   if(user.password === this.password){
    //     this.login();
    //   } else {
    //     this.message = 'Incorrect password!'
    //   }
    // } else {
    //   this.message = 'Cannot find username!'
    // }
  }
  
  login(){
    this.router.navigate(['/login', this.uname, 'mazes']);
  }
  
  ngOnDestroy() {
    // this.subscriptionUsers.unsubscribe();
  }
}
