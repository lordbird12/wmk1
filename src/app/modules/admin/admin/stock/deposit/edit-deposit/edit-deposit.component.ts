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
import { MemberService } from '../../../member/member.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-deposit',
    templateUrl: './edit-deposit.component.html',
    styleUrls: ['./edit-deposit.component.scss'],
    animations: fuseAnimations
})

export class EditDepositComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    formCustomer: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    // dialog: MatDialog;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }
    itemData: any = [];
    withdrawData: any = [];
    memberData: any = [];
    depositId: string;
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
        private _ServiceMember: MemberService,

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
        this.depositId = this._activatedRoute.snapshot.paramMap.get('id');

        const withdraw = await lastValueFrom(this._Service.getWithdrowById(this.depositId))
        this.withdrawData = withdraw.data
        console.log('เบิก', this.withdrawData)

        const item = await lastValueFrom(this._Service.getItem())
        this.itemData = item.data
        console.log('ไอเทม', this.itemData)

        const member = await lastValueFrom(this._Service.getMemberById(this.withdrawData.member_id))
        this.memberData = member.data
        console.log('เมมเบอร์', this.memberData)
        this.formCustomer.patchValue({
            id: this.memberData.id ?? '',
            fname: this.memberData.fname ?? '',
            lname: this.memberData.lname ?? '',
            email: this.memberData.email ?? '',
            tel: this.memberData.tel ?? '',
            address: this.memberData.address ?? '',
        })

        this.formData.patchValue({
            member_id: this.withdrawData.member_id ?? '',
            fdate: this.withdrawData.fdate ?? '',
            edate: this.withdrawData.edate ?? '',
            remark: this.withdrawData.remark ?? '',
            status: 'Request',
        })

        this.itemData.map(element => {
            this.withdraw_item_lines().push(this._formBuilder.group({
                check: false,
                item_id: element.id,
                qty: element.qty
            }))
            let itemData = this.formData.value.withdraw_item_lines;
            for (let i = 0; i < this.itemData.length; i++) {
                if (this.itemData[i].id === 2) {

                    itemData[i] = {
                        check: true,
                        qty: this.withdrawData.withdraw_item_lines[i].qty
                    }

                } 
            }
            this.formData.controls.withdraw_item_lines.patchValue(
                itemData
            );

        })
        // this.withdrawData.withdraw_item_lines.map(element => {
        //     this.withdraw_item_lines().push(this._formBuilder.group({
        //         check: false,
        //         item_id: element.id,
        //         qty: element.qty
        //     }))
        // })
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


    updateWithdraw(): void {


        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
 
       
            const confirmation = this._fuseConfirmationService.open({
                "title": "แก้ไข",
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
                    let formValueCustomer = this.formCustomer.value

                    this._ServiceMember.updateMember(formValueCustomer, this.memberData.id).subscribe({
                        next: (resp: any) => {
                            const formValue = this.formData.value;
                            if (formValue.edate._i) {
                                let datestart = formValue.fdate._i.year + '-' + formValue.fdate._i.month + '-' + formValue.fdate._i.date;
                                formValue.fdate = datestart
                                let datestop = formValue.edate._i.year + '-' + formValue.edate._i.month + '-' + formValue.edate._i.date;
                                formValue.edate = datestop
                            }

                            console.log(formValue);
                            this._Service.updateWithdraw(formValue, this.depositId).subscribe({
                                next: (resp: any) => {
                                    this._fuseConfirmationService.open({
                                        "title": "แก้ไขข้อมูล",
                                        "message": "บันทึกเรียบร้อย",
                                        "icon": {
                                            "show": true,
                                            "name": "heroicons_outline:check-circle",
                                            "color": "success"
                                        },
                                        "actions": {
                                            "confirm": {
                                                "show": false,
                                                "label": "ตกลง",
                                                "color": "primary"
                                            },
                                            "cancel": {
                                                "show": false,
                                                "label": "ยกเลิก"
                                            }
                                        },
                                        "dismissible": true
                                    }).afterClosed().subscribe((res) => {
            
                                        this.ngOnInit();
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


                            this._fuseConfirmationService.open({
                                "title": "แก้ไขข้อมูลสมาชิก",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {

                                this.ngOnInit();
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
