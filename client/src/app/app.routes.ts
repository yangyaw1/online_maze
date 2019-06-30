import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { MazeListComponent } from './components/maze-list/maze-list.component';
import { MazeSingleComponent } from './components/maze-single/maze-single.component';

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
        path: 'signin',
        component: SigninPageComponent
    },
    {
        path: 'login/:uname/mazes',
        component: MazeListComponent
    },
    {
        path: 'login/:uname/mazes/:mazeid',
        redirectTo: 'login/:uname/mazes/:mazeid/single'
    },
    {
        path: 'login/:uname/mazes/:mazeid/single',
        component: MazeSingleComponent
    },
    // {
    //     path: '**',
    //     redirectTo: 'login'
    // }
];

export const routing = RouterModule.forRoot(routes);