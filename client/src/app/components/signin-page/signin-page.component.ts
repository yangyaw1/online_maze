import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit {
  users: User[];
  subscriptionUsers: Subscription;
  uname: string;
  password: string;
  confirmPassword: string;
  message: string;
  
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.uname = '';
    this.password = '';
    this.message = '';
    this.confirmPassword = '';
  }
  
  signinCheck(){
    if(!this.uname){
      this.message = 'Please enter username!'
      return;
    }
    if(!this.password){
      this.message = 'Please enter password!'
      return;
    }
    if(this.password != this.confirmPassword){
      this.message = 'Password mismatchs!'
      return;
    }
    this.authService.signin(this.uname, this.password)
        .then((res) => {
          this.message = 'Correct';
          this.login();
        }, (err) => {
          this.message = 'Username already exists!';
        })
  }
  
  login(){
    this.router.navigate(['/login', this.uname, 'mazes']);
  }
  
  
  ngOnDestroy() {
    // this.subscriptionUsers.unsubscribe();
  }

}
