# Code Structure Overview

## Service Layer

### `marriage-register.service.ts`
```
MarriageRegisterService
├── Properties
│   ├── apiUrl: string
│   ├── marriageRecordsSubject: BehaviorSubject<MarriageRecord[]>
│   ├── loadingSubject: BehaviorSubject<boolean>
│   └── errorSubject: BehaviorSubject<string>
│
├── Public Observables
│   ├── marriageRecords$: Observable
│   ├── loading$: Observable
│   └── error$: Observable
│
└── Methods
    ├── getAllMarriageRecords(): Observable<MarriageRecord[]>
    ├── getMarriageRecordById(id): Observable<MarriageRecord>
    ├── createMarriageRecord(record): Observable<ApiResponse>
    ├── updateMarriageRecord(id, record): Observable<ApiResponse>
    ├── deleteMarriageRecord(id): Observable<ApiResponse>
    ├── searchMarriageRecords(term): Observable<MarriageRecord[]>
    ├── getCurrentMarriageRecords(): MarriageRecord[]
    ├── clearError(): void
    └── loadMarriageRecords(): void (private)
```

## Component Layer

### `marriage-register.component.ts`
```
MarriageRegisterComponent implements OnInit, OnDestroy
├── Properties
│   ├── searchQuery: string
│   ├── showModal: boolean
│   ├── isEditMode: boolean
│   ├── selectedRecordId: number | null
│   ├── marriageForm: FormGroup
│   ├── isLoading: boolean
│   ├── errorMessage: string
│   ├── successMessage: string
│   ├── matrimonyRecords: MarriageRecord[]
│   ├── filteredRecordsArray: MarriageRecord[]
│   └── destroy$: Subject<void> (private)
│
├── Lifecycle Hooks
│   ├── ngOnInit(): void
│   └── ngOnDestroy(): void
│
├── Data Management
│   ├── loadMarriageRecords(): void
│   ├── updateFilteredRecords(): void
│   └── filteredRecords: MarriageRecord[] (getter)
│
└── Event Handlers
    ├── onSearchChange(): void
    ├── onAddNew(): void
    ├── onView(record): void
    ├── onEdit(record): void
    ├── onDelete(record): void
    ├── onSaveRecord(): void
    └── onCancel(): void
```

### `marriage-register.component.html`
```
.marriage-register-container
├── Alert Messages
│   ├── Error Alert (*ngIf)
│   └── Success Alert (*ngIf)
│
├── Header Section
│   └── "Add New Record" Button
│
├── Search/Filter Section
│   ├── Search Input (2-way binding)
│   └── Filter Button
│
├── Modal Overlay (*ngIf)
│   └── Modal Dialog
│       ├── Modal Header
│       ├── Modal Form (Reactive Forms)
│       │   ├── Marriage Details Section
│       │   ├── Groom Information Section
│       │   └── Form Actions
│       └── Modal Footer
│
└── Records Table
    ├── Table Header
    ├── Table Body (*ngFor)
    │   ├── Serial No
    │   ├── Groom Name (with avatar)
    │   ├── Bride Name (with avatar)
    │   ├── Date
    │   ├── Pastor/Solemnized By
    │   ├── Residence
    │   └── Action Buttons (View, Edit, Delete)
    └── No Records Message (*ngIf)
```

### `marriage-register.component.scss`
```
Styles Structure
├── Alert Messages
│   ├── .alert (base)
│   ├── .alert-error (error state)
│   └── .alert-success (success state)
│
├── Modal Styles
│   ├── .modal-overlay
│   ├── .modal-dialog
│   ├── .modal-content
│   ├── .modal-header
│   ├── .modal-form
│   └── .modal-footer
│
├── Form Styles
│   ├── .form-section
│   ├── .form-row
│   ├── .form-group
│   ├── .form-input
│   ├── .calendar-icon
│   └── .input-with-icon
│
├── Table Styles
│   ├── .records-table-container
│   ├── .marriage-table
│   ├── .serial-no
│   ├── .groom-cell
│   ├── .bride-cell
│   ├── .person-info
│   ├── .person-avatar
│   ├── .action-cell
│   ├── .action-buttons
│   ├── .btn-icon
│   ├── .btn-view
│   ├── .btn-edit
│   └── .btn-delete
│
└── Responsive Breakpoints
    ├── @media (max-width: 1400px)
    ├── @media (max-width: 1200px)
    ├── @media (max-width: 1024px)
    ├── @media (max-width: 768px)
    ├── @media (max-width: 480px)
    └── @media (max-width: 360px)
```

