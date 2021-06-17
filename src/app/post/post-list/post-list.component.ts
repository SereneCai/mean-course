import { Component, OnInit, Input } from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from "../service/posts.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] =[];
  //or can use the word public in constructor --> constructor(public postsService: PostsService), then no need to declare
  private postsSub: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts(); //setting this.posts as [...this.posts];
    this.postsSub = this.postsService.getPostUpdate()
      .subscribe((posts: Post[]) =>{
        this.posts = posts;
      });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
