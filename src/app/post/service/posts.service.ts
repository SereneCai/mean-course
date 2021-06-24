import { Injectable } from '@angular/core';
import { Subject, Observable} from "rxjs";
import {Post} from "../post.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] =[];
  private postsUpdated  = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  //fetch data at reload at the main page
  getPosts(){
    //GET posts data from the url set up at node js, with <{message: string, posts: Post[]}> which identifies the type received
    //subscribe to the posts
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts') //not posts:Post[] because id is wrong
      .pipe(map((postData) =>{
        return postData.posts.map(post =>{
          return{
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
          };
        });
      }))//pipe accepts multiple operators which we can use. eg. map, which creates a new array with the elements
      .subscribe((transformedPosts) =>{
        this.posts = transformedPosts; //setting the posts to postData, which is from the backend
        this.postsUpdated.next([...this.posts]); //passing the data into postsUpdated
    });
  }

  addPost(title: string, content:string, image: File){
   const postData = new FormData(); //allow combination of text values and blobs(file values)
    postData.append("title", title );
    postData.append("content", content);
    postData.append("image", image, title ); //3rd arg is the file name provided to the backend
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      //post as 2nd argument, which the data we want to pass
      .subscribe((responseData) =>{
        const post: Post ={id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
        this.posts.push(post); //storing data locally when server is successful
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }
  //passing the info into subject(postsUpdated) --> passing/updating this.posts into subject(postsUpdated) with .next()
  //setting this.postsUpdated as Observable so that we can listen to the private postsUpdated
  //all changes are pass to postUpdated, and subscribed to by other functions to actively update
  getPostUpdate(){
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/'+ postId)
      .subscribe(()=>{
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...updatedPosts]);
      })
  }

  getOnePost(id: string){
      return this.http.get<{_id: string, title: string, content: string, imagePath: string}>
      ('http://localhost:3000/api/posts/'+ id);
  }

  //to update when there are changes to the posts, dynamically
  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    }
    else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/'+ id, postData)
      .subscribe((response)=>{
        const updatedPosts = [...this.posts];
        const oldPost = updatedPosts.findIndex( p=> p.id === id);
        const post: Post ={
          id: id,
          title: title,
          content: content,
          imagePath: ""
        }
        updatedPosts[oldPost] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }) //this.router.navigate([]); --> [] used because we need to pass an array of segments
  }
}
