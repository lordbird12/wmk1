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
    selector: 'new-deposit',
    templateUrl: './new-deposit.component.html',
    styleUrls: ['./new-deposit.component.scss'],
    animations: fuseAnimations
})

export class NewDepositComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    formCustomer: FormGroup;
    formItem: any = [];
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
    checked = false;
    itemtypeData: any = [];
    itemData: any = [];
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
        this.formCustomer = this._formBuilder.group({
            fname: '',
            lname: '',
            email: '',
            tel: '',
            address: '',
        })

        this.formData = this._formBuilder.group({
            member_id: '',
            fdate: ['', Validators.required],
            edate: ['', Validators.required],
            remark: ['', Validators.required],
            status: 'Request',
            withdraw_item_lines: this._formBuilder.array([
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
        const item = await lastValueFrom(this._Service.getItem())
        this.itemData = item.data


        this.formData = this._formBuilder.group({
            member_id: '',
            fdate: ['', Validators.required],
            edate: ['', Validators.required],
            remark: ['', Validators.required],
            status: 'Request',
            withdraw_item_lines: this._formBuilder.array([
            ])
        })
        this.formCustomer = this._formBuilder.group({
            fname: '',
            lname: '',
            email: '',
            tel: '',
            address: '',
        })
        this.itemData.map(val => {
            this.withdraw_item_lines().push(this._formBuilder.group({
                check: false,
                item_id: val.id,
                qty: val.qty
            }))
        })
        console.log(this.formData.value)


        this._changeDetectorRef.markForCheck();


    }
    withdraw_item_lines(): FormArray {
        return this.formData.get('withdraw_item_lines') as FormArray

    }

    NewItem(): FormGroup {
        return this._formBuilder.group({
            check: false,
            item_id: '',
            qty: '',
        });
    }

    addItem(): void {
        this.withdraw_item_lines().push(this.NewItem());
        console.log(this.formData.value)
        // alert(1)
    }

    removeItem(i: number): void {
        this.withdraw_item_lines().removeAt(i);
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
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างใบยืมอุปกรณ์ใหม่",
            "message": "คุณต้องการสร้างใบยืมอุปกรณ์ใช่หรือไม่ ",
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
                let formValueCustomer = this.formCustomer.value
                // console.log(formValueCustomer);
                this._Service.newMember(formValueCustomer).subscribe({
                    next: (resp: any) => {
                        let DataValue = []
                        const formValue = this.formData.value;
                        let datestart = formValue.fdate._i.year + '-' + formValue.fdate._i.month + '-' + formValue.fdate._i.date;
                        formValue.fdate = datestart
                        let datestop = formValue.edate._i.year + '-' + formValue.edate._i.month + '-' + formValue.edate._i.date;
                        formValue.edate = datestop
                        console.log(formValue.withdraw_item_lines.length)
                        for (let i = 0; i < formValue.withdraw_item_lines.length; i++) {
                            if (formValue.withdraw_item_lines[i].check === true) {
                                DataValue.push(formValue.withdraw_item_lines[i])
                            }
                        }
                        formValue.member_id = resp.data.id
                        formValue.withdraw_item_lines = DataValue;
                        formValue.withdraw_item_lines.forEach((element, i) => {
                            delete element.check
                        });
                        console.log(formValue);
                        this._Service.NewDeposit(formValue).subscribe({
                            next: (resp: any) => {
                                console.log(resp)
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
