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
totalPosts = 0;
postsPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
private postsSub: Subscription;
  constructor(private postsService:PostsService) { }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub =  this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
  onDeletePost(id: string): void {
    console.log('Deleting the post here');
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }


}