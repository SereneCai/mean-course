import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostListComponent} from "./post/post-list/post-list.component";
import {PostCreateComponent} from "./post/post-create/post-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  {path:'', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]}, //setting it to dynamically change later
  {path:"auth", loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)} //for lazy loading- load code only when needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //forRoot so they refers always to routes
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
