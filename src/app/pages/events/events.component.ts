import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events = [
    { 
      id: 1, 
      title: 'Sunday Service', 
      date: '2024-02-04', 
      time: '09:00 AM',
      location: 'Main Hall',
      description: 'Weekly Sunday worship service',
      attendees: 150,
      status: 'Upcoming'
    },
    { 
      id: 2, 
      title: 'Bible Study', 
      date: '2024-02-07', 
      time: '07:00 PM',
      location: 'Conference Room',
      description: 'Bible study and discussion',
      attendees: 45,
      status: 'Upcoming'
    },
    { 
      id: 3, 
      title: 'Youth Fellowship', 
      date: '2024-02-10', 
      time: '06:00 PM',
      location: 'Youth Center',
      description: 'Youth group activities and games',
      attendees: 80,
      status: 'Upcoming'
    },
    { 
      id: 4, 
      title: 'Prayer Meeting', 
      date: '2024-01-31', 
      time: '06:30 PM',
      location: 'Prayer Room',
      description: 'Evening prayer session',
      attendees: 60,
      status: 'Completed'
    }
  ];

  searchQuery = '';

  get filteredEvents() {
    return this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
