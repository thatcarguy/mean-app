import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../model/Ipost.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

//   posts = [{
//     title: 'First Post', content: 'First Post Content'
//   },
//   {
//     title: 'Second Post', content: 'Second Post Content'
//   },
//   {
//     title: 'Third Post', content: 'Third Post Content'
//   }
// ];
// @Input() posts: Post[]= [];
posts: Post[] = [];
isLoading = false;
totalPosts = 10;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
private postsSub: Subscription;
  constructor(private postsService:PostsService) { }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub =  this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
  onDeletePost(id: string): void {
    console.log('Deleting the post here');
    this.postsService.deletePost(id);
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }


}
