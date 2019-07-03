import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MazeListComponent } from './components/maze-list/maze-list.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MazeSingleComponent } from './components/maze-single/maze-single.component';

import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MazeCompetitionComponent } from './components/maze-competition/maze-competition.component';
import { NewMazeComponent } from './components/new-maze/new-maze.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeListComponent,
    LoginPageComponent,
    MazeSingleComponent,
    SignupPageComponent,
    NavbarComponent,
    MazeCompetitionComponent,
    NewMazeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
