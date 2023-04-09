import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { NewsComponent } from './news.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { NewsListComponent } from './list/list.component';
import { NewNewsComponent } from './new-news/new-news.component';
import { CategoryNewsListComponent } from './list-category-news/list.component';
import { NewCategoryNewsComponent } from './new-category-news/new-category-news.component';
import { EditCategoryNewsComponent } from './edit-category-news/edit-category-news.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const newsRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: NewsComponent,
        children: [
            {
                path: 'list',
                component: NewsListComponent,

            },
            {
                path: 'list-category-news',
                component: CategoryNewsListComponent,

            },


            {
                path: 'new-news',
                component: NewNewsComponent,

            },
            {
                path: 'new-category-news',
                component: NewCategoryNewsComponent,

            },

            {
                path: 'edit/:id',
                component: EditNewsComponent,

            },
            {
                path: 'edit-category-news/:id',
                component: EditCategoryNewsComponent,

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
