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
  post: Post;
  isLoading= false;
  private mode = 'create';
  private postId: string;

  //output turns the component into something that can listen to the outside

  onSavePost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading= true ;
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
        this.isLoading= true;
        this.postsService.getOnePost(this.postId)
          .subscribe(postData =>{
            this.isLoading= false ;
            this.post ={id: postData._id, title: postData.title, content: postData.content}
          })   //this is to fetch the content from db and set on the page
      } else{
        this.mode ='create';
        this.post = null;
      }
    });

  }

}
