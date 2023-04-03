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
import { AssetType, BranchPagination } from '../location.types';
import { LocationService } from '../location.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-location',
    templateUrl: './edit-location.component.html',
    styleUrls: ['./edit-location.component.scss'],
    // styles: [
    //     /* language=SCSS */
    //     `
    //     table{
    //         width: 100%;
    //        }

    //     .bg-gray-50{
    //         background:#FEEDEE !important;
    //         font-weight:bold !important;
    //         padding:5px;
    //     }

    //     .mat-dialog-container .mat-stroked-button{
    //         border:unset !important;
    //     }

    //     .btn-add-asset{
    //         border-radius: 5px !important;
    //         background:#ffffff !important;
    //         border:2px solid #F43F5E !important;
    //         color:#F43F5E !important;
    //         width:100% !important;
    //     }

    //     .mat-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label.mat-tab-label-active{
    //         background-color:#ffffff !important;
    //         border-top:2px solid red !important;
    //         color:red !important
    //     }

    //     .mat-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label{
    //         background-color:#ccc !important;
    //         border-radius:0px !important;
    //     }

    //     /* ::ng-deep .mat-form-field-flex {
    //             border-width: 1px !important;
    //         } */
    //     `

    // ],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class EditLocationComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    locationData: any;
    warehouseData: any;

    statusData = [
        { id: 'No', name: 'ปิดการใช้งาน' },
        { id: 'Yes', name: 'เปิดการใช้งาน' },
    ]
    // branchId = 2;
    locationId: string;
    files: File[] = [];
    url_sig: any = []
    url: any = []
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
        private _Service: LocationService,
        private _ServiceWarehouse: WarehouseService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            id: '',
            name: ['', Validators.required],
            cupboard: ['', Validators.required],
            floor: ['', Validators.required],
            remark: ['', Validators.required],
            status: '',

        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.formData.reset();
        this.locationId = this._activatedRoute.snapshot.paramMap.get('id');

        const locationdata = await lastValueFrom(this._Service.getLocationById(this.locationId))
        this.locationData = locationdata.data;
        this.formData.patchValue({
            id: this.locationId,
            name: this.locationData.name ?? 'No data',
            cupboard: this.locationData.cupboard ?? 'No data',
            floor: this.locationData.floor ?? 'No data',
            remark: this.locationData.remark ?? 'No data',
            status: this.locationData.status,
        })

        this.url = this.locationData.image;


        // this._Service.getLocationById(this.locationId).subscribe((resp: any) => {
        //     this.locationData = resp.data
        //     this.formData.patchValue({
        //         name: this.locationData.name,
        //         code: this.locationData.code,
        //         warehouse_id: this.locationData.warehouse_id,
        //         status: this.locationData.status
        //     })
        // })

        // this._ServiceWarehouse.getWarehouse().subscribe((res: any) => {
        //     this.warehouseData = res.data;
        // })


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

    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url = e.target.result;
        const file = event.target.files[0];
        this.formData.patchValue({
            image: file
        });
        this._changeDetectorRef.markForCheck();
        // console.log
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


    Update(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขห้องเก็บอุปกรณ์",
            "message": "คุณต้องการแก้ไขห้องเก็บอุปกรณ์ใช่หรือไม่ ",
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

                this._Service.updateLocation(this.formData.value, this.locationId).subscribe(

                    {
                        next: (res: any) => {
                            this.showFlashMessage('success');
                            this._router.navigateByUrl('location/list').then(() => { });
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



}
