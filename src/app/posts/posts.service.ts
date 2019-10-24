import { Injectable } from '@angular/core';
import { Post } from './model/Ipost.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PostsService {
 url = 'http://localhost:3000/api/posts';
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
 constructor(private http: HttpClient) {}
 // When copying array we need to use spread object.
 // Java script copies by reference so we wouldve just got the pointer to this.posts.
 getPosts() {

  this.http.get<{message: string, posts: any}>(this.url)
  .pipe(map((postData) => {
    return postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id
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
   return {...this.posts.find(p => p.id === id)};
 }
 addPost(title: string, content: string) {
   const post: Post = {id: null, title: title, content: content};

   this.http.post<{message: string, postId:any}>(this.url, post)
    .subscribe((responseData) => {
      console.log(responseData.message);
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
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
