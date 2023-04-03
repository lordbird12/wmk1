import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                // console.log(navigation);
                const user = JSON.parse(localStorage.getItem('user')) || null;

                // if(user == null){
                //     this._router.navigate(['sign-in']); 
                // }

                // console.log(user);
                // // Store the access token in the local storage
                if (user.type == 'administrator') {
                    AuthService._admin = false;
                } else {
                    AuthService._admin = true;
                }

                user.menu_permission.forEach((element) => {
                    if (element.menu_id == 1) {
                        AuthService._menu1 = true;
                    }
                    if (element.menu_id == 2) {
                        AuthService._menu2 = true;
                    }
                    if (element.menu_id == 3) {
                        AuthService._menu3 = true;
                    }
                    if (element.menu_id == 4) {
                        AuthService._menu4 = true;
                    }
                    if (element.menu_id == 5) {
                        AuthService._menu5 = true;
                    }
                    if (element.menu_id == 6) {
                        AuthService._menu6 = true;
                    }
                    if (element.menu_id == 7) {
                        AuthService._menu7 = true;
                    }
                    if (element.menu_id == 8) {
                        AuthService._menu8 = true;
                    }
                    if (element.menu_id == 9) {
                        AuthService._menu9 = true;
                    }
                    if (element.menu_id == 10) {
                        AuthService._menu10 = true;
                    }
                    if (element.menu_id == 11) {
                        AuthService._menu11 = true;
                    }
                    if (element.menu_id == 12) {
                        AuthService._menu12 = true;
                    }
                    if (element.menu_id == 13) {
                        AuthService._menu13 = true;
                    }
                    if (element.menu_id == 14) {
                        AuthService._menu14 = true;
                    }
                    if (element.menu_id == 15) {
                        AuthService._menu15 = true;
                    }
                    if (element.menu_id == 16) {
                        AuthService._menu16 = true;
                    }
                    if (element.menu_id == 17) {
                        AuthService._menu17 = true;
                    }
                    if (element.menu_id == 18) {
                        AuthService._menu18 = true;
                    }
                    if (element.menu_id == 19) {
                        AuthService._menu19 = true;
                    }
                    if (element.menu_id == 20) {
                        AuthService._menu20 = true;
                    }
                    if (element.menu_id == 21) {
                        AuthService._menu21 = true;
                    }
                    if (element.menu_id == 22) {
                        AuthService._menu22 = true;
                    }
                    if (element.menu_id == 23) {
                        AuthService._menu23 = true;
                    }
                    if (element.menu_id == 24) {
                        AuthService._menu24 = true;
                    }
                    if (element.menu_id == 25) {
                        AuthService._menu25 = true;
                    }
                    if (element.menu_id == 26) {
                        AuthService._menu26 = true;
                    }
                    if (element.menu_id == 27) {
                        AuthService._menu27 = true;
                    }
                    if (element.menu_id == 28) {
                        AuthService._menu28 = true;
                    }
                    if (element.menu_id == 29) {
                        AuthService._menu29 = true;
                    }
                    if (element.menu_id == 30) {
                        AuthService._menu30 = true;
                    }
                    if (element.menu_id == 31) {
                        AuthService._menu31 = true;
                    }
                    if (element.menu_id == 32) {
                        AuthService._menu32 = true;
                    }
                    if (element.menu_id == 33) {
                        AuthService._menu33 = true;
                    }
                    if (element.menu_id == 34) {
                        AuthService._menu34 = true;
                    }
                    if (element.menu_id == 35) {
                        AuthService._menu35 = true;
                    }
                    if (element.menu_id == 36) {
                        AuthService._menu36 = true;
                    }
                });

                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
