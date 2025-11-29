# Marriage Register Service - API Integration Guide

## Overview
A complete service-based API integration has been implemented for the Marriage Register component. The service handles all CRUD operations with the backend API at `https://church-record-management-system.onrender.com/api/marriage-register`.

---

## Service Architecture

### File Location
`src/app/services/marriage-register.service.ts`

### Key Features
1. **HTTP Client Integration** - Uses Angular's HttpClient for API communication
2. **Observable-based** - Returns RxJS observables for reactive data binding
3. **BehaviorSubject** - Maintains state using subjects for real-time updates
4. **Error Handling** - Comprehensive error handling with user-friendly messages
5. **Loading States** - Tracks loading status for UI feedback

---

## API Endpoints

The service communicates with the following endpoints:

```
GET    /api/marriage-register/all              - Get all marriage records
GET    /api/marriage-register/{id}             - Get a specific record by ID
POST   /api/marriage-register/create           - Create a new record
PUT    /api/marriage-register/{id}             - Update an existing record
DELETE /api/marriage-register/{id}             - Delete a record
GET    /api/marriage-register/search?search=   - Search records
```

---

## Service Methods

### 1. getAllMarriageRecords()
```typescript
getAllMarriageRecords(): Observable<MarriageRecord[]>
```
- **Purpose**: Fetch all marriage records from the API
- **Returns**: Observable array of MarriageRecord objects
- **Emits**: Updates the marriageRecords$ subject

### 2. getMarriageRecordById(id: number)
```typescript
getMarriageRecordById(id: number): Observable<MarriageRecord>
```
- **Purpose**: Fetch a specific record by ID
- **Returns**: Observable of single MarriageRecord

### 3. createMarriageRecord(record: MarriageRecord)
```typescript
createMarriageRecord(record: MarriageRecord): Observable<ApiResponse>
```
- **Purpose**: Create a new marriage record
- **Returns**: Observable of ApiResponse (success/error)
- **Auto-refresh**: Automatically reloads all records after creation

### 4. updateMarriageRecord(id: number, record: MarriageRecord)
```typescript
updateMarriageRecord(id: number, record: MarriageRecord): Observable<ApiResponse>
```
- **Purpose**: Update an existing record
- **Returns**: Observable of ApiResponse
- **Auto-refresh**: Automatically reloads all records after update

### 5. deleteMarriageRecord(id: number)
```typescript
deleteMarriageRecord(id: number): Observable<ApiResponse>
```
- **Purpose**: Delete a record
- **Returns**: Observable of ApiResponse
- **Auto-refresh**: Automatically reloads all records after deletion

### 6. searchMarriageRecords(searchTerm: string)
```typescript
searchMarriageRecords(searchTerm: string): Observable<MarriageRecord[]>
```
- **Purpose**: Search records by a term
- **Returns**: Observable array of matching records

---

## Observable Subjects

The service exposes three observable subjects for component subscription:

### 1. marriageRecords$
- **Type**: BehaviorSubject<MarriageRecord[]>
- **Usage**: Subscribe to get real-time updates of all marriage records
- **Initial Value**: Empty array

### 2. loading$
- **Type**: BehaviorSubject<boolean>
- **Usage**: Track API loading state for showing spinners/loaders
- **Initial Value**: false

### 3. error$
- **Type**: BehaviorSubject<string>
- **Usage**: Get error messages from API operations
- **Initial Value**: Empty string

---

## MarriageRecord Interface

```typescript
interface MarriageRecord {
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
  brideChristianName?: string;
  brideSurname?: string;
  brideDateOfBirth?: string;
  brideAge?: number;
  brideRankOfProfession?: string;
  brideCondition?: string;
}
```

---

## Component Integration

The Marriage Register component uses the service as follows:

### Initialization
```typescript
ngOnInit(): void {
  // Load marriage records from API
  this.loadMarriageRecords();

  // Subscribe to service observables
  this.marriageRegisterService.marriageRecords$
    .pipe(takeUntil(this.destroy$))
    .subscribe((records: MarriageRecord[]) => {
      this.matrimonyRecords = records;
      this.updateFilteredRecords();
    });
}
```

### Create Record
```typescript
onSaveRecord(): void {
  if (this.marriageForm.valid) {
    this.marriageRegisterService.createMarriageRecord(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Marriage record created successfully';
          this.loadMarriageRecords();
        },
        error: (error) => {
          this.errorMessage = 'Failed to create marriage record';
        }
      });
  }
}
```

