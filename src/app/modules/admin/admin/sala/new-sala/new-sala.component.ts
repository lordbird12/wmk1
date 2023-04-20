import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
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
// import { VendorService } from '../../../vendor/vendor.service';
// import { ModalItem } from '../../../item/modal-item/modal-item.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-sala',
    templateUrl: './new-sala.component.html',
    styleUrls: ['./new-sala.component.scss'],
    animations: fuseAnimations
})

export class NewSalaComponent implements OnInit, AfterViewInit, OnDestroy {

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

    itemtypeData: any = [];
    locationData: any = [];
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
        private _Service: SalaService,

    ) {

        this.formData = this._formBuilder.group({
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
    ngOnInit(): void {

        this.formData = this._formBuilder.group({
            name: [''],
            description: '',
            email: '',
            price: '',
            tel: '',
            image: '',

        })

        // this.filteredOptions = this.myControl.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filter(value || '')),
        // );


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


    create(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        if (this.formData.invalid) {
            this._fuseConfirmationService.open({
                "title": "กรอกข้อมูลให้ครบถ้วน",
                "message": "ข้อมูลการสร้างศาลาไม่ครบถ้วน",
                "icon": {
                    "show": false,
                    "name": "heroicons_outline:exclamation",
                    "color": "warning"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "warn"
                    },
                    "cancel": {
                        "show": false,
                        "label": "ย้อนกลับ"
                    }
                },
                // "dismissible": true
            })
        }
        else {
            const confirmation = this._fuseConfirmationService.open({
                "title": "สร้างการจองศาลาใหม่",
                "message": "คุณต้องการสร้างศาลาใหม่ใช่หรือไม่",
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
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    const formValue = this.formData.value
                    // console.log('formData', formValue)

                    this.formData.patchValue({
                        image: this.files[0],
                    });
                    const formData = new FormData();
                    Object.entries(formValue).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    this._Service.newSala(formData).subscribe({
                        next: (resp: any) => {
                            this._fuseConfirmationService.open({
                                "title": "สร้างศาลา",
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
                            }).afterClosed().subscribe((res) => {

                                this._router.navigateByUrl('sala/list')
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
    }

    onSelect(event) {
        console.log(event);
        this.files[0] = event.addedFiles[0];
        // this.files.push(...event.addedFiles);

        // Trigger Image Preview

        this._changeDetectorRef.detectChanges()

        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value)
    }

    onRemove(event) {
        // console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }

    goBack(): void {
        this._router.navigate(['sala/list']);
    }

}
