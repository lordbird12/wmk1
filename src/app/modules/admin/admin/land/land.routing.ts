import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { LandComponent } from './land.component';
import { EditComponent } from './edit-land/edit-land.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new-land/new-land.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const landRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: LandComponent,
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
