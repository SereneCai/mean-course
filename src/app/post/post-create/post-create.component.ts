import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'No content';

  onAddPost(postInput: HTMLTextAreaElement){
    this.newPost = postInput.value;
    console.log(postInput);
    //indicates what output at the html when clicked
    console.log("added");
  }

  constructor() { }

  ngOnInit(): void {
  }

}
