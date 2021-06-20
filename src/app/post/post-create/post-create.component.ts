import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from "@angular/forms";
import {PostsService} from "../service/posts.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent ='';
  enteredTitle ='';
  private mode = 'create';
  private postId: string;
  post: Post;

  //output turns the component in something that can listen to the outside

  onSavePost(form: NgForm){
    if(form.invalid){
      return;
    }
    if (this.mode === 'create'){
      this.postsService.addPost(form.value.title,form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title,form.value.content);
    }
    form.resetForm(); //clears the form after submission

  }

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    //paramMap is an observable
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post =this.postsService.getOnePost(this.postId);
      } else{
        this.mode ='create';
      }
    });

  }

}
