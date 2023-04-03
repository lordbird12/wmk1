import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AssetType, BranchPagination } from '../bank.types';
import { BankService } from '../bank.service';
import { ThemePalette } from '@angular/material/core';
import Swal from 'sweetalert2'
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'view-transaction',
    templateUrl: './view-transaction.component.html',
    styleUrls: ['./view-transaction.component.scss'],
    animations: fuseAnimations
})

export class ViewTransactionComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];


    files: File[] = [];
    filesSignature: File[] = [];
    uploadPic: FormGroup
    formData: FormGroup
    url_sig: any = []
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    accountData: any = [
        {
            id: '1', account_name: 'KBANK', account_number: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 2]
        },
        {
            id: 2, account_name: 'SCB', account_number: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 3]
        },
        {
            id: 3, account_name: 'GSB', account_number: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 2]
        },
        {
            id: 4, account_name: 'KTB', account_number: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 2]
        },
    ]

    toppings: any = [
        { id: 1, name: 'พระธรรมกาย' },
        { id: 2, name: 'พระวิริยะ' },
        { id: 3, name: 'พระมโนธรรม' },
    ];

    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]
    // branchId = 2;
    formDataApprove: FormGroup;
    bankId: any;
    bankData: any = [];
    branchData: any = [];
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
    pagination: BranchPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: BankService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            id: '',
            bank_id: '',
            price: '',
            type: '',
            remark: '',
            image: ['',]
        })

        this.formDataApprove = this._formBuilder.group({
            trans_id: '',
            remark: '',
            status: ''
        })


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.bankId = this._activatedRoute.snapshot.paramMap.get('id');

        const bankdata = await lastValueFrom(this._Service.getBank())
        this.bankData = bankdata.data;
        const banktran = await lastValueFrom(this._Service.getBankTranById(this.bankId))
        this.branchData = banktran.data;
        // console.log(this.branchData)

        this.formData.patchValue({
            id: this.bankId,
            bank_id: parseInt(this.branchData.bank_id),
            price: this.branchData.price,
            type: this.branchData.type,
            remark: this.branchData.remark,
        })

        this.formDataApprove = this._formBuilder.group({
            trans_id:  this.bankId,
            remark: '',
            status: ''
        })


        this.url_sig = this.branchData.images;
        console.log(this.url_sig)



        // this._Service.getBankTranById(this.bankId).subscribe((resp: any) => {
        //     this.branchData = resp.data

        //     // this.url_sig = this.branchData.image;


        // // console.log(this.branchData)

        // })





    }

    GetBranch(): void {

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


    async update(a: any): Promise<void> {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        if (a === 'Reject') {
            const { value: text } = await Swal.fire({
                input: 'textarea',
                inputLabel: 'ระบุเหตุผล',
                inputPlaceholder: 'ระบุเหตุผลที่ไม่อนุมัติ',
                inputAttributes: {
                    'aria-label': 'Type your message here'
                },
                showCancelButton: true,
                confirmButtonColor: '#c98a01',
                // cancelButtonColor: '#f4fbd2',
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: 'บันทึก'
            })

            if (text) {
                this.formDataApprove.patchValue({
                    remark: text,
                    status: a
                })

                let formValue = this.formDataApprove.value;
                console.log(formValue)
                return;
                this._Service.updateTransaction(formValue).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('bank/list-deposit').then(() => { })
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
            } else {
                Swal.fire({
                    icon: 'warning',
                    text: 'กรุณาระบุเหตุผล',
                    confirmButtonColor: '#c98a01',
                    confirmButtonText: 'ปิด'
                })
            }
        }
        else {
            const confirmation = this._fuseConfirmationService.open({
                "title": "แก้ไขข้อมูล",
                "message": "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
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
                    this.formDataApprove.patchValue({
                        status: a
                    })
                    let formValue = this.formDataApprove.value;
                    console.log(formValue)
                    return;
                    this._Service.updateTransaction(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigateByUrl('bank/list-deposit').then(() => { })
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
        // Open the confirmation dialog


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

    CheckUserAppove(event): void {

        let formValue = this.formData.value.user_id
        if (event.checked === true) {

            this.UserAppove.push(event.source.value);
            this.formData.patchValue({
                user_id: this.UserAppove
            })

            // this.dataForm.get('componentData')['controls'][i].get('componentForm')['controls'][j].patchValue(formValue[j])
        }
        else {
            // this.UserAppove = this.UserAppove.filter((item) => item !== event.target.value)

            this.UserAppove = this.UserAppove.filter(function (value, index, arr) {
                return value != event.checked;
            });
            this.formData.patchValue({
                user_id: this.UserAppove
            })



        }



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
                image_slip: resp
            })
            console.log('image_slip', this.formData.value.image_slip)
        })
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image_slip: '',
        });
        console.log(this.formData.value)
    }


    onChangeSignature(event: any): void {
        console.log('aaaa')
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
}
