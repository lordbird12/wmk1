import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import {
    AssetItem,
    Store,
    AssetType,
    Chat,
    // PermissionProductDetailOSM,
    PositionPagination,
    PositionProduct,
    StoreType,
    AssetSize,
    Supplier,
    Division,
} from './page.types';
import { environment } from 'environments/environment';
import { AssetCategory } from 'app/shared/asset-category';
import { DataTablesResponse } from 'app/shared/datatable.types';
// import { UserDetail } from '../user/user.types';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
    providedIn: 'root',
})
export class Service {
    // Private
    private _pagination: BehaviorSubject<PositionPagination | null> =
        new BehaviorSubject(null);
    private _product: BehaviorSubject<PositionProduct | null> =
        new BehaviorSubject(null);
    private _products: BehaviorSubject<PositionProduct[] | null> =
        new BehaviorSubject(null);
    private _product_osm: BehaviorSubject<PositionProduct | null> =
        new BehaviorSubject(null);
    private _products_osm: BehaviorSubject<PositionProduct[] | null> =
        new BehaviorSubject(null);
    private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
    private _asset_types: BehaviorSubject<AssetType[] | null> =
        new BehaviorSubject(null);
    // private _suppliers: BehaviorSubject<UserDetail[] | null> = new BehaviorSubject(null);
    // private _two_approvers: BehaviorSubject<UserDetail[] | null> = new BehaviorSubject(null);
    private _store_types: BehaviorSubject<StoreType[] | null> =
        new BehaviorSubject(null);
    private _stores: BehaviorSubject<Store[] | null> = new BehaviorSubject(
        null
    );
    private _seasons: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _asset_sizes: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _divisions: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _materials: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<PositionPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<PositionProduct> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<PositionProduct[]> {
        return this._products.asObservable();
    }

    /**
     * Getter for product
     */
    get product_osm$(): Observable<PositionProduct> {
        return this._product_osm.asObservable();
    }

    /**
     * Getter for products
     */
    get products_osm$(): Observable<any[]> {
        return this._products_osm.asObservable();
    }

    /**
     * Getter for chat
     */
    get chat$(): Observable<Chat> {
        return this._chat.asObservable();
    }

    /**
     * Getter for chats
     */
    get chats$(): Observable<Chat[]> {
        return this._chats.asObservable();
    }

    /**
     * Getter for tags
     */
    // get suppliers$(): Observable<UserDetail[]> {
    //     return this._suppliers.asObservable();
    // }

    // /**
    //     * Getter for tags
    //     */
    // get two_approvers$(): Observable<UserDetail[]> {
    //     return this._two_approvers.asObservable();
    // }

    /**
     * Getter for asset type
     */
    get asset_types$(): Observable<AssetType[]> {
        return this._asset_types.asObservable();
    }

    /**
     * Getter for store type
     */
    get store_types$(): Observable<StoreType[]> {
        return this._store_types.asObservable();
    }

    /**
     * Getter for store type
     */
    get stores$(): Observable<Store[]> {
        return this._stores.asObservable();
    }

    /**
     * Getter for season
     */
    get seasons$(): Observable<any[]> {
        return this._seasons.asObservable();
    }

    /**
     * Getter for division
     */
    get divisions$(): Observable<any[]> {
        return this._divisions.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    handlerError(error): Observable<never> {
        let errorMessage = 'Error unknown';
        if (error) {
            errorMessage = `${error.error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

    // * create position
    create(data: any): Observable<any> {
        return this._httpClient
            .post(
                environment.API_URL + '/api/gallery',
                data,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.API_URL + '/api/gallery/' + id,
            { headers: this.httpOptionsFormdata.headers }
        );
    }

    // get position //
    getList(): Observable<any> {
        return this._httpClient
            .get<any>(environment.API_URL + '/api/get_gallery')
            .pipe(
                tap((meterial) => {
                    this._materials.next(meterial);
                })
            );
    }

    //* get position by id
    getById(Id: any): Observable<any[]> {
        return this._httpClient
            .get<any[]>(environment.API_URL + '/api/gallery/' + Id)
            .pipe(
                tap((meterial) => {
                    this._materials.next(meterial);
                })
            );
    }

    //   * update branch
    update(data: any): Observable<any> {
        return this._httpClient
            .post(
                environment.API_URL + '/api/update_gallery',
                data,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }
}
