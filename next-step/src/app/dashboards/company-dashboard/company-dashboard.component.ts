import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

interface Job {
  id: number;
  title: string;
  department: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  datePosted: string;
  views: number;
}

interface Candidate {
  id: number;
  name: string;
  position: string;
  status: 'new' | 'reviewed' | 'interview' | 'rejected' | 'hired';
  applicationDate: string;
  score: number;
}

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit {
   activeJobs: Job[] = [];
  recentCandidates: Candidate[] = [];
  metrics: Metric[] = [];
  quickActions = [
    { icon: 'add', label: 'Post New Job', action: 'postJob' },
    { icon: 'search', label: 'Search Candidates', action: 'searchCandidates' },
    { icon: 'assessment', label: 'View Analytics', action: 'viewAnalytics' },
    { icon: 'schedule', label: 'Schedule Interview', action: 'scheduleInterview' }
  ];

  ngOnInit() {
    this.loadSampleData();
    this.loadMetrics();
  }

  loadSampleData() {
    // Active Jobs
    this.activeJobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        applications: 24,
        status: 'active',
        datePosted: '2024-01-15',
        views: 156
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        applications: 18,
        status: 'active',
        datePosted: '2024-01-18',
        views: 89
      },
      {
        id: 3,
        title: 'UX Designer',
        department: 'Design',
        applications: 32,
        status: 'active',
        datePosted: '2024-01-20',
        views: 203
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        department: 'Engineering',
        applications: 15,
        status: 'active',
        datePosted: '2024-01-22',
        views: 78
      }
    ];

    // Recent Candidates
    this.recentCandidates = [
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'Senior Frontend Developer',
        status: 'interview',
        applicationDate: '2024-01-25',
        score: 87
      },
      {
        id: 2,
        name: 'Mike Chen',
        position: 'Product Manager',
        status: 'reviewed',
        applicationDate: '2024-01-24',
        score: 92
      },
      {
        id: 3,
        name: 'Emma Wilson',
        position: 'UX Designer',
        status: 'new',
        applicationDate: '2024-01-26',
        score: 78
      },
      {
        id: 4,
        name: 'David Brown',
        position: 'DevOps Engineer',
        status: 'interview',
        applicationDate: '2024-01-23',
        score: 85
      }
    ];
  }

  loadMetrics() {
    this.metrics = [
      {
        title: 'Total Applications',
        value: '156',
        change: '+12%',
        trend: 'up',
        icon: 'description',
        color: 'primary'
      },
      {
        title: 'Active Jobs',
        value: '8',
        change: '+2',
        trend: 'up',
        icon: 'work',
        color: 'success'
      },
      {
        title: 'Interview Schedule',
        value: '14',
        change: '+5',
        trend: 'up',
        icon: 'calendar_today',
        color: 'warning'
      },
      {
        title: 'Hiring Rate',
        value: '68%',
        change: '+8%',
        trend: 'up',
        icon: 'trending_up',
        color: 'info'
      }
    ];
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new': 'status-new',
      'reviewed': 'status-reviewed',
      'interview': 'status-interview',
      'rejected': 'status-rejected',
      'hired': 'status-hired',
      'active': 'status-active',
      'closed': 'status-closed',
      'draft': 'status-draft'
    };
    return statusMap[status] || 'status-default';
  }

  getStatusText(status: string): string {
    const statusText: { [key: string]: string } = {
      'new': 'New',
      'reviewed': 'Reviewed',
      'interview': 'Interview',
      'rejected': 'Rejected',
      'hired': 'Hired',
      'active': 'Active',
      'closed': 'Closed',
      'draft': 'Draft'
    };
    return statusText[status] || status;
  }

  performAction(action: string) {
    switch (action) {
      case 'postJob':
        console.log('Posting new job...');
        break;
      case 'searchCandidates':
        console.log('Searching candidates...');
        break;
      case 'viewAnalytics':
        console.log('Viewing analytics...');
        break;
      case 'scheduleInterview':
        console.log('Scheduling interview...');
        break;
    }
  }

  viewJob(job: Job) {
    console.log('Viewing job:', job);
  }

  viewCandidate(candidate: Candidate) {
    console.log('Viewing candidate:', candidate);
  }

  getTotalApplications(): number {
    return this.activeJobs.reduce((total, job) => total + job.applications, 0);
  }

  getAverageScore(): number {
    const scores = this.recentCandidates.map(c => c.score);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  }
}