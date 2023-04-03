import { Route } from '@angular/router';

import { EditGroupMonkComponent } from './edit-group-monk/edit-group-monk.component';
import { GroupMonkComponent } from './group-monk.component';
import { GroupMonkListComponent } from './list/list.component';
import { NewMonkGroupComponent } from './monk-group/new-monk-group.component';
import { NewGroupMonkComponent } from './new-group-monk/new-group-monk.component';


export const depositRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: GroupMonkComponent,
        children: [
            {
                path: 'list',
                component: GroupMonkListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-group-monk',
                component: NewGroupMonkComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-monk-group',
                component: NewMonkGroupComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditGroupMonkComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

        ]

        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
