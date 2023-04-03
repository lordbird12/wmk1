import { Route } from '@angular/router';
import { DepositComponent } from './deposit.component';
import { EditDepositComponent } from './edit-deposit/edit-deposit.component';
import { DepositListComponent } from './list/list.component';
import { NewDepositComponent } from './new-deposit/new-deposit.component';
import { ReportDepositComponent } from './report-deposit/report-deposit.component';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';

// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const depositRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: DepositComponent,
        children: [
            {
                path: 'list',
                component: DepositListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-deposit',
                component: NewDepositComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit-deposit/:id',
                component: EditDepositComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'report-deposit/:id',
                component: ReportDepositComponent,
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
