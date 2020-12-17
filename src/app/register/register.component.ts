import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  token: any;
  id: any

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }
  get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // // reset alerts on submit
        // this.alertService.clear();

        // // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.authService.registerUser({'username' : this.f.username.value, 'password':this.f.password.value})
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              if(data!=null){
                this.router.navigate(['/dashboard']);
                this.token = data.token;
                this.id = data.id;
                console.log(this.token);
                this.authService.storeUserData(this.id, this.token, this.f.username.value)
              }
            },
            error => {
              this.loading = false;
              return;
            });
    }

}
