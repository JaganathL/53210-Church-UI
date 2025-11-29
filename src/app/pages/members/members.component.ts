import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {
  members = [
    { id: 1, name: 'John Doe', email: 'john@church.com', phone: '555-0101', status: 'Active', joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@church.com', phone: '555-0102', status: 'Active', joined: '2023-02-10' },
    { id: 3, name: 'Robert Johnson', email: 'robert@church.com', phone: '555-0103', status: 'Active', joined: '2023-03-05' },
    { id: 4, name: 'Mary Williams', email: 'mary@church.com', phone: '555-0104', status: 'Inactive', joined: '2022-12-20' },
    { id: 5, name: 'Michael Brown', email: 'michael@church.com', phone: '555-0105', status: 'Active', joined: '2023-01-25' }
  ];

  searchQuery = '';

  get filteredMembers() {
    return this.members.filter(member =>
      member.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
