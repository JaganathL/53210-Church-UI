import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarriageRegisterService, MarriageRecord, ApiPaginatedResponse } from '../../services/marriage-register.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-marriage-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './marriage-register.component.html',
  styleUrls: ['./marriage-register.component.scss']
})
export class MarriageRegisterComponent implements OnInit, OnDestroy {
  searchQuery = '';
  showModal = false;
  isEditMode = false;
  selectedRecordId: string | null = null;
  marriageForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  matrimonyRecords: MarriageRecord[] = [];
  filteredRecordsArray: MarriageRecord[] = [];

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  // Sorting properties
  currentSortField = 'dateOfMarriage';
  currentSortDir: 'ASC' | 'DESC' = 'DESC';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private marriageRegisterService: MarriageRegisterService
  ) {
    this.marriageForm = this.fb.group({
      dateOfMarriage: ['', Validators.required],
      groomName: ['', Validators.required],
      brideName: ['', Validators.required],
      placeOfMarriage: ['', Validators.required],
      groomFather: ['', Validators.required],
      brideFather: ['', Validators.required],
      solemnizedBy: ['', Validators.required],
      groomDob: [''],
      brideDob: [''],
      groomCondition: [''],
      brideCondition: [''],
      groomProfession: [''],
      brideProfession: [''],
      groomResidence: [''],
      brideResidence: ['']
    });
  }

  ngOnInit(): void {
    // Load marriage records from API
    this.loadMarriageRecords();

    // Subscribe to marriage records observable
    this.marriageRegisterService.marriageRecords$
      .pipe(takeUntil(this.destroy$))
      .subscribe((records: MarriageRecord[]) => {
        this.matrimonyRecords = records;
        this.updateFilteredRecords();
      });

    // Subscribe to pagination info
    this.marriageRegisterService.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pagination: ApiPaginatedResponse | null) => {
        if (pagination) {
          this.currentPage = pagination.currentPage;
          this.pageSize = pagination.pageSize;
          this.totalPages = pagination.totalPages;
          this.totalElements = pagination.totalElements;
          this.hasNextPage = pagination.hasNextPage;
          this.hasPreviousPage = pagination.hasPreviousPage;
        }
      });

    // Subscribe to loading state
    this.marriageRegisterService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });

    // Subscribe to error messages
    this.marriageRegisterService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: string) => {
        if (error) {
          this.errorMessage = error;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all marriage records from API
   */
  loadMarriageRecords(): void {
    this.marriageRegisterService.getAllMarriageRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.matrimonyRecords = response.content || [];
          this.updateFilteredRecords();
        },
        error: (error: any) => {
          console.error('Error loading records:', error);
          this.errorMessage = 'Failed to load marriage records';
        }
      });
  }

  /**
   * Update filtered records based on search query
   */
  updateFilteredRecords(): void {
    if (!this.searchQuery.trim()) {
      this.filteredRecordsArray = [...this.matrimonyRecords];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredRecordsArray = this.matrimonyRecords.filter(record =>
        (record.groomName && record.groomName.toLowerCase().includes(query)) ||
        (record.brideName && record.brideName.toLowerCase().includes(query)) ||
        (record.dateOfMarriage && record.dateOfMarriage.includes(query))
      );
    }
  }

  /**
   * Handle search query change
   */
  onSearchChange(): void {
    this.updateFilteredRecords();
  }

  /**
   * Open modal for adding new record
   */
  onAddNew(): void {
    this.isEditMode = false;
    this.selectedRecordId = null;
    this.showModal = true;
    this.marriageForm.reset();
  }

  /**
   * View marriage record details
   */
  onView(record: MarriageRecord): void {
    alert(`View record for ${record.groomName} & ${record.brideName}\nDate: ${record.dateOfMarriage}`);
  }

  /**
   * Edit marriage record
   */
  onEdit(record: MarriageRecord): void {
    this.isEditMode = true;
    this.selectedRecordId = record.id || null;
    this.showModal = true;

    // Populate form with existing data
    this.marriageForm.patchValue({
      dateOfMarriage: record.dateOfMarriage || '',
      groomName: record.groomName || '',
      brideName: record.brideName || '',
      placeOfMarriage: record.placeOfMarriage || '',
      groomFather: record.groomFather || '',
      brideFather: record.brideFather || '',
      solemnizedBy: record.solemnizedBy || '',
      groomDob: record.groomDob || '',
      brideDob: record.brideDob || '',
      groomCondition: record.groomCondition || '',
      brideCondition: record.brideCondition || '',
      groomProfession: record.groomProfession || '',
      brideProfession: record.brideProfession || '',
      groomResidence: record.groomResidence || '',
      brideResidence: record.brideResidence || ''
    });
  }

  /**
   * Delete marriage record
   */
  onDelete(record: MarriageRecord): void {
    if (confirm(`Delete marriage record for ${record.groomName} & ${record.brideName}?`)) {
      if (record.id) {
        this.marriageRegisterService.deleteMarriageRecord(record.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.successMessage = 'Record deleted successfully';
              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
              this.loadMarriageRecords();
            },
            error: (error: any) => {
              console.error('Error deleting record:', error);
              this.errorMessage = 'Failed to delete record';
            }
          });
      }
    }
  }

  /**
   * Save marriage record (Create or Update)
   */
  onSaveRecord(): void {
    if (this.marriageForm.valid) {
      const formData: MarriageRecord = {
        dateOfMarriage: this.marriageForm.get('dateOfMarriage')?.value,
        groomName: this.marriageForm.get('groomName')?.value,
        brideName: this.marriageForm.get('brideName')?.value,
        placeOfMarriage: this.marriageForm.get('placeOfMarriage')?.value,
        groomFather: this.marriageForm.get('groomFather')?.value,
        brideFather: this.marriageForm.get('brideFather')?.value,
        solemnizedBy: this.marriageForm.get('solemnizedBy')?.value,
        groomDob: this.marriageForm.get('groomDob')?.value || null,
        brideDob: this.marriageForm.get('brideDob')?.value || null,
        groomCondition: this.marriageForm.get('groomCondition')?.value || null,
        brideCondition: this.marriageForm.get('brideCondition')?.value || null,
        groomProfession: this.marriageForm.get('groomProfession')?.value || null,
        brideProfession: this.marriageForm.get('brideProfession')?.value || null,
        groomResidence: this.marriageForm.get('groomResidence')?.value || null,
        brideResidence: this.marriageForm.get('brideResidence')?.value || null
      };

      if (this.isEditMode && this.selectedRecordId) {
        // Update existing record
        this.marriageRegisterService.updateMarriageRecord(this.selectedRecordId, formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.successMessage = 'Marriage record updated successfully';
              this.showModal = false;
              this.marriageForm.reset();
              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
              this.loadMarriageRecords();
            },
            error: (error: any) => {
              console.error('Error updating record:', error);
              this.errorMessage = 'Failed to update marriage record';
            }
          });
      } else {
        // Create new record
        this.marriageRegisterService.createMarriageRecord(formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.successMessage = 'Marriage record created successfully';
              this.showModal = false;
              this.marriageForm.reset();
              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
              this.loadMarriageRecords();
            },
            error: (error: any) => {
              console.error('Error creating record:', error);
              this.errorMessage = 'Failed to create marriage record';
            }
          });
      }
    }
  }

  /**
   * Close modal and reset form
   */
  onCancel(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedRecordId = null;
    this.marriageForm.reset();
    this.marriageRegisterService.clearError();
  }

  /**
   * Get filtered records
   */
  get filteredRecords(): MarriageRecord[] {
    return this.filteredRecordsArray;
  }

  /**
   * Go to next page
   */
  onNextPage(): void {
    this.marriageRegisterService.getNextPage();
  }

  /**
   * Go to previous page
   */
  onPreviousPage(): void {
    this.marriageRegisterService.getPreviousPage();
  }

  /**
   * Go to specific page
   */
  onGoToPage(pageNumber: number): void {
    this.marriageRegisterService.goToPage(pageNumber, this.pageSize);
  }

  /**
   * Sort by field
   */
  onSort(field: string): void {
    const newSortDir: 'ASC' | 'DESC' =
      field === this.currentSortField && this.currentSortDir === 'DESC' ? 'ASC' : 'DESC';
    this.currentSortField = field;
    this.currentSortDir = newSortDir;
    this.marriageRegisterService.sortBy(field, newSortDir);
  }

  /**
   * Get array of page numbers to display
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
