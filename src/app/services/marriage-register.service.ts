import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MarriageRecord {
  id?: number;
  serialNo?: number;
  groomName: string;
  groomImage?: string;
  brideName: string;
  brideImage?: string;
  dateOfMarriage: string;
  solemnizedBy: string;
  venueResidence: string;
  groomChristianName?: string;
  groomSurname?: string;
  groomDateOfBirth?: string;
  groomAge?: number;
  groomRankOfProfession?: string;
  groomCondition?: string;
  groomFatherName?: string;
  brideChristianName?: string;
  brideSurname?: string;
  brideDateOfBirth?: string;
  brideAge?: number;
  brideRankOfProfession?: string;
  brideCondition?: string;
  brideFatherName?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  search?: string;
}

export interface ApiPaginatedResponse {
  content: MarriageRecord[];
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
export class MarriageRegisterService {
  private apiUrl = 'https://church-record-management-system.onrender.com/api/marriage-register';
  
  private marriageRecordsSubject = new BehaviorSubject<MarriageRecord[]>([]);
  public marriageRecords$ = this.marriageRecordsSubject.asObservable();

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
    sortBy: 'dateOfMarriage',
    sortDir: 'DESC'
  };

  constructor(private http: HttpClient) {
    this.loadMarriageRecords();
  }

