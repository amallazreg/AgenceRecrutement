import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AdminServiceService } from '../../services/admin-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  skills: string[];
  cvUrl: string;
  status: 'active' | 'inactive';
  registrationDate: string;
}

@Component({
  selector: 'app-condidate',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './condidate.component.html',
  styleUrls: ['./condidate.component.css'] // ✅ correction ici
})
export class CondidateComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  totalUser: number = 0;
  errorMessage = '';

  constructor(private adminService: AdminServiceService) {}

  ngOnInit() {
    this.loadSampleData(); // Les données sont chargées et filtrées après l'appel API
    this.getTotalCandidates();
  }

  loadSampleData() {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.candidates = res;
        this.filterCandidates(); // ✅ filtrage après avoir reçu les données
      },
      error: (err) => {
        console.error('Erreur lors du chargement des candidats:', err);
        this.errorMessage = 'Erreur lors du chargement des candidats.';
      }
    });
  }

  filterCandidates() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredCandidates = [...this.candidates];
    } else {
      this.filteredCandidates = this.candidates.filter(candidate =>
        (candidate.name?.toLowerCase().includes(term)) ||
        (candidate.email?.toLowerCase().includes(term)) ||
        (candidate.specialty?.toLowerCase().includes(term))
      );
    }

    console.log('Search term:', this.searchTerm);
    console.log('Filtered candidates:', this.filteredCandidates);
  }

  getActiveCandidates(): number {
    return this.candidates.filter(candidate => candidate.status === 'active').length;
  }

  getTotalCandidates() {
    this.adminService.getUserCount().subscribe({
      next: (res) => {
        this.totalUser = res.totalUser;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du nombre de users:', err);
      }
    });
  }

  downloadCV(candidate: Candidate) {
    console.log('Downloading CV:', candidate.cvUrl);
    // TODO: implémenter le téléchargement
  }

  viewCandidate(candidate: Candidate) {
    console.log('View candidate:', candidate);
    // TODO: implémenter la vue du profil
  }

  editCandidate(candidate: Candidate) {
    console.log('Edit candidate:', candidate);
    // TODO: implémenter la modification
  }

  deleteCandidate(candidate: Candidate) {
    if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      this.candidates = this.candidates.filter(c => c.id !== candidate.id);
      this.filterCandidates();
    }
  }
exportData() {
  try {
    const data = this.filteredCandidates && this.filteredCandidates.length ? this.filteredCandidates : this.candidates;

    if (!data || data.length === 0) {
      alert('No candidates to export.');
      return;
    }

    const doc: any = new jsPDF('landscape', 'pt', 'a4'); // cast to any to avoid TS type issues
    const pageWidth = doc.internal.pageSize.getWidth();

    // header
    const title = 'candidates List';
    const dateStr = new Date().toLocaleString();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported: ${dateStr}`, pageWidth - 160, 44, { align: 'right' });

    const head = [[
      'Name',
      'E-mail',
      'Phone',
      'Speciality'
     
    ]];

    const body = data.map((c: any) => [
      c.name ?? '',
      c.email ?? '',
      c.phone ?? '',
      c.speciality ?? ''
    ]);

    autoTable(doc, {
      startY: 70,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [60, 141, 188], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20, top: 20, bottom: 30 },
      didDrawPage: (dataArg: any) => {
        // pageNumber fourni par autoTable ; pageCount via doc.internal (casted)
        const pageNumber = dataArg.pageNumber; // numéro de la page courante
        const pageCount = (doc as any).internal.getNumberOfPages(); // total pages
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidthLocal = doc.internal.pageSize.getWidth();

        // ligne séparatrice (optionnelle)
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(20, 60, pageWidthLocal - 20, 60);

        // footer : "Page X of Y"
        doc.setFontSize(9);
        doc.setTextColor(100);
        const footerText = `Page ${pageNumber} of ${pageCount}`;
        doc.text(footerText, pageWidthLocal / 2, pageHeight - 10, { align: 'center' });
      },
      showHead: 'everyPage'
    });

    const fileName = `candidates_export_${ (new Date()).toISOString().slice(0,10) }.pdf`;
    doc.save(fileName);

  } catch (err) {
    console.error('Export PDF error:', err);
    alert('Erreur lors de la génération du PDF.');
  }
}
  refreshData() {
    this.loadSampleData();
  }
}
