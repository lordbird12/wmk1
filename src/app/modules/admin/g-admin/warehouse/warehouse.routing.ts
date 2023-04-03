import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { WarehouseComponent } from './warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { WarehouseListComponent } from './list/list.component';
import { NewWarehouseComponent } from './new-warehouse/new-warehouse.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const warehouseRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: WarehouseComponent,
        children: [
            {
                path: 'list',
                component: WarehouseListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-warehouse',
                component: NewWarehouseComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditWarehouseComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },


        ]
    }
];
