import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts =[
    {title: 'First', content: "This is the first test."},
    {title: 'Second', content: "This is the second test."},
    {title: 'Third', content: "This is the third test."},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
