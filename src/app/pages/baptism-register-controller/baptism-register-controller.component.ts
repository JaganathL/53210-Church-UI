import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaptismRegisterService, BaptismRecord, ApiPaginatedResponse } from '../../services/baptism-register.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-baptism-register-controller',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './baptism-register-controller.component.html',
    styleUrls: ['./baptism-register-controller.component.scss']
})
export class BaptismRegisterControllerComponent implements OnInit, OnDestroy {
    searchQuery = '';
    showModal = false;
    isEditMode = false;
    selectedRecordId: string | null = null;
    baptismForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    baptismRecords: BaptismRecord[] = [];
    filteredRecordsArray: BaptismRecord[] = [];

    // Pagination properties
    currentPage = 0;
    pageSize = 10;
    totalPages = 0;
    totalElements = 0;
    hasNextPage = false;
    hasPreviousPage = false;

    // Sorting properties
    currentSortField = 'dateOfBaptism';
    currentSortDir: 'ASC' | 'DESC' = 'DESC';

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private baptismRegisterService: BaptismRegisterService
    ) {
        this.baptismForm = this.fb.group({
            christianName: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            dateOfBaptism: ['', Validators.required],
            sex: ['', Validators.required],
            parentName: ['', Validators.required],
            parentAbode: ['', Validators.required],
            parentProfession: [''],
            whereBaptized: ['', Validators.required],
            godfather: [''],
            godmother: [''],
            pastorate: ['']
        });
    }

    ngOnInit(): void {
        this.loadBaptismRecords();

        this.baptismRegisterService.baptismRecords$
            .pipe(takeUntil(this.destroy$))
            .subscribe((records: BaptismRecord[]) => {
                this.baptismRecords = records;
                this.updateFilteredRecords();
            });

        this.baptismRegisterService.pagination$
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

        this.baptismRegisterService.loading$
            .pipe(takeUntil(this.destroy$))
            .subscribe((loading: boolean) => {
                this.isLoading = loading;
            });

        this.baptismRegisterService.error$
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

    loadBaptismRecords(): void {
        this.baptismRegisterService.getAllBaptismRecords()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.baptismRecords = response.content || [];
                    this.updateFilteredRecords();
                },
                error: (error: any) => {
                    console.error('Error loading records:', error);
                    this.errorMessage = 'Failed to load baptism records';
                }
            });
    }

    updateFilteredRecords(): void {
        if (!this.searchQuery.trim()) {
            this.filteredRecordsArray = [...this.baptismRecords];
        } else {
            const query = this.searchQuery.toLowerCase();
            this.filteredRecordsArray = this.baptismRecords.filter(record =>
                (record.christianName && record.christianName.toLowerCase().includes(query)) ||
                (record.parentName && record.parentName.toLowerCase().includes(query)) ||
                (record.parentAbode && record.parentAbode.toLowerCase().includes(query)) ||
                (record.dateOfBaptism && record.dateOfBaptism.includes(query))
            );
        }
    }

    onSearchChange(): void {
        this.updateFilteredRecords();
    }

    onAddNew(): void {
        this.isEditMode = false;
        this.selectedRecordId = null;
        this.showModal = true;
        this.baptismForm.reset();
    }

    onView(record: BaptismRecord): void {
        alert(`View record for ${record.christianName}\nBaptized on: ${record.dateOfBaptism}`);
    }

    onEdit(record: BaptismRecord): void {
        this.isEditMode = true;
        this.selectedRecordId = record.id || null;
        this.showModal = true;

        this.baptismForm.patchValue({
            christianName: record.christianName || '',
            dateOfBirth: record.dateOfBirth || '',
            dateOfBaptism: record.dateOfBaptism || '',
            sex: record.sex || '',
            parentName: record.parentName || '',
            parentAbode: record.parentAbode || '',
            parentProfession: record.parentProfession || '',
            whereBaptized: record.whereBaptized || '',
            godfather: record.godparents?.godfather || '',
            godmother: record.godparents?.godmother || '',
            pastorate: record.pastorate || ''
        });
    }

    onDelete(record: BaptismRecord): void {
        if (confirm(`Delete baptism record for ${record.christianName}?`)) {
            if (record.id) {
                this.baptismRegisterService.deleteBaptismRecord(record.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.successMessage = 'Record deleted successfully';
                            setTimeout(() => {
                                this.successMessage = '';
                            }, 5000);
                            this.loadBaptismRecords();
                        },
                        error: (error: any) => {
                            console.error('Error deleting record:', error);
                            this.errorMessage = 'Failed to delete record';
                        }
                    });
            }
        }
    }

    onSaveRecord(): void {
        if (this.baptismForm.valid) {
            const godfather = this.baptismForm.get('godfather')?.value;
            const godmother = this.baptismForm.get('godmother')?.value;

            const formData: BaptismRecord = {
                christianName: this.baptismForm.get('christianName')?.value,
                dateOfBirth: this.baptismForm.get('dateOfBirth')?.value,
                dateOfBaptism: this.baptismForm.get('dateOfBaptism')?.value,
                sex: this.baptismForm.get('sex')?.value,
                parentName: this.baptismForm.get('parentName')?.value,
                parentAbode: this.baptismForm.get('parentAbode')?.value,
                parentProfession: this.baptismForm.get('parentProfession')?.value || undefined,
                whereBaptized: this.baptismForm.get('whereBaptized')?.value,
                pastorate: this.baptismForm.get('pastorate')?.value || undefined
            };

            if (godfather || godmother) {
                formData.godparents = {};
                if (godfather) formData.godparents.godfather = godfather;
                if (godmother) formData.godparents.godmother = godmother;
            }

            if (this.isEditMode && this.selectedRecordId) {
                this.baptismRegisterService.updateBaptismRecord(this.selectedRecordId, formData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.successMessage = 'Baptism record updated successfully';
                            this.showModal = false;
                            this.baptismForm.reset();
                            setTimeout(() => {
                                this.successMessage = '';
                            }, 5000);
                            this.loadBaptismRecords();
                        },
                        error: (error: any) => {
                            console.error('Error updating record:', error);
                            this.errorMessage = 'Failed to update baptism record';
                        }
                    });
            } else {
                this.baptismRegisterService.createBaptismRecord(formData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.successMessage = 'Baptism record created successfully';
                            this.showModal = false;
                            this.baptismForm.reset();
                            setTimeout(() => {
                                this.successMessage = '';
                            }, 5000);
                            this.loadBaptismRecords();
                        },
                        error: (error: any) => {
                            console.error('Error creating record:', error);
                            this.errorMessage = 'Failed to create baptism record';
                        }
                    });
            }
        }
    }

    onCancel(): void {
        this.showModal = false;
        this.isEditMode = false;
        this.selectedRecordId = null;
        this.baptismForm.reset();
        this.baptismRegisterService.clearError();
    }

    get filteredRecords(): BaptismRecord[] {
        return this.filteredRecordsArray;
    }

    onNextPage(): void {
        this.baptismRegisterService.getNextPage();
    }

    onPreviousPage(): void {
        this.baptismRegisterService.getPreviousPage();
    }

    onGoToPage(pageNumber: number): void {
        this.baptismRegisterService.goToPage(pageNumber, this.pageSize);
    }

    onSort(field: string): void {
        const newSortDir: 'ASC' | 'DESC' =
            field === this.currentSortField && this.currentSortDir === 'DESC' ? 'ASC' : 'DESC';
        this.currentSortField = field;
        this.currentSortDir = newSortDir;
        this.baptismRegisterService.sortBy(field, newSortDir);
    }

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
