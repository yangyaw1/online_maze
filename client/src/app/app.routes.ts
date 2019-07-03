import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { MazeListComponent } from './components/maze-list/maze-list.component';
import { MazeSingleComponent } from './components/maze-single/maze-single.component';
import { MazeCompetitionComponent } from './components/maze-competition/maze-competition.component';
import { NewMazeComponent } from './components/new-maze/new-maze.component';

const routes: Routes = [
    // Homework
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'signup',
        component: SignupPageComponent
    },
    {
        path: 'login/:uname/mazes',
        component: MazeListComponent
    },
    {
        path: 'login/:uname/mazes/:mazeid/single',
        component: MazeSingleComponent
    },
    {
        path: 'login/:uname/mazes/:mazeid/room/:roomid',
        component: MazeCompetitionComponent
    },
    {
        path: 'login/:uname/newmaze',
        component: NewMazeComponent
    }
    // {
    //     path: '**',
    //     redirectTo: 'login'
    // }
];

export const routing = RouterModule.forRoot(routes);