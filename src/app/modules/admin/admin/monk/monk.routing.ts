import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { MonkComponent } from './monk.component';
import { EditMonkComponent } from './edit-monk/edit-monk.component';
import { MonkListComponent } from './list/list.component';
import { NewMonkComponent } from './new-monk/new-monk.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const monkRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: MonkComponent,
        children: [
            {
                path: 'list',
                component: MonkListComponent,

            },

            {
                path: 'new-monk',
                component: NewMonkComponent,

            },

            {
                path: 'edit/:id',
                component: EditMonkComponent,

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
