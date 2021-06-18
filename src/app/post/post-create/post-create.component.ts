import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from "@angular/forms";
import {PostsService} from "../service/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent ='';
  enteredTitle ='';

  //output turns the component in something that can listen to the outside

  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.postsService.addPost(form.value.title,form.value.content);
    form.resetForm(); //clears the form after submission

  }

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
  }

}
