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
import { AssetType, CustomerPagination } from '../monk.types';
import { MonkService } from '../monk.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-monk',
    templateUrl: './edit-monk.component.html',
    styleUrls: ['./edit-monk.component.scss'],
    animations: fuseAnimations,
})
export class EditMonkComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    itemId: string;
    dataRow: any = [];
    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ];
    url: string;
    itemtypeData: any = [];
    locationData: any = [
        { id: 1, name: 'ห้องเครื่องครัว ตู้ 1 ชั้นที่ 1' },
        { id: 2, name: 'ห้องเครื่องครัว ตู้ 1 ชั้นที่ 2' },
        { id: 3, name: 'ห้องเครื่องครัว ตู้ 1 ชั้นที่ 3' },
        { id: 4, name: 'ห้องเครื่องครัว ตู้ 2 ชั้นที่ 1' },
        { id: 5, name: 'ห้องเครื่องครัว ตู้ 2 ชั้นที่ 2' },
    ];
    vendorData: any = [];
    files: File[] = [];
    url_sig: any = [];
    formData: FormGroup;
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
    pagination: CustomerPagination;
    departmentData: any = [];
    positionData: any = [];
    groupmonkData: any = [];
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

        private _Service: MonkService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,
        private _ServicePosition: PositionService,
        private _ServiceDepartment: DepartmentService
    ) {
        this.formData = this._formBuilder.group({
            monk_id: '',
            department_id: '',
            position_id: '',
            name: '',
            email: '',
            phone: '',
            line_token: '',
            skill: '',
            monk_age: '',
            image: '',
            group_id: '',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        const position = await lastValueFrom(
            this._ServicePosition.getPosition()
        );
        this.departmentData = position.data;

        const department = await lastValueFrom(
            this._ServiceDepartment.getDepartment()
        );
        this.positionData = department.data;

        const group = await lastValueFrom(this._Service.getGroupForMonk());
        this.groupmonkData = group.data;

        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        const itemData = await lastValueFrom(
            this._Service.getMonkById(this.itemId)
        );
        this.dataRow = itemData.data;
        console.log(this.dataRow);
        this.formData.patchValue({
            // id: this.itemId,
            monk_id: this.itemId,
            name: this.dataRow.name,
            department_id: +this.dataRow.department_id,
            position_id: +this.dataRow.position_id,
            email: this.dataRow.email,
            phone: this.dataRow.phone,
            line_token: this.dataRow.line_token,
            skill: this.dataRow.skill,
            monk_age: this.dataRow.monk_age,
            group_id: Number(this.dataRow.group_id),
        });
        this.url = this.dataRow.image;
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value);
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value);
    }

    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        reader.onload = (e: any) => (this.url = e.target.result);
        const file = event.target.files[0];
        this.formData.patchValue({
            image: file,
        });
        this._changeDetectorRef.markForCheck();
        // console.log
    }

    discard(): void { }

    /**
     * After view init
     */
    ngAfterViewInit(): void { }

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
            title: 'แก้ไขข้อมูลพระสงฆ์',
            message: 'คุณต้องการแก้ไขข้อมูลพระสงฆ์ใช่หรือไม่ ',
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
                    label: 'ย้อนกลับ',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(this.formData.value);
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );

                this._Service.updateItem(formData).subscribe((resp: any) => {
                    this._fuseConfirmationService.open({
                        title: 'แก้ไขข้อมูลพระสงฆ์',
                        message: 'บันทึกเรียบร้อย',
                        icon: {
                            show: true,
                            name: 'heroicons_outline:check-circle',
                            color: 'success',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'ตกลง',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                                label: 'ย้อนกลับ',
                            },
                        },
                        dismissible: true,
                    });

                    this.showFlashMessage('success');
                    this.ngOnInit();
                    // this._router.navigateByUrl('customer/list').then(() => {

                    // });
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

    goBack(): void {
        this._router.navigate(['monk/list']);
    }

}
