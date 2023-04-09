import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    selector: 'edit-item-promotion',
    templateUrl: './edit-item-promotion.component.html',
    styleUrls: ['./edit-item-promotion.component.scss'],
    animations: fuseAnimations
})

export class EditItemPromotionComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    eventname: string;
    itemId: string
    dataRow: any = [];
    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]
    url: string;
    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    url_sig: any = []
    formData: FormGroup
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
            id: '',
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


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {

        const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        this.itemtypeData = itemtype.data;

        const locationdata = await lastValueFrom(this._ServiceLocation.getLocation())
        this.locationData = locationdata.data;

        const vendordata = await lastValueFrom(this._ServiceVendor.getVendor())
        this.vendorData = vendordata.data;


        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getItemById(this.itemId).subscribe((resp: any) => {
            this.dataRow = resp.data
            this.formData.reset();
            // console.log(resp.data)
            console.log(resp.data)
            this.formData.patchValue({
                id: this.itemId,
                item_type_id: resp.data.item_type_id,
                location_id: resp.data.location_id,
                item_id: resp.data.item_id,
                name: resp.data.name,
                image: '',
                unit_price: resp.data.unit_price,
                unit_cost: resp.data.unit_cost,
                vendor_id: resp.data.vendor_id,
                brand: resp.data.brand,
                description: resp.data.description,
                qty: resp.data.qty,
                set_type: resp.data.set_type,
                total_price: resp.data.total_price,
      
            })
            if(this.dataRow.main_item_line)
            {
              this.dataRow.main_item_line.map(s =>
              this.item().push(this._formBuilder.group({
                item_id: s.item_id,
                item_name: s.item.name,
                qty: s.qty,
                price: s.price,
                total: s.total,
              })))
  
            }
            this.sumPrice()
            this.url_sig = resp.data.image
        })

    }

    onChangeSignature(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url_sig = e.target.result;
        const file = event.target.files[0];
        this.formData.patchValue({
            image: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        console.log(this.files)
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
    discard(): void {

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

    }


    updateItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลสินค้า",
            "message": "คุณต้องการแก้ไขข้อมูลสินค้าใช่หรือไม่ ",
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
            const formData = new FormData();
            Object.entries(this.formData.value).forEach(
                ([key, value]: any[]) => {
                    formData.append(key, value);
                }
            );
            // If the confirm button pressed...
            if (result === 'confirmed') {
                this._Service.updateItem(formData).subscribe((resp: any) => {
                    this.showFlashMessage('success');

                    this._router.navigateByUrl('customer/list').then(() => {
                        window.location.reload();
                    });
                })

            }
        });

    }

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

    onchangeTotal(e,i) {
        // console.log(e.target.value)
        let bbb = this.formData.value.item_line[i].price
        let aaa = e.target.value;
        let itemData = this.formData.value.item_line;
        console.log(bbb*aaa)
        itemData[i] =
        {
            // price: aaa,
            total: bbb*aaa
        };
        this.formData.controls.item_line.patchValue(
            itemData
        )
        this.sumPrice()
        


    }


}
