import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
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
  
  signupCheck(){
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
    this.authService.signup(this.uname, this.password)
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
