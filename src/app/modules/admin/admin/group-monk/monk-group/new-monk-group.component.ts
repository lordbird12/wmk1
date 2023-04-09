import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, lastValueFrom, map, merge, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
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
import { MonkService } from '../../monk/monk.service';
// import { VendorService } from '../../../vendor/vendor.service';
// import { ModalItem } from '../../../item/modal-item/modal-item.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-monk-group',
    templateUrl: './new-monk-group-monk.component.html',
    styleUrls: ['./new-monk-group.component.scss'],
    animations: fuseAnimations
})

export class NewMonkGroupComponent implements OnInit, AfterViewInit, OnDestroy {

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
    url: string;
    groupmonkData: any = [];
    monkData: any = [];
    monkGroupData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;

    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
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
        private _ServiceMonk: MonkService,

    ) {

        this.formData = this._formBuilder.group({
            group_id: '',
            monk_id: '',


        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {


        const group = await lastValueFrom(this._Service.getGroupForMonk())
        this.groupmonkData = group.data


        const monk = await lastValueFrom(this._Service.getMonk())
        this.monkData = monk.data
        console.log(this.monkData)
        // console.log(this.monkData)

        this.formData = this._formBuilder.group({
            group_id: '',
            monk_id: '',
        })

        // this.filteredOptions = this.myControl.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filter(value || '')),
        // );

        this._changeDetectorRef.markForCheck();
    }
    // private _filter(value: string): string[] {
    //     const filterValue = value.toLowerCase();

    //     return this.options.filter(option => option.toLowerCase().includes(filterValue));
    // }


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
        // this.addMonk();
    }


    addMonk(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid


        const confirmation = this._fuseConfirmationService.open({
            "title": "เพิ่มพระสงฆ์เข้ากลุ่ม",
            "message": "คุณต้องการเพิ่มพระสงฆ์เข้ากลุ่มใช่หรือไม่",
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
            if (result === 'confirmed') {
                const formValue = this.formData.value;
                console.log(formValue);

                this._Service.addMonkToGroup(formValue).subscribe({
                    next: (resp: any) => {
                        this._fuseConfirmationService.open({
                            "title": "เพิ่มพระสงฆ์เข้ากลุ่ม",
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
                        }).afterClosed().subscribe(async res => {
                            const monkgroup = await lastValueFrom(this._Service.getGroupForMonkById(this.formData.value.group_id))
                            this.monkGroupData = monkgroup.data.monk_groups
                            // this.ngOnInit();
                            this._changeDetectorRef.markForCheck();

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

    async onChange(e) {
        console.log(e.value)

        const monkgroup = await lastValueFrom(this._Service.getGroupForMonkById(e.value))
        this.monkGroupData = monkgroup.data.monk_groups
        console.log(this.monkGroupData)
        this._changeDetectorRef.markForCheck();
    }


    delete(id: number) {
        console.log(id)
    }
}
