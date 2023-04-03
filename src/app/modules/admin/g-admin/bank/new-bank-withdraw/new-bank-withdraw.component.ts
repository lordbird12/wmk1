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
import moment from 'moment';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-bank-withdraw',
    templateUrl: './new-bank-withdraw.component.html',
    styleUrls: ['./new-bank-withdraw.component.scss'],
    animations: fuseAnimations
})

export class NewBankWithdrawComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    @ViewChild('picker') picker: any;
    bankData: any = [];
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
    image1: [];
    files: File[] = [];
    filesSignature: File[] = [];
    uploadPic: FormGroup
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
    supplierId: string | null;
    pagination: BranchPagination;
    public UserAppove: any = [];
    toppings: any = [
        { id: 1, name: 'พระธรรมกาย' },
        { id: 2, name: 'พระวิริยะ' },
        { id: 3, name: 'พระมโนธรรม' },
    ];


    images1: string[] = [];
    accountData: any[] = [
        {
            id: 1, account_name: 'KBANK', account_no: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [2]
        },
        {
            id: 2, account_name: 'SCB', account_no: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 3]
        },
        {
            id: 3, account_name: 'GSB', account_no: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 2]
        },
        {
            id: 4, account_name: 'KTB', account_no: '1234567890', status: 1, create_by: 'admin', created_at: '2022-09-22', user_id: [1, 2]
        },
    ];
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
            bank_id: '',
            price: '',
            type: 'withdraw',
            remark: '',
            images: [],
        })



    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {

        this.formData = this._formBuilder.group({
            bank_id: '',
            price: '',
            type: 'withdraw',
            remark: '',
            date:'',
            images: []
        })

        const itemtype = await lastValueFrom(this._Service.getBank())
        this.bankData = itemtype.data;

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


    NewBankTransaction(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "เพิ่มธุรกรรมใหม่",
            "message": "คุณต้องการเพิ่มกรรมใหม่ใช่หรือไม่ ",
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
                let formValue = this.formData.value;
                this.formData.patchValue({
                    date: moment(this.formData.value.date).format(
                        'YYYY-MM-DD'
                    ),
                });

                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );

                for (var i = 0; i < this.files.length; i++) { 

                    formData.append("images[]", this.files[i]);
          
                  }

                this._Service.newTransaction(formData).subscribe({
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
                        // console.log(err.error.message)
                    }
                })
            }
        });

    }
    showFlashMessage(arg0: string) {
        throw new Error('Method not implemented.');
    }
    onSelect(event) {
        this.formData.value.images = []
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)

        this.formData.patchValue({
            images: this.files,
        });

        // console.log(this.formData.value)
    }

    // onSelect(event) {
    //     this.formData.value.images = [];
    //     this.files.push(...event.addedFiles);
    //     this.formData.value.images.push(this.files)

    // }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            images: '',
        });
        console.log(this.formData.value)
    }


}
