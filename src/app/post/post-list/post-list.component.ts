import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from "../service/posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service"; // an object holding data of the current page

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
  totalPosts = 0; //for the post length
  postsPerPage = 2; //how many displayed
  pageSizeOptions = [1,2,5,10]; //choose how many posts to display
  currentPage = 1; //initial value of the current page
  isLoading= false;
  private authStatusSubs: Subscription;
  userAuthenticated = false;
  userId: string;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //if post already exist, fetch the initial post from backend
    //send postsPerPage, and 1 as the currentPage for argument
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdate() //set a listener/subscriber to the subject/subscription; changes to posts
      .subscribe((postData:{ posts: Post[], postCount: number}) =>{
        this.isLoading =false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts; //setting posts for display to posts from the subject
      });
    this.userAuthenticated = this.authService.getIsAuthenticated();
    //because page will only load after authentication, so this line will help load the page to make sure delete/edit is displayed
    //subscribe are all async/promises**
    this.authStatusSubs =this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated =>{
          this.userAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
      })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading= true;
    this.currentPage = pageData.pageIndex + 1; //pageIndex starts at 0, but backend starts at 1
    this.postsPerPage = pageData.pageSize; //as selected by user at the dropdown
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    })
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
