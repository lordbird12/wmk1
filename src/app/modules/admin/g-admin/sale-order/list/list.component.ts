import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, DataSaleOrder, saleOrderPagination } from '../sale-order.types';
import { SaleOrderService } from '../sale-order.service';
import { MatTableDataSource } from '@angular/material/table';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})


export class SaleOrderListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = ['id',
        'first_name',
        'last_name',
        'email',
        'status',
        'create_by',
        'created_at',
        'actions'];

    dataSource: MatTableDataSource<DataSaleOrder>;
    name: string;
    public total_t = 0;
    public total_o = 0;
    public total_p = 0;
    public total_c = 0;
    public total_d = 0;
    public total_f = 0;
    public total_pc = 0;
    position: number;
    weight: number;
    symbol: string;
    dataRow_t: any = []
    dataRow_o: any = []
    dataRow_p: any = []
    dataRow_c: any = []
    dataRow_pc: any = []
    dataRow_d: any = []
    dataRow_f: any = []
    public dtOptionsTotal: DataTables.Settings = {};
    public dtOptionsOrder: DataTables.Settings = {};
    public dtOptionsPaid: DataTables.Settings = {};
    public dtOptionsConfirm: DataTables.Settings = {};
    public dtOptionsDelivery: DataTables.Settings = {};
    public dtOptionsPacking: DataTables.Settings = {};
    public dtOptionsFinish: DataTables.Settings = {};
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

    supplierId: string | null;
    pagination: saleOrderPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: SaleOrderService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        this.loadTableTotal();
        this.loadTableOrder();
        this.loadTablePaid();
        this.loadTableConfirm();
        this.loadTablePacking();
        this.loadTableDelivery();
        this.loadTableFinish();



    }
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableTotal(): void {
        const that = this;
        this.dtOptionsTotal = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                // dataTablesParameters.status = 1;
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_t = resp.data
                    this.total_t = resp.total
                    // console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }

    loadTableOrder(): void {
        const that = this;
        this.dtOptionsOrder = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'order';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_o = resp.data
                    this.total_o = resp.total
                    // console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }
    // pagespaid = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTablePaid(): void {
        const that = this;
        this.dtOptionsPaid = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'paid';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_p = resp.data
                    this.total_p = resp.total
                    console.log(resp.total, 'resp_paid')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableConfirm(): void {
        const that = this;
        this.dtOptionsConfirm = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'confirm';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_c = resp.data
                    this.total_c = resp.total
                    console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableDelivery(): void {
        const that = this;
        this.dtOptionsDelivery = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'delivery';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_d = resp.data
                    this.total_d = resp.total
                    console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTablePacking(): void {
        const that = this;
        this.dtOptionsPacking = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'packing';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_pc = resp.data
                    this.total_pc = resp.total
                    // console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableFinish(): void {
        const that = this;
        this.dtOptionsFinish = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'finish';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_f = resp.data
                    this.total_f = resp.total
                    console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'id' },
                { data: 'channal' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
                { data: 'date_time' },
                { data: 'actice', orderable: false },
            ]
        };

    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // if (this._sort && this._paginator) {
        //     // Set the initial sort
        //     this._sort.sort({
        //         id: 'id',
        //         start: 'asc',
        //         disableClear: true
        //     });

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();

        //     // If the user changes the sort order...
        //     this._sort.sortChange
        //         .pipe(takeUntil(this._unsubscribeAll))
        //         .subscribe(() => {
        //             // Reset back to the first page
        //             this._paginator.pageIndex = 0;

        //             // Close the details
        //             this.closeDetails();
        //         });

        //     // Get products if sort or page changes
        //     merge(this._sort.sortChange, this._paginator.page).pipe(
        //         switchMap(() => {
        //             this.closeDetails();
        //             this.isLoading = true;
        //             return this._Service.getProducts(
        //                 this._paginator.pageIndex + 1,
        //                 this._paginator.pageSize,
        //                 this._sort.active,
        //                 this._sort.direction,
        //                 this.filterForm.value?.searchInputControl,
        //                 this.filterForm.value?.asset_type == 'default' ? '' : this.filterForm.value?.asset_type,
        //                 this.supplierId
        //             );
        //         }),
        //         map(() => {
        //             this.isLoading = false;
        //         })
        //     ).subscribe();
        // }
    }


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
        this.filterForm.get('asset_type').setValue("default");
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

    editBrief(productId: string): void {
        this._router.navigate(['marketing/brief-plan/edit/' + productId]);
    }
    edit(saleorderId: string): void {
        console.log('log', saleorderId)
        this._router.navigate(['sale-order/edit/' + saleorderId]);
    }
    print(saleorderId: string): void {
        console.log('log', saleorderId)
        // this._router.navigate(['user/edit/' + saleorderId]);
    }


    openNewBrief(): void {
        this._router.navigateByUrl('marketing/brief-plan/brief/create');
    }

    openNewOrder(productId: string): void {
        // If the product is already selected...
        // if (this.selectedProduct && this.selectedProduct.id === productId) {
        //     // Close the details
        //     // this.closeDetails();
        //     return;
        // }


        this._router.navigate(['marketing/data/assets-list/new-order/' + productId]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }



}
