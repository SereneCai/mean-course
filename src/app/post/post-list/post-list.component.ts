import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from "../service/posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator"; // an object holding data of the current page

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
  totalPosts = 10; //for the post length
  postsPerPage = 2; //how many displayed
  pageSizeOptions = [1,2,5,10]; //choose how many posts to display
  isLoading= false;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(); //if post already exist, fetch the initial post from backend
    this.postsSub = this.postsService.getPostUpdate() //set a listener/subscriber to the subject/subscription; changes to posts
      .subscribe((posts: Post[]) =>{
        this.isLoading =false;
        this.posts = posts; //setting posts for display to posts from the subject
      });
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
