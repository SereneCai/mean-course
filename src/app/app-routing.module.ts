import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostListComponent} from "./post/post-list/post-list.component";
import {PostCreateComponent} from "./post/post-create/post-create.component";

const routes: Routes = [
  {path:'', component: PostListComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent}, //setting it to dynamically change later
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //forRoot so they refers always to routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
