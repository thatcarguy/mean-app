import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../model/Ipost.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  newPost = '';
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(private postService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onAddPost(postForm:NgForm): void {
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }

}
