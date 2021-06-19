import { Injectable } from '@angular/core';
import { Subject, Observable} from "rxjs";
import {Post} from "../post.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] =[];
  private postsUpdated  = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts(){
    //GET posts data from the url set up at node js, with <{message: string, posts: Post[]}> which identifies the type received
    //subscribe to the posts
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) =>{
        this.posts = postData.posts; //setting the posts to postData, which is from the backend
        this.postsUpdated.next([...this.posts]); //passing the data into postsUpdated
    });
  }

  addPost(title: string, content:string){
    const post: Post ={id: null, title:title, content:content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
  //passing the info into subject(postsUpdated) --> passing/updating this.posts into subject(postsUpdated) with .next()

  getPostUpdate(){
    return this.postsUpdated.asObservable();
  }
  //setting this.postsUpdated as Observable so that we can listen to the private postsUpdated
}
