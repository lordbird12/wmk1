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
import { AssetType, BranchPagination } from '../bank.types';
import { BankService } from '../bank.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-bank',
    templateUrl: './edit-bank.component.html',
    styleUrls: ['./edit-bank.component.scss'],
    animations: fuseAnimations
})

export class EditBankComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];
    itemData: any = [];
    bankData: any = [
        { id: 1, name: 'KBANK' },
        { id: 2, name: 'KTB' },
        { id: 3, name: 'GSB' },
        { id: 4, name: 'SCB' },
        { id: 5, name: 'BBL' },
        { id: 6, name: 'BAY' },
        { id: 7, name: 'CITI' },
        { id: 8, name: 'NBANK' },
        { id: 9, name: 'GHB' },
        { id: 10, name: 'SCIB' },
        { id: 11, name: 'TMB' },
    ];

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
    bankId: any;

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
            name: ['', Validators.required],
            number: ['', Validators.required],
            bank_of: '',
            description: '',
            status: 'Yes',
            approve: this._formBuilder.array([]),
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

        const userdata = await lastValueFrom(this._Service.getUser())
        this.UserAppove = userdata.data;

        this._Service.getBankById(this.bankId).subscribe((resp: any) => {
            this.itemData = resp.data
            this.formData.patchValue({
                name: this.itemData.name,
                number: this.itemData.number,
                bank_of: this.itemData.bank_of,
                description: this.itemData.description,
                status: "Yes",
            })

        })

    }

    approve(): FormArray {
        return this.formData.get('approve') as FormArray

    }

    NewUser(): FormGroup {
        return this._formBuilder.group({
            user_id: '',
            remark: ''
        });
    }

    addUser(): void {
        this.approve().push(this.NewUser());

        // alert(1)
    }

    removeUser(i: number): void {
        this.approve().removeAt(i);

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


    updateBank(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขบัญชีธนาคาร",
            "message": "คุณต้องการแก้ไขบัญชีธนาคารใช่หรือไม่ ",
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
                    "label": "ย้อนกลับ"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(this.formData.value)
                // Disable the form
                this.formData.disable();
                this._Service.updateBank(this.formData.value, this.bankId).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router.navigateByUrl('bank/list').then(() => {

                        });
                    },
                    error: (err: any) => {
                        this.formData.enable();
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
                                    "label": "ย้อนกลับ",

                                }
                            },
                            "dismissible": true
                        });
                        console.log(err.error.message)
                    }
                })


                // Sign in
                // this._Service.createUser(this.userForm.value)
                //     .subscribe({
                //         next: (res) => {
                //             console.log(res);
                //         },
                //         error: (err: HttpErrorResponse) => {
                //             this.userForm.enable();
                //             this.flashMessage = 'error';

                //             if (err.error.error['message'] === 'This attribute must be unique') {
                //                 this.flashErrorMessage = 'Username is already';
                //             } else {
                //                 this.flashErrorMessage = err.error.error['message'];
                //             }
                //         },
                //         complete: () => {
                //             this._location.back();
                //         },
                //     }
                //     );


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

    CheckUserAppove(event): void {
        console.log(event)
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

    goBack(): void {
        this._router.navigate(['bank/list']);
    }

}
