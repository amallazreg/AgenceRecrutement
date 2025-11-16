import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedPosition: string;
  department: string;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  matchScore: number;
  topSkills: string[];
  selected?: boolean;
}
@Component({
  selector: 'app-allcandidates',
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './allcandidates.component.html',
  styleUrl: './allcandidates.component.css'
})
export class AllcandidatesComponent implements OnInit {
  // Data
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  paginatedCandidates: Candidate[] = [];

  // Filters
  searchQuery: string = '';
  activeStatusFilter: string = 'all';
  sortBy: string = 'date-desc';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Loading
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  // ===== DATA LOADING =====
  loadCandidates(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.candidates = this.generateMockCandidates();
      this.filteredCandidates = [...this.candidates];
      this.updatePagination();
      this.isLoading = false;
    }, 1000);
  }

  generateMockCandidates(): Candidate[] {
    const positions = [
      { title: 'Senior Frontend Developer', dept: 'Engineering' },
      { title: 'Backend Engineer', dept: 'Engineering' },
      { title: 'Product Manager', dept: 'Product' },
      { title: 'UX/UI Designer', dept: 'Design' },
      { title: 'DevOps Engineer', dept: 'Infrastructure' },
      { title: 'Data Scientist', dept: 'Data' },
      { title: 'Marketing Manager', dept: 'Marketing' },
      { title: 'Sales Representative', dept: 'Sales' }
    ];

    const names = [
      'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim',
      'Jessica Martinez', 'John Anderson', 'Maria Garcia', 'Robert Taylor',
      'Amanda White', 'Christopher Lee', 'Jennifer Brown', 'Daniel Wilson',
      'Lisa Davis', 'Matthew Moore', 'Michelle Thomas', 'James Jackson',
      'Ashley Martin', 'Joshua Thompson', 'Laura Harris', 'Ryan Clark'
    ];

    const skills = [
      ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      ['Python', 'Django', 'PostgreSQL', 'Docker'],
      ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
      ['Machine Learning', 'Python', 'TensorFlow', 'SQL'],
      ['Angular', 'Vue.js', 'JavaScript', 'CSS']
    ];

    const statuses: ('pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected')[] = 
      ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];

    return Array.from({ length: 50 }, (_, i) => {
      const position = positions[Math.floor(Math.random() * positions.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const appliedDate = new Date();
      appliedDate.setDate(appliedDate.getDate() - daysAgo);

      return {
        id: `candidate-${i + 1}`,
        name: names[i % names.length],
        email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        appliedPosition: position.title,
        department: position.dept,
        appliedDate: appliedDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        matchScore: Math.floor(Math.random() * 40 + 60), // 60-100
        topSkills: skills[Math.floor(Math.random() * skills.length)],
        selected: false
      };
    });
  }

  // ===== METRICS =====
  getTotalCandidates(): number {
    return this.candidates.length;
  }

  getPendingCount(): number {
    return this.candidates.filter(c => c.status === 'pending').length;
  }

  getAcceptedCount(): number {
    return this.candidates.filter(c => c.status === 'accepted').length;
  }

  getInterviewCount(): number {
    return this.candidates.filter(c => c.status === 'interview').length;
  }

  // ===== SEARCH & FILTER =====
  onSearchChange(): void {
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.activeStatusFilter = status;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.candidates];

    // Apply search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.appliedPosition.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.activeStatusFilter !== 'all') {
      result = result.filter(c => c.status === this.activeStatusFilter);
    }

    // Apply sorting
    result = this.sortCandidates(result);

    this.filteredCandidates = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  // ===== SORTING =====
  onSortChange(): void {
    this.filteredCandidates = this.sortCandidates(this.filteredCandidates);
    this.updatePagination();
  }

  sortCandidates(candidates: Candidate[]): Candidate[] {
    const sorted = [...candidates];

    switch (this.sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime());
      case 'date-asc':
        return sorted.sort((a, b) => a.appliedDate.getTime() - b.appliedDate.getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'score-desc':
        return sorted.sort((a, b) => b.matchScore - a.matchScore);
      default:
        return sorted;
    }
  }

  // ===== PAGINATION =====
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCandidates = this.filteredCandidates.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredCandidates.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredCandidates.length ? this.filteredCandidates.length : end;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // ===== SELECTION =====
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.paginatedCandidates.forEach(c => c.selected = checked);
  }

  getSelectedCount(): number {
    return this.candidates.filter(c => c.selected).length;
  }

  // ===== STATUS HELPERS =====
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  onStatusChange(candidate: Candidate): void {
    console.log('Status changed for:', candidate.name, 'New status:', candidate.status);
    // Here you would typically call an API to update the status
    // this.candidateService.updateStatus(candidate.id, candidate.status).subscribe();
  }

  // ===== SCORE HELPERS =====
  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }

  // ===== TIME HELPERS =====
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }

  // ===== ACTIONS =====
  viewCandidate(candidate: Candidate): void {
    console.log('View candidate:', candidate);
    // Navigate to candidate detail page
    // this.router.navigate(['/candidates', candidate.id]);
  }

  downloadCV(candidate: Candidate): void {
    console.log('Download CV for:', candidate.name);
    // Implement CV download logic
  }

  sendEmail(candidate: Candidate): void {
    console.log('Send email to:', candidate.email);
    // Implement email sending logic
  }

  openMenu(candidate: Candidate): void {
    console.log('Open menu for:', candidate.name);
    // Show context menu with more options
  }
}
