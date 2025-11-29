import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stats = [
    { title: 'Total Members', value: '1,250', icon: '👥', color: '#3498db' },
    { title: 'Active Members', value: '950', icon: '✓', color: '#2ecc71' },
    { title: 'Upcoming Events', value: '8', icon: '📅', color: '#f39c12' },
    { title: 'Total Donations', value: '$45,320', icon: '💰', color: '#e74c3c' }
  ];

  recentMembers = [
    { name: 'John Doe', email: 'john@church.com', joined: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@church.com', joined: '2024-01-10' },
    { name: 'Robert Johnson', email: 'robert@church.com', joined: '2024-01-05' }
  ];

  upcomingEvents = [
    { title: 'Sunday Service', date: '2024-02-04', time: '09:00 AM' },
    { title: 'Bible Study', date: '2024-02-07', time: '07:00 PM' },
    { title: 'Youth Fellowship', date: '2024-02-10', time: '06:00 PM' }
  ];
}
