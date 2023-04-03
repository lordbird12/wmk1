import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { EditSaleOrderComponent } from './edit-sale-order/edit-sale-order.component';
import { SaleOrderListComponent } from './list/list.component';
import { NewSaleOrderComponent } from './new-sale-order/new-sale-order.component';
import { SaleOrderComponent } from './sale-order.component';

export const saleorderRoute: Route[] = [
  {
    path: '',
    component: SaleOrderComponent,
    children: [
        {
            path: 'list',
            component: SaleOrderListComponent,
            // resolve: {
            //     products: PermissionProductsResolver,

            // }
        },
        {
            path: 'new-sale-order',
            component: NewSaleOrderComponent,
            // resolve: {
            //     permission: PermissionProductsResolver,
            //     department: DepartmentResolver,
            //     resolveGet: PositionResolve,
            //     branch: BranchResolver,
            // }
        },
        {
            path: 'edit/:id',
            component: EditSaleOrderComponent,
            // resolve: {
            //     products: PermissionProductsResolver,

            // }
        }
        // {
        //     path: 'view/:id',
        //     component: ViewUserComponent,
        //     // resolve: {
        //     //     products: PermissionProductsResolver,

        //     // }
        // },
        // {
        //     path: 'profile',
        //     component: ProfileUserComponent,
        //     // resolve: {
        //     //     products: PermissionProductsResolver,

        //     // }
        // },

]
  }
];
