import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { GalleryComponent } from './gallery.component';
import { EditGalleryComponent } from './edit-gallery/edit-gallery.component';
import { GalleryListComponent } from './list/list.component';
import { NewGalleryComponent } from './new-gallery/new-gallery.component';
import { CategoryGalleryListComponent } from './list-category-gallery/list.component';
import { NewCategoryGalleryComponent } from './new-category-gallery/new-category-gallery.component';
import { EditCategoryGalleryComponent } from './edit-category-gallery/edit-category-gallery.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const galleryRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: GalleryComponent,
        children: [
            {
                path: 'list',
                component: GalleryListComponent,

            },
            {
                path: 'list-category-gallery',
                component: CategoryGalleryListComponent,

            },


            {
                path: 'new-gallery',
                component: NewGalleryComponent,

            },
            {
                path: 'new-category-gallery',
                component: NewCategoryGalleryComponent,

            },

            {
                path: 'edit/:id',
                component: EditGalleryComponent,

            },
            {
                path: 'edit-category-gallery/:id',
                component: EditCategoryGalleryComponent,

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
