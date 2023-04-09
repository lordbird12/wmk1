import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    lastValueFrom,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
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
    selector: 'edit-transaction-wd',
    templateUrl: './edit-transaction-wd.component.html',
    styleUrls: ['./edit-transaction-wd.component.scss'],
    animations: fuseAnimations,
})
export class EditTransactionWdComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];

    files: File[] = [];
    filesSignature: File[] = [];
    uploadPic: FormGroup;
    formData: FormGroup;
    url_sig: any = [];
    // public date: moment.Moment;
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
            id: '1',
            account_name: 'KBANK',
            account_number: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 2],
        },
        {
            id: 2,
            account_name: 'SCB',
            account_number: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 3],
        },
        {
            id: 3,
            account_name: 'GSB',
            account_number: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 2],
        },
        {
            id: 4,
            account_name: 'KTB',
            account_number: '1234567890',
            status: 1,
            create_by: 'admin',
            created_at: '2022-09-22',
            user_id: [1, 2],
        },
    ];

    toppings: any = [
        { id: 1, name: 'พระธรรมกาย' },
        { id: 2, name: 'พระวิริยะ' },
        { id: 3, name: 'พระมโนธรรม' },
    ];

    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ];
    // branchId = 2;
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
        private _authService: AuthService
    ) {
        this.formData = this._formBuilder.group({
            id: '',
            bank_id: '',
            price: '',
            type: '',
            remark: '',
            name: '',
            date: '',
            // images: [],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.bankId = this._activatedRoute.snapshot.paramMap.get('id');

        const itemtype = await lastValueFrom(this._Service.getBank());
        this.bankData = itemtype.data;
        const banktran = await lastValueFrom(
            this._Service.getBankTranById(this.bankId)
        );
        this.branchData = banktran.data;

        this.formData.patchValue({
            id: this.bankId,
            bank_id: parseInt(this.branchData.bank_id),
            price: this.branchData.price,
            type: this.branchData.type,
            remark: this.branchData.remark,
            name: this.branchData.name,
            date: this.branchData.date,
        });

        this.url_sig = this.branchData.images;
        // console.log(this.url_sig)

        // this._Service.getBankTranById(this.bankId).subscribe((resp: any) => {
        //     this.branchData = resp.data

        //     // this.url_sig = this.branchData.image;

        // // console.log(this.branchData)

        // })
    }

    GetBranch(): void {}

    discard(): void {}

    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    delete(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบรายการข้อมูลนี้ใช่หรือไม่ ',
            icon: {
                show: false,
                name: 'heroicons_outline:warning',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
            }
        });
    }

    update(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'แก้ไขข้อมูล',
            message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...

            if (result === 'confirmed') {
                this.formData.patchValue({
                    date: moment(this.formData.value.date).format(
                        'YYYY-MM-DD'
                    ),
                });

                let formValue = this.formData.value;
               
                const formData = new FormData();
                Object.entries(formValue).forEach(([key, value]: any[]) => {
                    formData.append(key, value);
                });

                for (var i = 0; i < this.files.length; i++) {
                    formData.append('images[]', this.files[i]);
                }

                this._Service.updateTransaction(formData).subscribe({
                    next: (resp: any) => {
                        this._router
                            .navigateByUrl('bank/list-deposit')
                            .then(() => {});
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'กรุณาระบุข้อมูล',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ยืนยัน',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                        console.log(err.error.message);
                    },
                });
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
        let formValue = this.formData.value.user_id;
        if (event.checked === true) {
            this.UserAppove.push(event.source.value);
            this.formData.patchValue({
                user_id: this.UserAppove,
            });

            // this.dataForm.get('componentData')['controls'][i].get('componentForm')['controls'][j].patchValue(formValue[j])
        } else {
            // this.UserAppove = this.UserAppove.filter((item) => item !== event.target.value)

            this.UserAppove = this.UserAppove.filter(function (
                value,
                index,
                arr
            ) {
                return value != event.checked;
            });
            this.formData.patchValue({
                user_id: this.UserAppove,
            });
        }
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        // this.formData.patchValue({
        //     images: this.files,
        // });
        // console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        // this.formData.patchValue({
        //     images: [],
        // });
        // console.log(this.formData.value);
    }

    onChangeSignature(event: any): void {
        // console.log('aaaa')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        reader.onload = (e: any) => (this.url_sig = e.target.result);
        const file = event.target.files[0];
        this.formData.patchValue({
            images: file,
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }
}
