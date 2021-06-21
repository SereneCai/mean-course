import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from "../service/posts.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] =[];
  //or can use the word public in constructor --> constructor(public postsService: PostsService), then no need to declare
  // postsService: PostsService
  private postsSub: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts(); //if post already exist, fetch the initial post from backend
    this.postsSub = this.postsService.getPostUpdate() //set a listener/subscriber to the subject/subscription; changes to posts
      .subscribe((posts: Post[]) =>{
        this.posts = posts; //setting posts for display to posts from the subject
      });
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
