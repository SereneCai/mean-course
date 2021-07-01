import {NgModule} from "@angular/core";
import {PostCreateComponent} from "./post-create/post-create.component";
import {PostListComponent} from "./post-list/post-list.component";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent,
  ],
  imports:[
    ReactiveFormsModule
  ]
})

export class PostsModule{}
