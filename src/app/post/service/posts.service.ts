import { Injectable } from '@angular/core';
import { Subject, Observable} from "rxjs";
import {Post} from "../post.model";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] =[];
  private postsUpdated  = new Subject<Post[]>();

  constructor() { }

  getPosts(){
    return [...this.posts];
  }

  addPost(title: string, content:string){
    const post: Post ={title:title, content:content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
  //passing the info into subject(postsUpdated) --> passing/updating this.posts into subject(postsUpdated) with .next()

  getPostUpdate(){
    return this.postsUpdated.asObservable();
  }
  //setting this.postsUpdated as Observable so that we can listen to the private postsUpdated
}
