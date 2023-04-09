import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import * as moment from 'moment';
import { SharedModule } from 'app/shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { ListBankComponent } from './list/list.component';
import { BankComponent } from './bank.component';
import { bankRoute } from './bank.routing';
import { NewBankComponent } from './new-bank/new-bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { DataTablesModule } from 'angular-datatables';
import { NewBankDepositComponent } from './new-bank-deposit/new-bank-deposit.component';
import { NewBankWithdrawComponent } from './new-bank-withdraw/new-bank-withdraw.component';
import { ListDepositComponent } from './list-deposit/list-deposit.component';
import { ListWithdrawComponent } from './list-withdraw/list-withdraw.component';
import { ViewBankDetailComponent } from './view-bank-detail/view-bank-detail.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { EditTransactionWdComponent } from './edit-transaction-wd/edit-transaction-wd.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { PrintComponent } from './print/print.component';
import { PermissionComponent } from './permission/permission.component';

@NgModule({
  declarations: [
    BankComponent,
    ListBankComponent,
    NewBankComponent,
    NewBankDepositComponent,
    EditBankComponent,
    NewBankWithdrawComponent,
    ListDepositComponent,
    ListWithdrawComponent,
    ViewBankDetailComponent,
    EditTransactionComponent,
    ViewTransactionComponent,
    PrintComponent,
    EditTransactionWdComponent,
    PermissionComponent
  ],
  imports: [
    RouterModule.forChild(bankRoute),
    DataTablesModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SharedModule,
    DragDropModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTableModule,
    MatTabsModule,
    FuseFindByKeyPipeModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDividerModule,
    NgImageSliderModule,
    NgxDropzoneModule,
    MatRadioModule,
    MatExpansionModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule

  ]
})
export class BankModule {
}