## Data Models

### `MarriageRecord` Interface
```typescript
interface MarriageRecord {
  // Identification
  id?: number;
  serialNo?: number;
  
  // Groom Details
  groomName: string;
  groomImage?: string;
  groomChristianName?: string;
  groomSurname?: string;
  groomDateOfBirth?: string;
  groomAge?: number;
  groomRankOfProfession?: string;
  groomCondition?: string;
  
  // Bride Details
  brideName: string;
  brideImage?: string;
  brideChristianName?: string;
  brideSurname?: string;
  brideDateOfBirth?: string;
  brideAge?: number;
  brideRankOfProfession?: string;
  brideCondition?: string;
  
  // Marriage Details
  dateOfMarriage: string;
  solemnizedBy: string;
  venueResidence: string;
}
```

### `ApiResponse` Interface
```typescript
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```

## Dependency Injection

### Service Providers
```typescript
// In main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // Enables HTTP communication
  ]
})

// Service provided at root
@Injectable({
  providedIn: 'root'
})
```

### Component Injections
```typescript
constructor(
  private fb: FormBuilder,  // Angular Forms
  private marriageRegisterService: MarriageRegisterService  // Custom Service
) { }
```

## Observable Subscriptions

### Component ngOnInit
```
1. this.marriageRegisterService.getAllMarriageRecords()
   └─ Updates matrimonyRecords[]
   
2. this.marriageRegisterService.marriageRecords$
   └─ Updates matrimonyRecords[] and filteredRecordsArray
   
3. this.marriageRegisterService.loading$
   └─ Updates isLoading boolean
   
4. this.marriageRegisterService.error$
   └─ Updates errorMessage string
   └─ Auto-clears after 5 seconds
```

## API Integration Flow

```
User Interaction
    ↓
Component Method
    │
    ├─→ Service Method Call
    │   ├─→ loadingSubject.next(true)
    │   ├─→ HTTP Request
    │   │   ├─→ GET, POST, PUT, DELETE
    │   │   └─→ Error Handling
    │   ├─→ Update Subjects
    │   └─→ loadingSubject.next(false)
    │
    └─→ Subscribe to Observable
        ├─→ next: Handle Success
        │   ├─→ Update Local State
        │   ├─→ Refresh Data
        │   ├─→ Show Success Message
        │   └─→ Close Modal
        │
        └─→ error: Handle Error
            ├─→ Log to Console
            ├─→ Show Error Message
            └─→ Keep Modal Open
```

## Form Structure

### Reactive Form Creation
```typescript
this.marriageForm = this.fb.group({
  dateOfMarriage: ['', Validators.required],
  solemnizedBy: ['', Validators.required],
  venueResidence: ['', Validators.required],
  groomChristianName: ['', Validators.required],
  groomSurname: ['', Validators.required],
  groomDateOfBirth: ['', Validators.required],
  groomAge: ['', Validators.required],
  groomRankOfProfession: ['', Validators.required],
  groomCondition: ['', Validators.required]
})
```

### Form Validation
```
Before Save:
├─ Check marriageForm.valid === true
├─ All required fields filled
└─ Enable Save button only if valid

After Save:
├─ Constructor validation via Validators.required
├─ Server-side validation at API level
└─ Client handles API error responses
```

## Performance Optimizations

1. **Memory Management**
   - `takeUntil(destroy$)` prevents memory leaks
   - Proper cleanup in ngOnDestroy()

2. **Change Detection**
   - Reactive forms with OnPush strategy compatible
   - BehaviorSubjects for immediate updates

3. **Lazy Loading**
   - Marriage Register component lazy-loaded in routes
   - Service provided at root for singleton pattern

4. **Error Handling**
   - Silent catches prevent console errors
   - User-friendly error messages
   - Auto-clearing error display

## Security Considerations

1. **API Communication**
   - Uses HTTPS for API calls
   - HttpClient handles CSRF tokens automatically

2. **Form Validation**
   - Client-side validation prevents invalid submissions
   - Server-side validation at API

3. **Error Messages**
   - Generic error messages to users
   - Detailed logs in console for developers
