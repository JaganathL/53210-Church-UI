import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent {
  donations = [
    { id: 1, donor: 'John Doe', amount: 500, date: '2024-02-01', purpose: 'Building Fund', method: 'Card' },
    { id: 2, donor: 'Jane Smith', amount: 250, date: '2024-02-02', purpose: 'General Fund', method: 'Transfer' },
    { id: 3, donor: 'Robert Johnson', amount: 1000, date: '2024-02-03', purpose: 'Missions', method: 'Check' },
    { id: 4, donor: 'Mary Williams', amount: 150, date: '2024-02-03', purpose: 'Benevolence', method: 'Cash' },
    { id: 5, donor: 'Michael Brown', amount: 300, date: '2024-02-04', purpose: 'Building Fund', method: 'Card' }
  ];

  searchQuery = '';
  totalDonations = this.donations.reduce((sum, d) => sum + d.amount, 0);

  get filteredDonations() {
    return this.donations.filter(donation =>
      donation.donor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      donation.purpose.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get totalFiltered() {
    return this.filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  }
}
