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
import { AssetType, CustomerPagination } from '../group-monk.types';
import { GroupMonkService } from '../group-monk.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
import { ModalMonk } from '../modal-monk/modal-monk.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-group-monk',
    templateUrl: './edit-group-monk.component.html',
    styleUrls: ['./edit-group-monk.component.scss'],
    animations: fuseAnimations
})

export class EditGroupMonkComponent implements OnInit, AfterViewInit, OnDestroy {

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
    itemId: string;
    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;
    dataRow: any;
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
        private _Service: GroupMonkService,

    ) {

        this.formData = this._formBuilder.group({
            name: ['', Validators.required],
            description: '',

        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {

        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');

        const itemData = await lastValueFrom(this._Service.getGroupForMonkById(this.itemId))
        this.dataRow = itemData.data;

        this.formData.patchValue({
            name: this.dataRow.name,
            description: this.dataRow.description ? this.dataRow.description : '',
        })


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

    }
    updateGroupMonk(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid


        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลกลุ่มสำหรับพระสงฆ์",
            "message": "คุณต้องการแก้ไขกลุ่มสำหรับพระสงฆ์ใช่หรือไม่ ",
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
                console.log(formValue);
                console.log(this.itemId);

                this._Service.updateItem(formValue, this.itemId).subscribe({
                    next: (resp: any) => {
                        this._fuseConfirmationService.open({
                            "title": "แก้ไขข้อมูลกลุ่มสำหรับพระสงฆ์",
                            "message": "แก้ไขข้อมูลสำเร็จ ",
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
                        });
                        this.ngOnInit();
                        // this._router.navigateByUrl('group-monk/list').then(() => { })
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
