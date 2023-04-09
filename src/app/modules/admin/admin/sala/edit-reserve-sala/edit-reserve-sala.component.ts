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
import { AssetType, CustomerPagination } from '../sala.types';
import { SalaService } from '../sala.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-reserve-sala',
    templateUrl: './edit-reserve-sala.component.html',
    styleUrls: ['./edit-reserve-sala.component.scss'],
    animations: fuseAnimations
})

export class EditReserveSalaComponent implements OnInit, AfterViewInit, OnDestroy {

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
    url: string;

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
    salaData: any;
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
        private _Service: SalaService,

    ) {

        this.formData = this._formBuilder.group({
            sala_id: '',
            fdate: '',
            edate: '',
            name: '',
            tax_id: '',
            email: '',
            tel: '',
            address: '',
            remark: '',
        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        const sala = await lastValueFrom(this._Service.getSala())
        this.salaData = sala.data

        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        const itemData = await lastValueFrom(this._Service.getReserveSalaById(this.itemId))
        this.dataRow = itemData.data;
        console.log(this.dataRow)
        this.formData.patchValue({

            sala_id: +this.dataRow.sala_id,
            fdate: this.dataRow.fdate ? this.dataRow.fdate : '',
            edate: this.dataRow.edate ? this.dataRow.edate : '',
            name: this.dataRow.name ? this.dataRow.name : '',
            tax_id: this.dataRow.tax_id ? this.dataRow.tax_id : '',
            email: this.dataRow.email ? this.dataRow.email : '',
            tel: this.dataRow.tel ? this.dataRow.tel : '',
            address: this.dataRow.address ? this.dataRow.address : '',
            remark: this.dataRow.remark ? this.dataRow.remark : '',
        })
        // this.url = this.dataRow.image;
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
    updateReserve(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลจองศาลา",
            "message": "คุณต้องการแก้ไขข้อมูลการจองศาลาใช่หรือไม่ ",
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
                // console.log(this.formData.value)
                const formValue = this.formData.value
                // var date_start = formValue.fdate
                // var date_end = formValue.edate
                // if (date_start.length > 10) {
                //     let datestart = formValue.fdate._i.year + '-' + formValue.fdate._i.month + '-' + formValue.fdate._i.date;
                //     formValue.fdate = datestart
                //     let datestop = formValue.edate._i.year + '-' + formValue.edate._i.month + '-' + formValue.edate._i.date;
                //     formValue.edate = datestop
                //     console.log(formValue);
                // }


                this._Service.updateReserve(formValue, this.itemId).subscribe((resp: any) => {

                    this._fuseConfirmationService.open({
                        "title": "แก้ไขข้อมูลศาลา",
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
                    });

                    this.ngOnInit();
                })
            }
        });

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
        console.log(event)

    }
}
