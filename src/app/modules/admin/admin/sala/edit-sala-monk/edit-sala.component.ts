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
    selector: 'edit-sala',
    templateUrl: './edit-sala.component.html',
    styleUrls: ['./edit-sala.component.scss'],
    animations: fuseAnimations
})

export class EditSalaComponent implements OnInit, AfterViewInit, OnDestroy {

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
            name: ['', Validators.required],
            description: '',
            email: '',
            price: '',
            tel: '',
            image: '',
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
        const itemData = await lastValueFrom(this._Service.getSalaById(this.itemId))
        this.dataRow = itemData.data;

        this.formData.patchValue({

            sala_id: this.itemId,
            name: this.dataRow.name ? this.dataRow.name : '',
            description: this.dataRow.description ? this.dataRow.description : '',
            email: this.dataRow.email ? this.dataRow.email : '',
            price: this.dataRow.price ? this.dataRow.price : '',
            tel: this.dataRow.tel ? this.dataRow.tel : '',

        })
        this.url = this.dataRow.image;

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
    updateItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลศาลา",
            "message": "คุณต้องการแก้ไขข้อมูลศาลาใช่หรือไม่ ",
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
                console.log(this.formData.value)
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.updateItem(formData).subscribe((resp: any) => {

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
}
