import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  signUpShow: boolean = false
  loginShow: boolean = false
  logoutShow: boolean = true
  
  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    if(this.router.url === '/login'){
      this.logoutShow = false
      this.signUpShow = true
    } else if (this.router.url === '/signin'){
      this.logoutShow = false
      this.loginShow = true
    }
  }

  signup() {
    this.router.navigate(['/signin']);
  }
  
  login() {
    this.router.navigate(['/login']);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
