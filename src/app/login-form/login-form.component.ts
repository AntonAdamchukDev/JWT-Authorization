import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent{

  form:FormGroup;

    constructor(private fb:FormBuilder, 
                 private authService: AuthService, 
                 private router: Router) {

        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }

    login() {
        const val = this.form.value;
        if (val.email && val.password) {
            this.authService.login(val.email, val.password)
                .subscribe(
                    () => {
                        this.router.navigateByUrl('/');
                    }
                );
        }
    }
    
}
