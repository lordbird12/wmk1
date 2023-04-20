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
import { AssetType, UserPagination } from '../user.types';
import { UserService } from '../user.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
import { BranchService } from '../../branch/branch.service';
import { NgxMatTimepickerHoursFaceDirective } from 'ngx-mat-timepicker/lib/components/ngx-mat-timepicker-hours-face/ngx-mat-timepicker-hours-face.directive';
import { DataTableDirective } from 'angular-datatables';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    flashErrorMessage: string;
    roleData = [
        { id: 9, name: 'Admin' },
        { id: 2, name: 'Telesale' },
        { id: 3, name: 'Stock' },
        { id: 4, name: 'Packing' },
        { id: 5, name: 'Manager' },
        { id: 6, name: 'ทีมยิงad' },
    ]
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    departmentData: any = []
    positionData: any = []
    permissionData: any = []
    branchData: any = []
    url_pro: any = []
    url_sig: any = []
    DatabyId: any = []

    files: File[] = [];
    filesSignature: File[] = [];

    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    fileUpload: string;
    fileUploadData: string;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    public dtOptions: DataTables.Settings = {};

    dataId: any;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }
    dataRow: any = [];
    supplierId: string | null;
    pagination: UserPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: UserService,
        private _ServicePosition: PositionService,
        private _ServiceDepartment: DepartmentService,
        private _ServiceBranch: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            id: ['',],
            user_id: ['', Validators.required],
            name: ['', Validators.required],
            permission_id: ['', Validators.required],
            department_id: ['', Validators.required],
            position_id: ['', Validators.required],
            email: ['', Validators.required],
            image: ['',],
            phone: ['',],
            line_token: ['',],
            password: ['',],
        })
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.dataId = this._activatedRoute.snapshot.params.id
        this.formData.reset();
        this.loadTable();
        const department = await lastValueFrom(this._ServiceDepartment.getDepartment())
        this.departmentData = department.data;

        const position = await lastValueFrom(this._ServicePosition.getPosition())
        this.positionData = position.data;

        const permission = await lastValueFrom(this._Service.getPermission())
        this.permissionData = permission.data;

        // const Id =await lastValueFrom(this._activatedRoute.queryParams)

        const dataRaw: any = await lastValueFrom(this._Service.getUserbyId(this.dataId))
        console.log(dataRaw)
        this.formData.patchValue({
            id: dataRaw.data.id,
            user_id: dataRaw.data.user_id,
            department_id: +dataRaw.data.department_id,
            email: dataRaw.data.email,
            name: dataRaw.data.name,
            permission_id: +dataRaw.data.permission_id,
            position_id: +dataRaw.position_id,
            phone: dataRaw.data.phone,
            status: dataRaw.data.status,
            line_token: dataRaw.data.line_token,
        })

        this._Service.getUserbyId(this.dataId).subscribe( (resp: any) => {
            this.DatabyId = resp.data
            this.url_pro = this.DatabyId.image
            this.rerender();
        })

        // this._activatedRoute.params.subscribe(params => {
        //     const id = params.id;



        // });

        this._changeDetectorRef.markForCheck();

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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    UpdateUser(): void {
        console.log(this.formData.value)

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขผู้ใช้งาน",
            "message": "คุณต้องการแก้ไขผู้ใช้งานใช่หรือไม่ ",
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
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.updateUser(formData).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('user/list').then(() => { })
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
                                    "label": "ย้อนกลับ",

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



    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
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
    onSelectSignature(event) {
        console.log(event);
        this.filesSignature.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image_signature: this.filesSignature[0],
        });
        console.log(this.formData.value)
    }

    onRemoveSignature(event) {
        console.log('1', event);
        this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
        this.formData.patchValue({
            image_signature: '',
        });
        console.log(this.formData.value)
    }


    onSubmit(): void {
        console.log(this.formData.value)
    }
    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url_pro = e.target.result;
        const file = event.target.files[0];
        this.formData.patchValue({
            image: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
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
            image_signature: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }

    goBack(): void {
        this._router.navigate(['user/list']);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable():void {

        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            responsive: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.user_id = this.formData.value.user_id
                that._Service
                    .getPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * (resp.current_page - 1);
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'no' },
                { data: 'monk' },
                { data: 'name' },
                { data: 'image' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      }

}
