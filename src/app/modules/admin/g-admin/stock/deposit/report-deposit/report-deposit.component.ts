import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
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
import { AssetType, CustomerPagination } from '../deposit.types';
import { DepositService } from '../deposit.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
import { ModalItemForDeposit } from '../modal-deposit/modal-deposit.component';
import { VendorService } from '../../../vendor/vendor.service';
import { ModalItem } from '../../../item/modal-item/modal-item.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'report-deposit',
    templateUrl: './report-deposit.component.html',
    styleUrls: ['./report-deposit.component.scss'],
    animations: fuseAnimations
})

export class ReportDepositComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

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
        private _Service: DepositService,

    ) {

        this.formData = this._formBuilder.group({
            date_start: ['', Validators.required],
            date_stop: ['', Validators.required],
            po_number: ['', Validators.required],
            remark: ['', Validators.required],
            deposit: this._formBuilder.array([
            ])


        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        setTimeout(() => {
            // window.print();
            this.Print();
            if (window.onafterprint) {
                this._router.navigateByUrl('deposit/list').then(() => { })
            }
            else {
                this._router.navigateByUrl('deposit/list').then(() => { })
            }
        }, 300);


    }
    deposit(): FormArray {
        return this.formData.get('deposit') as FormArray

    }

    NewItem(): FormGroup {

        // return this._formBuilder.group({
        //     item_id: e.item_id,
        //     qty: e.qty,
        //     price: e.price,
        // });
        return this._formBuilder.group({
            // code: '',
            item_id: '',
            item_name: '',
            qty_raw: '',
            qty: '',
            location_id: '',
            location_name: '',
        });


    }

    addItem(): void {
        this.deposit().push(this.NewItem());
        console.log(this.formData.value)
        // alert(1)
    }

    removeItem(i: number): void {
        this.deposit().removeAt(i);
    }

    openDialog(i) {
        let itemData = this.formData.value.deposit;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(ModalItemForDeposit, {
            width: '1500px',
            height: '900px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            console.log(item)
            itemData[i] = {
                item_id: item.id,
                item_name: item.name,
                qty_raw: item.qty,
                qty: '',
                location_id: item.location_id,
                location_name: item.location_name,
            }
            if (item) {
                this.formData.controls.deposit.patchValue(
                    itemData
                );
            }
        });
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
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        if (this.formData.invalid) {
            this._fuseConfirmationService.open({
                "title": "กรอกข้อมูลให้ครบถ้วน",
                "message": "คุณต้องการสร้างใบรับเข้าสินค้าใช่หรือไม่ ",
                "icon": {
                    "show": false,
                    "name": "heroicons_outline:exclamation",
                    "color": "warning"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "warn"
                    },
                    "cancel": {
                        "show": false,
                        "label": "ยกเลิก"
                    }
                },
                // "dismissible": true
            })
        }
        else {
            const confirmation = this._fuseConfirmationService.open({
                "title": "สร้างใบรับเข้าสินค้าใหม่",
                "message": "คุณต้องการสร้างใบรับเข้าสินค้าใช่หรือไม่ ",
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
            confirmation.afterClosed().subscribe((result) => {

                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formValue = this.formData.value;
                    let datestart = formValue.date_start._i.year + '-' + formValue.date_start._i.month + '-' + formValue.date_start._i.date;
                    formValue.date_start = datestart
                    let datestop = formValue.date_stop._i.year + '-' + formValue.date_stop._i.month + '-' + formValue.date_stop._i.date;
                    formValue.date_stop = datestop
                    formValue.deposit.forEach((element, i) => {
                        delete element.item_name
                        delete element.location_name
                    });
                    console.log(formValue);
                    return;
                    this._Service.NewDeposit(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('deposit/list').then(() => { })
                        },
                        error: (err: any) => {

                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                            console.log(err.error.message)
                        }
                    })
                }
            });
        }
    }



    Print(): void {
        var css = '@page { size: landscape; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        window.print();
    }
}
