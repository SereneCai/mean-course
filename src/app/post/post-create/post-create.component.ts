import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../service/posts.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {mimeType} from './mime-type.validator'; //validators are function

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent ='';
  enteredTitle ='';
  post: Post;
  isLoading= false;
  form: FormGroup; //groups all control of the form
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  ngOnInit(): void {
    this.form = new FormGroup({
      'title' : new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]},),
      //beginning form state (null = empty input),
      // validators/form ctrl options(js object)
      'content': new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
    });
    //set to null for new post
    //paramMap is an observable
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading= true;
        this.postsService.getOnePost(this.postId)
          .subscribe(postData =>{
            this.isLoading= false ;
            this.post ={
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({'title': this.post.title, 'content': this.post.content, image: this.post.imagePath});
            //allows you to override the values for form control at the top in case you want to edit the form
          });
        //this is to fetch the content from db and set on the page

      } else{
        this.mode ='create';
        this.post = null;
      }
    });

  }

  //output turns the component into something that can listen to the outside

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); //target a single control
    //not limited to just storing text, but img as well
    this.form.get("image").updateValueAndValidity();
    //reach out to form and get the image
    //informs angular you changed the value and that it should re-evaluate and store the value internally, and check if it is valid
    const reader = new FileReader(); //javascript function,  //create reader
    reader.onload =()=>{
      this.imagePreview = reader.result as string; //typescript function. using reader.result may not work
      //defining what should happen after it is done reading a file
    };
    reader.readAsDataURL(file); //instruct to load the file
  }

  onSavePost(){
    //no longer an arguement.
    //remove form: NgForm from onSavePost
    //add this. to the form
    if(this.form.invalid){
      return;
    }
    this.isLoading = true ;
    if (this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset(); //clears the form after submission
    //for template, resetForm();
    // for reactive, reset();
  }
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

}
