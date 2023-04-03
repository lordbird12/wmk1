import { Route } from '@angular/router';

import { EditSalaComponent } from './edit-sala-monk/edit-sala.component';
import { SalaComponent } from './sala.component';
import { SalaListComponent } from './list/list.component';
import { ReserveSalaComponent } from './reserve-sala/reserve-sala.component';
import { NewSalaComponent } from './new-sala/new-sala.component';
import { ListReserveComponent } from './list-reserve/list-reserve.component';
import { EditReserveSalaComponent } from './edit-reserve-sala/edit-reserve-sala.component';


export const salaRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: SalaComponent,
        children: [
            {
                path: 'list',
                component: SalaListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'list-reserve',
                component: ListReserveComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-sala',
                component: NewSalaComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

            {
                path: 'reserve-sala',
                component: ReserveSalaComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditSalaComponent
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit-reserve-sala/:id',
                component: EditReserveSalaComponent
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
