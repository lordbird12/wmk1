import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { BankComponent } from './bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { EditTransactionWdComponent } from './edit-transaction-wd/edit-transaction-wd.component';
import { ListDepositComponent } from './list-deposit/list-deposit.component';
import { ListWithdrawComponent } from './list-withdraw/list-withdraw.component';
import { ListBankComponent } from './list/list.component';
import { NewBankDepositComponent } from './new-bank-deposit/new-bank-deposit.component';
import { NewBankWithdrawComponent } from './new-bank-withdraw/new-bank-withdraw.component';
import { NewBankComponent } from './new-bank/new-bank.component';
import { ViewBankDetailComponent } from './view-bank-detail/view-bank-detail.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { PermissionComponent } from './permission/permission.component';
import { PrintComponent } from './print/print.component';


export const bankRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: BankComponent,
        children: [
            {
                path: 'list',
                component: ListBankComponent,
            },
            {
                path: 'list-deposit',
                component: ListDepositComponent,
            },
            {
                path: 'list-withdraw',
                component: ListWithdrawComponent,
            },
            {
                path: 'new-bank',
                component: NewBankComponent,
            },
            {
                path: 'new-bank-deposit',
                component: NewBankDepositComponent,
            },
            {
                path: 'new-bank-withdraw',
                component: NewBankWithdrawComponent,
            },
            {
                path: 'edit/:id',
                component: EditBankComponent,
            },
            {
                path: 'edit-transaction/:id',
                component: EditTransactionComponent,
            },
            {
                path: 'edit-transaction-wd/:id',
                component: EditTransactionWdComponent,
            },
            {
                path: 'view-bank-detail/:id',
                component: ViewBankDetailComponent,
            },
            {
                path: 'view-transaction/:id',
                component: ViewTransactionComponent,
            },{
                path: 'print/:id',
                component: PrintComponent,
            },
            {
                path: 'permission',
                component: PermissionComponent,
            },
        ]
    }
];
