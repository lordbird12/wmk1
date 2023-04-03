import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'landing' },

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'landing' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },
    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'landing', loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'home', loadChildren: () => import('./modules/admin/pages/home/home.module').then(m => m.HomeModule)
            },
            //permission
            {
                path: 'permission',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/permission/permission.module').then(m => m.PermissionModule) },
                ]
            },
            //user
            {
                path: 'user',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/user/user.module').then(m => m.UserModule) },

                ]
            },
            {
                path: 'menu',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/menu/menu.module').then(m => m.Module) },
                ]
            },
            {
                path: 'branch',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/branch/branch.module').then(m => m.BranchModule) },
                ]
            },
            {
                path: 'department',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/department/department.module').then(m => m.DepartmentModule) },
                ]
            },

            {
                path: 'position',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/position/position.module').then(m => m.PositionModule) },
                ]
            },

            {
                path: 'customer',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/customer/customer.module').then(m => m.CustomerModule) },
                ]
            },
            {
                path: 'item-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/item-type/item-type.module').then(m => m.ItemTypeModule) },
                ]
            },
            {
                path: 'location',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/location/location.module').then(m => m.LocationModule) },
                ]
            },
            {
                path: 'warehouse',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/warehouse/warehouse.module').then(m => m.WarehouseModule) },
                ]
            },
            {
                path: 'vendor',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/vendor/vendor.module').then(m => m.VendorModule) },
                ]
            },

            {
                path: 'item',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/item/item.module').then(m => m.ItemModule) },
                ]
            },
            {
                path: 'deposit',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/stock/deposit/deposit.module').then(m => m.DepositModule) },

                ]
            },
            {
                path: 'monk',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/monk/monk.module').then(m => m.MonkModule) },

                ]
            },
            {
                path: 'group-monk',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/group-monk/group-monk.module').then(m => m.GroupMonkModule) },

                ]
            },
            {
                path: 'sala',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/sala/sala.module').then(m => m.SalaModule) },

                ]
            },
            {
                path: 'member',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/member/member.module').then(m => m.MemberModule) },

                ]
            },
            {
                path: 'news',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/news/news.module').then(m => m.NewsModule) },

                ]
            },
            {
                path: 'gallery',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/gallery/gallery.module').then(m => m.GalleryModule) },

                ]
            },
            {
                path: 'sacred',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/sacred/sacred.module').then(m => m.SacredModule) },

                ]
            },
            {
                path: 'land',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/land/land.module').then(m => m.LandModule) },

                ]
            },
            {
                path: 'event-land',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/event-land/event-land.module').then(m => m.EventLandModule) },

                ]
            },
            {
                path: 'rent-land',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/rent-land/rent-land.module').then(m => m.RentLandModule) },

                ]
            },
            {
                path: 'sale-order',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/sale-order/sale-order.module').then(m => m.SaleOrderModule) },
                    // { path: 'create-user', loadChildren: () => import('app/modules/admin/g-admin/user/create-user/create-user.component').then(m => m.UserModule) },
                    // { path: 'orders', loadChildren: () => import('app/modules/admin/marketing/orders/orders.module').then(m => m.OrdersModule) },
                    // { path: 'expand-store-list', loadChildren: () => import('app/modules/admin/marketing/orders/expand-store-list/expand-store-list.module').then(m => m.ExpandStoreModule) },
                    // {
                    //     path: 'data', children: [
                    //         { path: 'new-item-list-checking', loadChildren: () => import('app/modules/admin/marketing/new-item-list-checking/new-item-list-checking.module').then(m => m.NewItemListCheckingModule) },
                    //         { path: 'assets-list', loadChildren: () => import('app/modules/admin/marketing/assets-list/assets-list.module').then(m => m.AssetsListModule) },
                    //         { path: 'user', loadChildren: () => import('app/modules/admin/marketing/user/user.module').then(m => m.UserListModule) },
                    //         { path: 'store', loadChildren: () => import('app/modules/admin/marketing/store/store.module').then(m => m.StoreModule) },
                    //         { path: 'store-type', loadChildren: () => import('app/modules/admin/marketing/store-type/store-type.module').then(m => m.StoreTypeModule) },
                    //     ]
                    // },
                ]
            },
            {
                path: 'bank',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/bank/bank.module').then(m => m.BankModule) },
                    // { path: 'create-user', loadChildren: () => import('app/modules/admin/g-admin/user/create-user/create-user.component').then(m => m.UserModule) },
                    // { path: 'orders', loadChildren: () => import('app/modules/admin/marketing/orders/orders.module').then(m => m.OrdersModule) },
                    // { path: 'expand-store-list', loadChildren: () => import('app/modules/admin/marketing/orders/expand-store-list/expand-store-list.module').then(m => m.ExpandStoreModule) },
                    // {
                    //     path: 'data', children: [
                    //         { path: 'new-item-list-checking', loadChildren: () => import('app/modules/admin/marketing/new-item-list-checking/new-item-list-checking.module').then(m => m.NewItemListCheckingModule) },
                    //         { path: 'assets-list', loadChildren: () => import('app/modules/admin/marketing/assets-list/assets-list.module').then(m => m.AssetsListModule) },
                    //         { path: 'user', loadChildren: () => import('app/modules/admin/marketing/user/user.module').then(m => m.UserListModule) },
                    //         { path: 'store', loadChildren: () => import('app/modules/admin/marketing/store/store.module').then(m => m.StoreModule) },
                    //         { path: 'store-type', loadChildren: () => import('app/modules/admin/marketing/store-type/store-type.module').then(m => m.StoreTypeModule) },
                    //     ]
                    // },
                ]
            },


//////////website//////////


            {
                path: 'banner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/banner/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'category',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/category/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'gallery',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/gallery/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'line',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/line/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'menu',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/menu/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'menus',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/menus/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'product',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/product/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'product-category',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/product-category/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'product-healty',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/product-healty/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'product-main',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/product-main/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'product-weight',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/product-weight/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'profile',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/profile/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'review',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/review/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'single-banner',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/single-banner/page.module').then(m => m.Module) },
                ]
            },


            // {
            //     path: 'video',
            //     canActivate: [], children: [
            //         { path: '', loadChildren: () => import('app/modules/admin/website/video/page.module').then(m => m.Module) },
            //     ]
            // },
            {
                path: 'youtube',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/youtube/page.module').then(m => m.Module) },
                ]
            },
            {
                path: 'youtube-best',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/website/youtube-best/page.module').then(m => m.Module) },
                ]
            },









            // 404 & Catch all
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
            { path: '**', redirectTo: '404-not-found' }
        ]
    },

];
