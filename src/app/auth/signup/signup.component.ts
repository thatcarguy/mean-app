import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;
  private authStatusSub: Subscription;
  constructor(private fb: FormBuilder, public authService: AuthService) {}

  ngOnInit() {
   this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   );
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
  onSignup(form: any) {
    console.log(form);
    this.isLoading = true;
    this.authService.createUser(form.email, form.password);

  }

}
