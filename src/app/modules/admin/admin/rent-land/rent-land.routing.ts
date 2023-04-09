import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { RentLandComponent } from './rent-land.component';
import { EditComponent } from './edit-rent-land/edit-rent-land.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new-rent-land/new-rent-land.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const rentlandRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: RentLandComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new',
                component: NewComponent,

            },
            {
                path: 'edit/:id',
                component: EditComponent,

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
