import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { BranchComponent } from './branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { BranchListComponent } from './list/list.component';
import { NewBranchComponent } from './new-branch/new-branch.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const branchRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: BranchComponent,
        children: [
            {
                path: 'list',
                component: BranchListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-branch',
                component: NewBranchComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditBranchComponent,
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
