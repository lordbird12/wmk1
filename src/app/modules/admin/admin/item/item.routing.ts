import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { ItemComponent } from './item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemListComponent } from './list/list.component';
import { NewItemComponent } from './new-item/new-item.component';
import { NewItemPromotion } from './new-item-promotion/new-item-promotion.component';
import { ItemListPromotionComponent } from './list-promotion/list-promotion.component';
import { EditItemPromotionComponent } from './edit-item-promotion/edit-item-promotion.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const itemRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: ItemComponent,
        children: [
            {
                path: 'list',
                component: ItemListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'list-promotion',
                component: ItemListPromotionComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-item',
                component: NewItemComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-item-promotion',
                component: NewItemPromotion,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditItemComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit-item-promotion/:id',
                component: EditItemPromotionComponent,
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
