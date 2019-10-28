import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../model/Ipost.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = '';
  enteredTitle = '';
  enteredContent = '';
  form: FormGroup;
  post: Post;
  imagePreview: string;
  isLoading = false;
  private mode = 'create';
  private postId: string;


  constructor(private postService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      content: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData =>{
          this.isLoading = false;
          this.post = {id:postData._id, title:postData.title, content: postData.content};
          this.form.setValue({
            title: this.post.title,
            content:this.post.content
          });
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onSavePost(postForm:any): void {
    if (postForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(postForm.title, postForm.content, postForm.image);
    } else {
      this.postService.updatePost(this.postId, postForm.title, postForm.content);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    // Telling typescript that this will be HTMLInputElement
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    // mmmm I am pretty sure you don't have to call updateValueAndValidity after a patch.
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    // set to function because async will take awhile so set to function and callback
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
