import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination, DataBranch } from '../bank.types';
import { BankService } from '../bank.service';
import { NewBankComponent } from '../new-bank/new-bank.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import moment from 'moment';
@Component({
    selector: 'bank-list-deposit',
    templateUrl: './list-deposit.component.html',
    styleUrls: ['./list-deposit.component.scss'],
    animations: fuseAnimations,
})
export class ListDepositComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];

    // dataRow: any = []
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'name',
        'status',
        'create_by',
        'created_at',
        'actions',
    ];
    dataSource: MatTableDataSource<DataBranch>;
    bankData: any = [];
    products$: Observable<any>;
    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    me: any | null;
    get roleType(): string {
        return 'marketing';
    }
    totalRowSummary: any;
    accountData: any[] = [
        {
            id: 1,
            account_name: 'KBANK',
            account_no: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [2],
        },
        {
            id: 2,
            account_name: 'SCB',
            account_no: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 3],
        },
        {
            id: 3,
            account_name: 'GSB',
            account_no: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 2],
        },
        {
            id: 4,
            account_name: 'KTB',
            account_no: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 2],
        },
    ];

    supplierId: string | null;
    pagination: BranchPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: BankService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.filterForm = this._formBuilder.group({
            bank_id: '',
            text: '',
            type: '',
            start_date: '',
            end_date: '',
        });

        this.loadTable();

        this.getBank();
    }

    getBank(): void {
        this._Service.getBank().subscribe((resp) => {
            this.bankData = resp.data;
        });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resetForm(): void {
        this.filterForm.reset();
        this.filterForm.get('asset_type').setValue('default');
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    callDetail(productId: string): void {
        // alert(this.selectedProduct.id);
        // // If the product is already selected...
        // if (this.selectedProduct && this.selectedProduct.id === productId) {
        //     // Close the details
        //     // this.closeDetails();
        //     return;
        // }

        this._router.navigate(['marketing/brief-plan/' + productId]);
    }

    edit(data: any): void {
        if (data.type == 'deposit') {
            this._router.navigate(['bank/edit-transaction/' + data.id]);
        } else {
            this._router.navigate(['bank/edit-transaction-wd/' + data.id]);
        }
    }

    approve(bankId: string): void {
        this._router.navigate(['bank/view-transaction/' + bankId]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }

    print(id: any): void {
        window.open('bank/print/' + id);
    }

    onFilter() {
        this.rerender();
    }

    genExcel() {
        window.open(
            'https://wmk1.net/api/public/api/exportExcel?bank_id=' +
                this.filterForm.value.bank_id +
                '&text=' +
                this.filterForm.value.text +
                '&start_date=' +
                this.filterForm.value.start_date +
                '&end_date=' +
                this.filterForm.value.end_date +
                '&type=' +
                this.filterForm.value.type
        );
    }

    totalPriceTable() {
        let total1 = 0;
        let total2 = 0;
        let total = 0;
        for (let data of this.dataRow) {
            console.log(data);
            if(data.type == "deposit"){
                total1 += Number(data.price);
            }else if(data.type == "withdraw"){
                total2 += Number(data.price);
            }
            total = total1 - total2;
        }
        return total;
    }

    genPDF() {
        window.open(
            'https://wmk1.net/api/public/api/genPDF?bank_id=' +
                this.filterForm.value.bank_id +
                '&text=' +
                this.filterForm.value.text +
                '&start_date=' +
                this.filterForm.value.start_date +
                '&end_date=' +
                this.filterForm.value.end_date +
                '&type=' +
                this.filterForm.value.type
        );
    }

    rerender(): void {
        this.filterForm.patchValue({
            start_date: moment(this.filterForm.value.start_date).format(
                'YYYY-MM-DD'
            ),
            end_date: moment(this.filterForm.value.end_date).format(
                'YYYY-MM-DD'
            ),
        });

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 100,
            serverSide: true,
            processing: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.bank_id = this.filterForm.value.bank_id;
                dataTablesParameters.type = this.filterForm.value.type;
                dataTablesParameters.text = this.filterForm.value.text;
                dataTablesParameters.start_date =
                    this.filterForm.value.start_date;
                dataTablesParameters.end_date = this.filterForm.value.end_date;
                that._Service
                    .getTransactionPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow = resp.data;
                        console.log('aaa',this.dataRow)
                        this.totalRowSummary = this.totalPriceTable();
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                 resp.per_page * (resp.current_page - 1);
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'No' },
                { data: 'bank.name' },
                { data: 'type' },
                { data: 'type' },
                { data: 'price' },
                { data: 'create_by' },
                { data: 'created_at' },
                { data: 'actice', orderable: false },
            ],
        };
    }
}
