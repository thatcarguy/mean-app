import { Injectable } from '@angular/core';
import { Post } from './model/Ipost.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { p } from '@angular/core/src/render3';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
 url = 'http://localhost:3000/api/posts';
 private posts: Post[] = [];
 private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
 constructor(private http: HttpClient, private router: Router) {}

 // When copying array we need to use spread object.
 // Java script copies by reference so we wouldve just got the pointer to this.posts.
 getPosts(postsPerPage: number, currentPage: number) {
   // Creating query url with dynamic string with backticks. allows us to add data dynamically.
   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
  this.http.get<{message: string, posts: any, maxPosts: number}>(this.url + queryParams)
  .pipe(map((postData) => {
    return { posts: postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        creator: post.creator
      };
    }), maxPosts: postData.maxPosts};
  }))
  .subscribe(transformedPosts => {
    console.log(transformedPosts);
    this.posts = transformedPosts.posts;
    this.postsUpdated.next({
      posts: [...this.posts],
      postCount: transformedPosts.maxPosts
    });
  });
 }
 getPostUpdateListener() {
   return this.postsUpdated.asObservable();
 }
 getPost(id: string) {
   return this.http.get<{_id:string, title:string, content:string, imagePath: string}>(this.url + '/' + id);
 }
 addPost(title: string, content: string, image: File) {
   const postData = new FormData();
   postData.append('title', title);
   postData.append('content', content);
   postData.append('image', image, title);

   this.http.post<{message: string, post: Post}>(this.url, postData)
    .subscribe((responseData) => {
      this.router.navigate(["/"]);
    });
 }

 updatePost(id: string, title: string, content: string, image: File | string) {
  let postData: Post | FormData;
  if (typeof(image)==='object'){
    postData = new FormData();
    postData.append('id', id);// need to append id to update or it create unique id and throw err when trying to override existing id
    postData.append("title",title);
    postData.append('content',content);
    postData.append('image',image,title);
   } else {
    postData = {
      id:id,
      title:title,
      content:content,
      imagePath: image
    }
   }
   this.http.put(this.url + '/' + id, postData)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
 }
 deletePost(id: string) {
  return this.http.delete(this.url + '/' + id);
 }
}
