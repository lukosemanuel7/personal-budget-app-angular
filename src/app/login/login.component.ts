import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { MenuComponent } from '../menu/menu.component';
import { MenuComponentService } from '../menu-component.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  token: any;
  id: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private menuComponent: MenuComponent,
    private menuComponentService: MenuComponentService
    ) {
      this.menuComponent.elements[0].style.visibility = "visible";
      this.menuComponent.elements[1].style.visibility = "hidden";
      this.menuComponent.elements[2].style.visibility = "hidden";
     }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // console.log(this.loginForm);
    if (this.loginForm.invalid) {
      return;
  }
  // console.log(this.f.username.value);
  this.loading = true;
  this.authService.authenticateUser({'username' : this.f.username.value, 'password':this.f.password.value})
            .pipe(first())
            .subscribe(
                data => {
                  console.log(data);
                    this.router.navigate(['/dashboard']);
                    this.token = data.token;
                    this.id = data.id;
                    console.log(this.token);
                    this.authService.storeUserData(this.id, this.token, this.f.username.value)
                },
                error => {
                  this.loading = false;
                  return;
                });

  }

}
