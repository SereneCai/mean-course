import { Injectable } from '@angular/core';
import { Subject, Observable} from "rxjs";
import {Post} from "../post.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

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
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts') //not posts:Post[] because id is wrong
      .pipe(map((postData) =>{
        return postData.posts.map(post =>{
          return{
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))//pipe accepts multiple operators which we can use. eg. map, which creates a new array with the elements
      .subscribe((transformedPosts) =>{
        this.posts = transformedPosts; //setting the posts to postData, which is from the backend
        this.postsUpdated.next([...this.posts]); //passing the data into postsUpdated
    });
  }

  addPost(title: string, content:string){
    const post: Post ={id: null, title:title, content:content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post) //post as 2nd argument, which the data we want to pass
      .subscribe((responseData) =>{
        const id = responseData.postId;
        post.id =id; //json send back the postId, and we assign to the post.id for identity
        this.posts.push(post); //storing data locally when server is successful
        this.postsUpdated.next([...this.posts]);
      })
  }
  //passing the info into subject(postsUpdated) --> passing/updating this.posts into subject(postsUpdated) with .next()

  getPostUpdate(){
    return this.postsUpdated.asObservable();
  }
  //setting this.postsUpdated as Observable so that we can listen to the private postsUpdated

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/'+ postId)
      .subscribe(()=>{
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...updatedPosts]);
      })

  }
}
