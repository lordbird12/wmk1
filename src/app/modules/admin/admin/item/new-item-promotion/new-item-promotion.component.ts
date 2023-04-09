import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, lastValueFrom, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, CustomerPagination } from '../item.types';
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
import { ModalItem } from '../modal-item/modal-item.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-item-promotion',
    templateUrl: './new-item-promotion.component.html',
    styleUrls: ['./new-item-promotion.component.scss'],
    animations: fuseAnimations
})

export class NewItemPromotion implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    eventname: string;
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    uploadPic: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    // dialog: MatDialog;

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

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,

        private _Service: ItemService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,

    ) {

        this.formData = this._formBuilder.group({
            item_id: ['', Validators.required],
            vendor_id: ['', Validators.required],
            location_id: ['', Validators.required],
            name: ['', Validators.required],
            brand: ['', Validators.required],
            image: ['', Validators.required],
            qty: ['', Validators.required],
            unit_cost: ['', Validators.required],
            unit_price: ['', Validators.required],
            total_price: ['', Validators.required],
            description: ['', Validators.required],
            item_type_id: ['', Validators.required],
            set_type: ['', Validators.required],
            item_line: this._formBuilder.array([
            ])
        })
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: ''
        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/item/'
        })
        this.formData = this._formBuilder.group({
            item_id: null,
            vendor_id: null,
            location_id: null,
            name: ['', Validators.required],
            brand: ['', Validators.required],
            image: null,
            qty: null,
            unit_cost: 0,
            unit_price: 0,
            total_price: 0,
            description: null,
            item_type_id: null,
            set_type: 'set_products',
            item_line: this._formBuilder.array([
            ])
        })
        const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        this.itemtypeData = itemtype.data;

        const locationdata = await lastValueFrom(this._ServiceLocation.getLocation())
        this.locationData = locationdata.data;

        const vendordata = await lastValueFrom(this._ServiceVendor.getVendor())
        this.vendorData = vendordata.data;

        // this._ServiceLocation.getLocation().subscribe((resp: any) => {
        //     this.locationData = resp.data;
        // })

        // this._ServiceVendor.getVendor().subscribe((resp: any) => {
        //     this.vendorData = resp.data;
        // })
    }

    item(): FormArray {
        return this.formData.get('item_line') as FormArray

    }

    NewItem(): FormGroup {

        // return this._formBuilder.group({
        //     item_id: e.item_id,
        //     qty: e.qty,
        //     price: e.price,
        // });
        return this._formBuilder.group({
            item_id: '',
            item_name: '',
            qty: '',
            price: '',
            total: '',
        });


    }

    OnchangeQty(event: any) {
        // alert(1)
        console.log(event)
        this.eventname = event;
        this.sumPrice()
    }

    sumPrice() {
        let price1
        let price2 = 0;
        this.formData.value.item_line.forEach(element => {
            price1 = element.total
            price2 = price2 + element.total
        });
        this.formData.patchValue({
            total_price: price2
        })
    }

    addItem(): void {
        this.item().push(this.NewItem());
        console.log(this.formData.value)
        // alert(1)
    }

    removeItem(i: number): void {
        this.item().removeAt(i);
        this.sumPrice()
    }

    openDialog(i) {
        console.log(i)
        let itemData = this.formData.value.item_line;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(ModalItem, {
            width: '1200px',
            height: '750px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            console.log(item)
            itemData[i] =
            {
                item_id: item.item_id,
                item_name: item.name,
                qty: '1',
                price: item.unit_price,
                total: item.unit_price * 1
            };

            console.log('Data', this.formData.value);
            if (item) {
                this.formData.controls.item_line.patchValue(
                    itemData
                );
                this.sumPrice()
            }
        });
    }

    onchangeTotal(e, i) {
        // console.log(e.target.value)
        let bbb = this.formData.value.item_line[i].price
        let aaa = e.target.value;
        let itemData = this.formData.value.item_line;
        console.log(bbb * aaa)
        itemData[i] =
        {
            // price: aaa,
            total: bbb * aaa
        };
        this.formData.controls.item_line.patchValue(
            itemData
        )
        this.sumPrice()



    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // this.addItem();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.addItem();
    }

    createItem(): void {

        // console.log(this.formData.value)
        // return;

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างสินค้าโปรโมชั่นใหม่",
            "message": "คุณต้องการสร้างสินค้าโปรโมชั่นใหม่ใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                const formValue = this.formData.value;
                formValue.item_line.forEach((element, i) => {
                    delete element.item_name
                });
                return
                // this._Service.NewItemSet(formValue).subscribe(
                //     {
                //         next: (resp: any) => {
                //             this._router.navigateByUrl('item/list-promotion').then(() => { })
                //         },
                //         error: (err: any) => {

                //             this._fuseConfirmationService.open({
                //                 "title": "กรุณาระบุข้อมูล",
                //                 "message": err.error.message,
                //                 "icon": {
                //                     "show": true,
                //                     "name": "heroicons_outline:exclamation",
                //                     "color": "warning"
                //                 },
                //                 "actions": {
                //                     "confirm": {
                //                         "show": false,
                //                         "label": "ยืนยัน",
                //                         "color": "primary"
                //                     },
                //                     "cancel": {
                //                         "show": false,
                //                         "label": "ยกเลิก",

                //                     }
                //                 },
                //                 "dismissible": true
                //             });
                //             console.log(err.error.message)
                //         }

                //     }
                // )
            }
        });

    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)


        this.uploadPic.patchValue({
            image: this.files[0],
        });
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image: resp
            })
            console.log(this.formData.value)
        })
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
}
