import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'No content';
  enteredValue ='';

  onAddPost(){
    this.newPost =this.enteredValue;
    //indicates what output at the html when clicked
    console.log("added");
  }

  constructor() { }

  ngOnInit(): void {
  }

}
