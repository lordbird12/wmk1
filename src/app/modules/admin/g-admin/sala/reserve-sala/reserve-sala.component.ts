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
import { AssetType, CustomerPagination } from '../sala.types';
import { SalaService } from '../sala.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
import { MonkService } from '../../monk/monk.service';
// import { VendorService } from '../../../vendor/vendor.service';
// import { ModalItem } from '../../../item/modal-item/modal-item.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'reserve-sala',
    templateUrl: './reserve-sala.component.html',
    styleUrls: ['./reserve-sala.component.scss'],
    animations: fuseAnimations
})

export class ReserveSalaComponent implements OnInit, AfterViewInit, OnDestroy {

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
    salaData: any = [];
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
        private _Service: SalaService,
        private _ServiceMonk: MonkService,

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
        // console.log(this.monkData)

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
            "title": "จองศาลา",
            "message": "คุณต้องการจองศาลาใช่หรือไม่",
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
                let datestart = formValue.fdate._i.year + '-' + formValue.fdate._i.month + '-' + formValue.fdate._i.date;
                formValue.fdate = datestart
                let datestop = formValue.edate._i.year + '-' + formValue.edate._i.month + '-' + formValue.edate._i.date;
                formValue.edate = datestop
                console.log(formValue);

                this._Service.addReserve(formValue).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('sala/list-reserve').then(() => {
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

        const monkgroup = await lastValueFrom(this._Service.getSalaById(e.value))
        this.monkGroupData = monkgroup.data.monk_groups
        console.log(this.monkGroupData)
        this._changeDetectorRef.markForCheck();
    }
}
