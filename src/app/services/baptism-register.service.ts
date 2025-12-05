import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BaptismRecord {
    id?: string;
    number?: number;
    dateOfBaptism: string;
    dateOfBirth: string;
    christianName: string;
    sex: string;
    parentName: string;
    parentAbode: string;
    parentProfession?: string;
    godparents?: {
        godfather?: string;
        godmother?: string;
    };
    whereBaptized: string;
    pastorate?: string;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    search?: string;
}

export interface ApiPaginatedResponse {
    content: BaptismRecord[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BaptismRegisterService {
    private apiUrl = `${environment.apiUrl}/baptism-register/list`;

    private baptismRecordsSubject = new BehaviorSubject<BaptismRecord[]>([]);
    public baptismRecords$ = this.baptismRecordsSubject.asObservable();

    private paginationSubject = new BehaviorSubject<ApiPaginatedResponse | null>(null);
    public pagination$ = this.paginationSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private errorSubject = new BehaviorSubject<string>('');
    public error$ = this.errorSubject.asObservable();

    // Default pagination params
    private defaultParams: PaginationParams = {
        page: 0,
        size: 10,
        sortBy: 'dateOfBaptism',
        sortDir: 'DESC'
    };

    constructor(private http: HttpClient) {
        this.loadBaptismRecords();
    }

    /**
     * Get all baptism records with pagination and sorting
     */
    getAllBaptismRecords(params?: PaginationParams): Observable<ApiPaginatedResponse> {
        this.loadingSubject.next(true);
        const queryParams = { ...this.defaultParams, ...params };

        let httpParams = new HttpParams();
        httpParams = httpParams.set('page', queryParams.page?.toString() || '0');
        httpParams = httpParams.set('size', queryParams.size?.toString() || '10');
        httpParams = httpParams.set('sortBy', queryParams.sortBy || 'dateOfBaptism');
        httpParams = httpParams.set('sortDir', queryParams.sortDir || 'DESC');

        return this.http.get<ApiPaginatedResponse>(this.apiUrl, {
            params: httpParams
        })
            .pipe(
                tap((response: ApiPaginatedResponse) => {
                    this.baptismRecordsSubject.next(response.content || []);
                    this.paginationSubject.next(response);
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                }),
                catchError((error) => {
                    console.error('Error fetching baptism records:', error);
                    this.errorSubject.next(`Failed to load baptism records: ${error.message}`);
                    this.loadingSubject.next(false);

                    return of({
                        content: [],
                        totalElements: 0,
                        totalPages: 0,
                        currentPage: 0,
                        pageSize: 10,
                        hasNextPage: false,
                        hasPreviousPage: false
                    } as ApiPaginatedResponse);
                })
            );
    }
    /**
     * Get baptism record by ID
     */
    getBaptismRecordById(id: string): Observable<BaptismRecord> {
        this.loadingSubject.next(true);
        return this.http.get<BaptismRecord>(`/api/baptism-register/id/${id}`)
            .pipe(
                tap(() => {
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                }),
                catchError((error) => {
                    console.error('Error fetching baptism record:', error);
                    this.errorSubject.next('Failed to load baptism record');
                    this.loadingSubject.next(false);
                    throw error;
                })
            );
    }

    /**
     * Create a new baptism record
     */
    createBaptismRecord(record: BaptismRecord): Observable<BaptismRecord> {
        this.loadingSubject.next(true);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<BaptismRecord>('https://church-record-management-system.onrender.com/api/baptism-register/create', record, { headers })
            .pipe(
                tap((response: BaptismRecord) => {
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                    this.loadBaptismRecords();
                }),
                catchError((error) => {
                    console.error('Error creating baptism record:', error);
                    this.loadingSubject.next(false);
                    this.errorSubject.next(error.error?.message || 'Failed to create baptism record');
                    throw error;
                })
            );
    }

    /**
     * Update an existing baptism record
     */
    updateBaptismRecord(id: string, record: BaptismRecord): Observable<BaptismRecord> {
        this.loadingSubject.next(true);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.put<BaptismRecord>(`https://church-record-management-system.onrender.com/api/baptism-register/update/${id}`, record, { headers })
            .pipe(
                tap((response: BaptismRecord) => {
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                    this.loadBaptismRecords();
                }),
                catchError((error) => {
                    console.error('Error updating baptism record:', error);
                    this.loadingSubject.next(false);
                    this.errorSubject.next(error.error?.message || 'Failed to update baptism record');
                    throw error;
                })
            );
    }

    /**
     * Delete a baptism record
     */
    deleteBaptismRecord(id: string): Observable<any> {
        this.loadingSubject.next(true);

        return this.http.delete(`https://church-record-management-system.onrender.com/api/baptism-register/remove/${id}`)
            .pipe(
                tap(() => {
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                    this.loadBaptismRecords();
                }),
                catchError((error) => {
                    console.error('Error deleting baptism record:', error);
                    this.loadingSubject.next(false);
                    this.errorSubject.next(error.error?.message || 'Failed to delete baptism record');
                    throw error;
                })
            );
    }

    /**
     * Search baptism records
     */
    searchBaptismRecords(searchTerm: string, params?: PaginationParams): Observable<ApiPaginatedResponse> {
        this.loadingSubject.next(true);
        const queryParams = { ...this.defaultParams, ...params, search: searchTerm };

        let httpParams = new HttpParams();
        httpParams = httpParams.set('page', queryParams.page?.toString() || '0');
        httpParams = httpParams.set('size', queryParams.size?.toString() || '10');
        httpParams = httpParams.set('sortBy', queryParams.sortBy || 'dateOfBaptism');
        httpParams = httpParams.set('sortDir', queryParams.sortDir || 'DESC');
        httpParams = httpParams.set('search', searchTerm);

        return this.http.get<ApiPaginatedResponse>(this.apiUrl, { params: httpParams })
            .pipe(
                tap((response: ApiPaginatedResponse) => {
                    this.baptismRecordsSubject.next(response.content || []);
                    this.paginationSubject.next(response);
                    this.loadingSubject.next(false);
                    this.errorSubject.next('');
                }),
                catchError((error) => {
                    console.error('Error searching baptism records:', error);
                    this.loadingSubject.next(false);
                    this.errorSubject.next('Failed to search baptism records');
                    return of({
                        content: [],
                        totalElements: 0,
                        totalPages: 0,
                        currentPage: 0,
                        pageSize: 10,
                        hasNextPage: false,
                        hasPreviousPage: false
                    } as ApiPaginatedResponse);
                })
            );
    }

    getNextPage(): void {
        const current = this.paginationSubject.value;
        if (current && current.hasNextPage) {
            this.getAllBaptismRecords({
                page: (current.currentPage + 1),
                size: current.pageSize,
            }).subscribe();
        }
    }

    getPreviousPage(): void {
        const current = this.paginationSubject.value;
        if (current && current.hasPreviousPage) {
            this.getAllBaptismRecords({
                page: (current.currentPage - 1),
                size: current.pageSize,
            }).subscribe();
        }
    }

    goToPage(pageNumber: number, pageSize: number = 10): void {
        this.getAllBaptismRecords({
            page: pageNumber,
            size: pageSize,
        }).subscribe();
    }

    sortBy(field: string, direction: 'ASC' | 'DESC' = 'DESC'): void {
        this.getAllBaptismRecords({
            page: 0,
            sortBy: field,
            sortDir: direction
        }).subscribe();
    }

    private loadBaptismRecords(): void {
        this.getAllBaptismRecords().subscribe();
    }

    getCurrentBaptismRecords(): BaptismRecord[] {
        return this.baptismRecordsSubject.value;
    }

    getCurrentPagination(): ApiPaginatedResponse | null {
        return this.paginationSubject.value;
    }

    clearError(): void {
        this.errorSubject.next('');
    }
}
