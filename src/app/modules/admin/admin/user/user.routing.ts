import { Route } from '@angular/router';
import { BranchResolver } from '../branch/branch.resolver';
import { DepartmentResolver } from '../department/department.resolver';
import { PositionResolve } from '../position/position.resolver';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserListComponent } from './list/list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserComponent } from './user.component';
import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';


export const userRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'list',
                component: UserListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'create-user',
                component: CreateUserComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditUserComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'view/:id',
                component: ViewUserComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'profile',
                component: ProfileUserComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

            {
                path: 'edit-profile',
                component: EditProfileComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'change-pwd/:id',
                component: ChangePwdComponent,
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
