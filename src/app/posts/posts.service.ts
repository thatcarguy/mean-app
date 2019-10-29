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
 private postsUpdated = new Subject<Post[]>();
 constructor(private http: HttpClient, private router: Router) {}

 // When copying array we need to use spread object.
 // Java script copies by reference so we wouldve just got the pointer to this.posts.
 getPosts(postsPerPage: number, currentPage: number) {
   // Creating query url with dynamic string with backticks. allows us to add data dynamically.
   const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
  this.http.get<{message: string, posts: any}>(this.url + queryParams)
  .pipe(map((postData) => {
    return postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath
      };
    });
  }))
  .subscribe(transformedPosts => {
    console.log(transformedPosts);
    this.posts = transformedPosts;
    this.postsUpdated.next([...this.posts]);
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
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      console.log(responseData.message);
      const id = responseData.post.id;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
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
      const updatedPosts = [...this.posts];
      const oldPostIndex =  updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
 }
 deletePost(id: string) {
   this.http.delete(this.url + '/' + id)
    .subscribe(() => {
      // sending the angular app the updated list after deletion
      const updatedPosts = this.posts.filter(post => post.id !== id );
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
 }
}
