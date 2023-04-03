import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    me: any | null;

    constructor(private _authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        let redirectURL = '/signed-in-redirect';
        const user = JSON.parse(localStorage.getItem('user')) || null;

        // if (user == null) {
        //     localStorage.clear();
        // } else {
            redirectURL = 'bank/list';
        // }
        this._router.navigateByUrl(redirectURL);
    }
}