### Update Record
```typescript
onEdit(record: MarriageRecord): void {
  this.marriageRegisterService.updateMarriageRecord(recordId, formData)
    .subscribe({
      next: () => {
        this.successMessage = 'Record updated successfully';
        this.loadMarriageRecords();
      }
    });
}
```

### Delete Record
```typescript
onDelete(record: MarriageRecord): void {
  if (confirm('Delete this record?')) {
    this.marriageRegisterService.deleteMarriageRecord(record.id)
      .subscribe({
        next: () => {
          this.successMessage = 'Record deleted successfully';
          this.loadMarriageRecords();
        }
      });
  }
}
```

---

## Error Handling

The service provides comprehensive error handling:

1. **HTTP Errors** - Caught and converted to user-friendly messages
2. **Error Subject** - All errors are emitted via the error$ subject
3. **Auto-clear** - Errors are automatically cleared after 5 seconds in the component
4. **Fallback Values** - Returns empty arrays on error to prevent UI crashes

```typescript
catchError((error) => {
  console.error('Error creating marriage record:', error);
  this.loadingSubject.next(false);
  this.errorSubject.next(error.error?.message || 'Failed to create marriage record');
  throw error;
})
```

---

## Setup & Configuration

### 1. HttpClient Provider
Add to `src/main.ts`:
```typescript
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
})
```

### 2. Service Injection
The service is provided at the root level:
```typescript
@Injectable({
  providedIn: 'root'
})
export class MarriageRegisterService { }
```

### 3. Component Usage
Inject the service in your component:
```typescript
constructor(
  private fb: FormBuilder,
  private marriageRegisterService: MarriageRegisterService
) { }
```

---

## Features Implemented

✅ **CRUD Operations** - Create, Read, Update, Delete records via API
✅ **Search Functionality** - Search records by groom/bride/date
✅ **Loading States** - Show loading indicators during API calls
✅ **Error Messages** - Display error feedback to users
✅ **Success Messages** - Show confirmation after operations
✅ **Auto-refresh** - Automatically reload list after changes
✅ **Form Validation** - Prevent invalid submissions
✅ **Edit Mode** - Pre-populate form when editing records
✅ **Memory Management** - Uses takeUntil with destroy$ subject
✅ **Type Safety** - Full TypeScript typing for all operations

---

## UI Components

### Alert Messages
- **Success Alert** - Green background with check icon
- **Error Alert** - Red background with animation
- **Auto-dismiss** - Automatically disappears after 5 seconds

### Loading State
- Shows during API calls
- Component disables actions during loading

### Modal Form
- **Add Mode** - For creating new records
- **Edit Mode** - For updating existing records
- **Form Fields** - All mapped to service interface properties

---

## Testing the API

To test the API integration:

1. Open the application at `http://localhost:4200`
2. Navigate to Marriage Register page
3. Click "Add New Record" button
4. Fill the form with valid data
5. Click "Save Record" button
6. Check browser console for API logs
7. Verify success message appears
8. Check table for new record

---

## API Response Format

The service expects API responses in the following format:

### Success Response (Create/Update/Delete)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* record data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

### List Response
```json
[
  {
    "id": 1,
    "groomName": "John David",
    "brideName": "Sarah Williams",
    "dateOfMarriage": "2025-10-02",
    "solemnizedBy": "Rev. Thomas",
    "venueResidence": "Alangulam",
    ...
  }
]
```

---

## Notes & Future Improvements

1. **Bride Information** - Currently only Groom Information form fields are visible. Add bride details section if needed.
2. **Pagination** - Implement pagination for large record sets
3. **Sorting** - Add sorting capabilities by date, names, etc.
4. **Advanced Filters** - Implement date range, pastor name, residence filters
5. **Offline Support** - Add service worker for offline capability
6. **Export** - Add PDF/Excel export functionality
7. **Batch Operations** - Support bulk delete/update operations

---

## Files Modified

1. ✅ `src/services/marriage-register.service.ts` - New service created
2. ✅ `src/app/pages/marriage-register/marriage-register.component.ts` - Integrated service
3. ✅ `src/app/pages/marriage-register/marriage-register.component.html` - Updated bindings
4. ✅ `src/app/pages/marriage-register/marriage-register.component.scss` - Added alert styles
5. ✅ `src/main.ts` - Added HttpClient provider

---

**Development Server**: Running on `http://localhost:4200`
**API Base URL**: `https://church-record-management-system.onrender.com/api/marriage-register`
