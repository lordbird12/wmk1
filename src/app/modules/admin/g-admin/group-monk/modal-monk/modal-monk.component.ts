import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, CustomerPagination } from '../group-monk.types';
import { GroupMonkService } from '../group-monk.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'modal-monk',
    templateUrl: './modal-monk.component.html',
    styleUrls: ['./modal-monk.component.scss'],
    animations: fuseAnimations
})

export class ModalMonk implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    formData1: FormGroup;
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;

    formFilter: FormGroup;
    columns = [{
        name: 'name',
        location_name: 'location_name',
        qty: 'qty',
    }];
    filterData = [];
    rawDataFilter: any[] = [
        { id: 1, name: 'หม้อเบอร์ 40', qty: '50', location_id: 1, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 1' },
        { id: 2, name: 'หม้อเบอร์ 38', qty: '50', location_id: 2, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 2' },
        { id: 3, name: 'หม้อเบอร์ 36', qty: '50', location_id: 3, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 3' },
        { id: 4, name: 'เก้าอี้แดง', qty: '100', location_id: 4, location_name: 'ห้องโต๊ะ-เก้าอี้' },
        { id: 5, name: 'เก้าอี้ขาว', qty: '100', location_id: 4, location_name: 'ห้องโต๊ะ-เก้าอี้' },
        { id: 6, name: 'กระโถน', qty: '90', location_id: 6, location_name: 'ห้องเครื่องครัว ตู้ที่ 1 ชั้น 1' },
        { id: 7, name: 'โต๊ะกลม', qty: '100', location_id: 7, location_name: 'ห้องโต๊ะ-เก้าอี้' },
    ];
    rawData: any[] = [
        { id: 1, name: 'หม้อเบอร์ 40', qty: '50', location_id: 1, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 1' },
        { id: 2, name: 'หม้อเบอร์ 38', qty: '50', location_id: 2, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 2' },
        { id: 3, name: 'หม้อเบอร์ 36', qty: '50', location_id: 3, location_name: 'ห้องเครื่องครัว ตู้ที่ 2 ชั้น 3' },
        { id: 4, name: 'เก้าอี้แดง', qty: '100', location_id: 4, location_name: 'ห้องโต๊ะ-เก้าอี้' },
        { id: 5, name: 'เก้าอี้ขาว', qty: '100', location_id: 4, location_name: 'ห้องโต๊ะ-เก้าอี้' },
        { id: 6, name: 'กระโถน', qty: '90', location_id: 6, location_name: 'ห้องเครื่องครัว ตู้ที่ 1 ชั้น 1' },
        { id: 7, name: 'โต๊ะกลม', qty: '100', location_id: 7, location_name: 'ห้องโต๊ะ-เก้าอี้' },
    ];

    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<ModalMonk>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,

        private _Service: GroupMonkService,
        // private _ServiceItemtemType: ItemTypeService,
        // private _ServiceLocation: LocationService,
        // private _ServiceVendor: VendorService,

    ) {

        this.formData = this._formBuilder.group({
            filter: '',
        })
        this.formData1 = this._formBuilder.group({
            item: this._formBuilder.array([]),
        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.formData = this._formBuilder.group({
            filter: '',
        })

        // this._ServiceItemtemType.getItemType().subscribe((resp: any) => {
        //     this.itemtypeData = resp.data;
        // })

        // this._ServiceLocation.getLocation().subscribe((resp: any) => {
        //     this.locationData = resp.data;
        // })

        // this._ServiceVendor.getVendor().subscribe((resp: any) => {
        //     this.vendorData = resp.data;
        // })
    }

    addProduct(e): void {

        this.dialogRef.close(e);
    }

    onClose() {
        this.dialogRef.close();
    }

    onFilter(event) {
        //  console.log('event',event.target.value);
        // ตัวให้เป็นตัวเล็กให้หมด
        let val = event.target.value.toLowerCase();
        // หา ชื่อ คอลัมน์
        let keys = Object.keys(this.columns[0]);
        // หาจำนวนคอลัม
        let colsAmt = keys.length;
        // console.log('keys', keys);
        this.rawData = this.rawDataFilter.filter(function (item) {
            // console.log('item',item);
            for (let i = 0; i < colsAmt; i++) {
                //console.log(colsAmt);
                if (item[keys[i]]) {
                    if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
                        // ส่งคืนตัวที่เจอ
                        return true;
                    }
                }
            }
        });
    }

    item(): FormArray {
        return this.formData1.get('item') as FormArray
    }

    NewItem(e): FormGroup {
        return this._formBuilder.group({
            item_id: e.code,
            item_name: e.name,
        });
    }

    addItem(e): void {
        this.item().push(this.NewItem(e));
    }

    removeItem(i: number): void {
        this.item().removeAt(i);
    }

    onSubmit(): void {

        this.dialogRef.close();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this.addItem();
    }

}
