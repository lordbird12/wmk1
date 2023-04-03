import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { SacredComponent } from './sacred.component';
import { EditComponent } from './edit-sacred/edit-sacred.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new-sacred/new-sacred.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const sacredRoute: Route[] = [
    {
        path: '',
        component: SacredComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'new-sacred',
                component: NewComponent,
            },
            {
                path: 'edit/:id',
                component: EditComponent,
            },
        ]
    }
];