  /**
   * Get all marriage records with pagination and sorting
   * API: GET /api/marriage-register?page=0&size=10&sortBy=dateOfMarriage&sortDir=DESC
   */
  getAllMarriageRecords(params?: PaginationParams): Observable<ApiPaginatedResponse> {
    this.loadingSubject.next(true);
    const queryParams = { ...this.defaultParams, ...params };
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', queryParams.page?.toString() || '0');
    httpParams = httpParams.set('size', queryParams.size?.toString() || '10');
    httpParams = httpParams.set('sortBy', queryParams.sortBy || 'dateOfMarriage');
    httpParams = httpParams.set('sortDir', queryParams.sortDir || 'DESC');

    console.log('Fetching from API:', this.apiUrl);

    return this.http.get<ApiPaginatedResponse>(this.apiUrl, { 
      params: httpParams
    })
      .pipe(
        tap((response: ApiPaginatedResponse) => {
          console.log('API Response received:', response);
          this.marriageRecordsSubject.next(response.content || []);
          this.paginationSubject.next(response);
          this.loadingSubject.next(false);
          this.errorSubject.next('');
        }),
        catchError((error) => {
          console.error('Error fetching marriage records:', error);
          this.errorSubject.next(`Failed to load marriage records: ${error.message}`);
          this.loadingSubject.next(false);
          
          // Return empty response on error
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
   * Get marriage record by ID
   * API: GET /api/marriage-register/{id}
   */
  getMarriageRecordById(id: number): Observable<MarriageRecord> {
    this.loadingSubject.next(true);
    return this.http.get<MarriageRecord>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.loadingSubject.next(false);
          this.errorSubject.next('');
        }),
        catchError((error) => {
          console.error('Error fetching marriage record:', error);
          this.errorSubject.next('Failed to load marriage record');
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Create a new marriage record
   * API: POST /api/marriage-register
   */
  createMarriageRecord(record: MarriageRecord): Observable<MarriageRecord> {
    this.loadingSubject.next(true);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.post<MarriageRecord>(this.apiUrl, record, { headers })
      .pipe(
        tap((response: MarriageRecord) => {
          console.log('Marriage record created successfully:', response);
          this.loadingSubject.next(false);
          this.errorSubject.next('');
          this.loadMarriageRecords();
        }),
        catchError((error) => {
          console.error('Error creating marriage record:', error);
          this.loadingSubject.next(false);
          
          let errorMessage = 'Failed to create marriage record';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 0) {
            errorMessage = 'Network error or CORS issue. Please check your connection and API endpoint.';
          } else if (error.status === 403) {
            errorMessage = 'Access forbidden. CORS policy may be blocking the request.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid data. Please check the form fields.';
          }
          
          this.errorSubject.next(errorMessage);
          throw error;
        })
      );
  }

  /**
   * Update an existing marriage record
   * API: PUT /api/marriage-register/{id}
   */
  updateMarriageRecord(id: number, record: MarriageRecord): Observable<MarriageRecord> {
    this.loadingSubject.next(true);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.put<MarriageRecord>(`${this.apiUrl}/${id}`, record, { headers })
      .pipe(
        tap((response: MarriageRecord) => {
          console.log('Marriage record updated successfully:', response);
          this.loadingSubject.next(false);
          this.errorSubject.next('');
          this.loadMarriageRecords();
        }),
        catchError((error) => {
          console.error('Error updating marriage record:', error);
          this.loadingSubject.next(false);
          
          let errorMessage = 'Failed to update marriage record';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 0) {
            errorMessage = 'Network error or CORS issue. Please check your connection and API endpoint.';
          } else if (error.status === 403) {
            errorMessage = 'Access forbidden. CORS policy may be blocking the request.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid data. Please check the form fields.';
          } else if (error.status === 404) {
            errorMessage = 'Marriage record not found.';
          }
          
          this.errorSubject.next(errorMessage);
          throw error;
        })
      );
  }

  /**
   * Delete a marriage record
   * API: DELETE /api/marriage-register/{id}
   */
  deleteMarriageRecord(id: number): Observable<any> {
    this.loadingSubject.next(true);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        tap(() => {
          console.log('Marriage record deleted successfully');
          this.loadingSubject.next(false);
          this.errorSubject.next('');
          this.loadMarriageRecords();
        }),
        catchError((error) => {
          console.error('Error deleting marriage record:', error);
          this.loadingSubject.next(false);
          
          let errorMessage = 'Failed to delete marriage record';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 0) {
            errorMessage = 'Network error or CORS issue. Please check your connection and API endpoint.';
          } else if (error.status === 403) {
            errorMessage = 'Access forbidden. CORS policy may be blocking the request.';
          } else if (error.status === 404) {
            errorMessage = 'Marriage record not found.';
          }
          
          this.errorSubject.next(errorMessage);
          throw error;
        })
      );
  }

  /**
   * Search marriage records
   * API: GET /api/marriage-register?search=term&page=0&size=10
   */
  searchMarriageRecords(searchTerm: string, params?: PaginationParams): Observable<ApiPaginatedResponse> {
    this.loadingSubject.next(true);
    const queryParams = { ...this.defaultParams, ...params, search: searchTerm };
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', queryParams.page?.toString() || '0');
    httpParams = httpParams.set('size', queryParams.size?.toString() || '10');
    httpParams = httpParams.set('sortBy', queryParams.sortBy || 'dateOfMarriage');
    httpParams = httpParams.set('sortDir', queryParams.sortDir || 'DESC');
    httpParams = httpParams.set('search', searchTerm);

    return this.http.get<ApiPaginatedResponse>(this.apiUrl, { params: httpParams })
      .pipe(
        tap((response: ApiPaginatedResponse) => {
          this.marriageRecordsSubject.next(response.content || []);
          this.paginationSubject.next(response);
          this.loadingSubject.next(false);
          this.errorSubject.next('');
        }),
        catchError((error) => {
          console.error('Error searching marriage records:', error);
          this.loadingSubject.next(false);
          this.errorSubject.next('Failed to search marriage records');
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
   * Navigate to next page
   */
  getNextPage(): void {
    const current = this.paginationSubject.value;
    if (current && current.hasNextPage) {
      this.getAllMarriageRecords({
        page: (current.currentPage + 1),
        size: current.pageSize,
      }).subscribe();
    }
  }

  /**
   * Navigate to previous page
   */
  getPreviousPage(): void {
    const current = this.paginationSubject.value;
    if (current && current.hasPreviousPage) {
      this.getAllMarriageRecords({
        page: (current.currentPage - 1),
        size: current.pageSize,
      }).subscribe();
    }
  }

  /**
   * Go to specific page
   */
  goToPage(pageNumber: number, pageSize: number = 10): void {
    this.getAllMarriageRecords({
      page: pageNumber,
      size: pageSize,
    }).subscribe();
  }

  /**
   * Sort by field
   */
  sortBy(field: string, direction: 'ASC' | 'DESC' = 'DESC'): void {
    this.getAllMarriageRecords({
      page: 0,
      sortBy: field,
      sortDir: direction
    }).subscribe();
  }

  /**
   * Load marriage records (internal)
   */
  private loadMarriageRecords(): void {
    this.getAllMarriageRecords().subscribe();
  }

  /**
   * Get current marriage records
   */
  getCurrentMarriageRecords(): MarriageRecord[] {
    return this.marriageRecordsSubject.value;
  }

  /**
   * Get current pagination state
   */
  getCurrentPagination(): ApiPaginatedResponse | null {
    return this.paginationSubject.value;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorSubject.next('');
  }
}
