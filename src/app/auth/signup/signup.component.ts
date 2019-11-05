import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

  isLoading = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSignup(form: any) {
    console.log(form);
    this.isLoading = true;
    this.authService.createUser(form.email, form.password);
  }

}
