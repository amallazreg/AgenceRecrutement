import { Injectable } from '@angular/core';
import { Offer } from './offers.service';

@Injectable({
  providedIn: 'root'
})
export class OfferHelperServiceService {

  /**
   * Récupère les champs spécifiques selon le secteur
   */
  getSpecificFields(offer: Offer): SpecificField[] {
    const sector = offer.sector?.toLowerCase();
    
    switch(sector) {
      case 'informatique':
  case 'it':
  case 'technologie':
        return this.getITFields(offer);
      
      case 'marketing':
        return this.getMarketingFields(offer);
      
      case 'finance':
        return this.getFinanceFields(offer);
      
      case 'santé':
      case 'sante':
        return this.getHealthFields(offer);
      
      case 'éducation':
      case 'education':
        return this.getEducationFields(offer);
      
      case 'commerce':
        return this.getCommerceFields(offer);
      
      case 'industrie':
        return this.getIndustryFields(offer);
      
      default:
        return [];
    }
  }

  private getITFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.programmingLanguages?.length) {
      fields.push({
        icon: '💻',
        label: 'Langages de programmation',
        value: offer.programmingLanguages,
        type: 'tags'
      });
    }
    
    if (offer.frameworks?.length) {
      fields.push({
        icon: '🛠️',
        label: 'Frameworks',
        value: offer.frameworks,
        type: 'tags'
      });
    }
    
    if (offer.databaseKnowledge?.length) {
      fields.push({
        icon: '🗄️',
        label: 'Bases de données',
        value: offer.databaseKnowledge,
        type: 'tags'
      });
    }
    
    if (offer.tools?.length) {
      fields.push({
        icon: '🔧',
        label: 'Outils',
        value: offer.tools,
        type: 'tags'
      });
    }
    
    if (offer.projectType) {
      fields.push({
        icon: '📁',
        label: 'Type de projet',
        value: offer.projectType,
        type: 'text'
      });
    }
    
    if (offer.methodology?.length) {
      fields.push({
        icon: '📊',
        label: 'Méthodologies',
        value: offer.methodology,
        type: 'tags'
      });
    }
    
    return fields;
  }

  private getMarketingFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.marketingChannels?.length) {
      fields.push({
        icon: '📢',
        label: 'Canaux marketing',
        value: offer.marketingChannels,
        type: 'tags'
      });
    }
    
    if (offer.campaignTools?.length) {
      fields.push({
        icon: '🎯',
        label: 'Outils de campagne',
        value: offer.campaignTools,
        type: 'tags'
      });
    }
    
    if (offer.targetAudience?.length) {
      fields.push({
        icon: '👥',
        label: 'Public cible',
        value: offer.targetAudience,
        type: 'tags'
      });
    }
    
    if (offer.kpiFocus?.length) {
      fields.push({
        icon: '📈',
        label: 'KPI Focus',
        value: offer.kpiFocus,
        type: 'tags'
      });
    }
    
    return fields;
  }

  private getFinanceFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.financialTools?.length) {
      fields.push({
        icon: '💼',
        label: 'Outils financiers',
        value: offer.financialTools,
        type: 'tags'
      });
    }
    
    if (offer.areaOfExpertise?.length) {
      fields.push({
        icon: '🎓',
        label: "Domaines d'expertise",
        value: offer.areaOfExpertise,
        type: 'tags'
      });
    }
    
    if (offer.certifications?.length) {
      fields.push({
        icon: '📜',
        label: 'Certifications',
        value: offer.certifications,
        type: 'tags'
      });
    }
    
    if (offer.reportingFrequency?.length) {
      fields.push({
        icon: '📅',
        label: 'Fréquence de reporting',
        value: offer.reportingFrequency,
        type: 'tags'
      });
    }
    
    return fields;
  }

  private getHealthFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.requiredDiploma?.length) {
      fields.push({
        icon: '🎓',
        label: 'Diplômes requis',
        value: offer.requiredDiploma,
        type: 'list'
      });
    }
    
    if (offer.medicalSpecialty?.length) {
      fields.push({
        icon: '⚕️',
        label: 'Spécialités médicales',
        value: offer.medicalSpecialty,
        type: 'tags'
      });
    }
    
    if (offer.workSchedule?.length) {
      fields.push({
        icon: '🕐',
        label: 'Horaires de travail',
        value: offer.workSchedule,
        type: 'tags'
      });
    }
    
    if (offer.licenseNumber?.length) {
      fields.push({
        icon: '🆔',
        label: 'Numéros de licence',
        value: offer.licenseNumber,
        type: 'list'
      });
    }
    
    return fields;
  }

  private getEducationFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.teachingLevel?.length) {
      fields.push({
        icon: '📚',
        label: "Niveaux d'enseignement",
        value: offer.teachingLevel,
        type: 'tags'
      });
    }
    
    if (offer.subjectTaught?.length) {
      fields.push({
        icon: '📖',
        label: 'Matières enseignées',
        value: offer.subjectTaught,
        type: 'tags'
      });
    }
    
    if (offer.requiredDegree?.length) {
      fields.push({
        icon: '🎓',
        label: 'Diplômes requis',
        value: offer.requiredDegree,
        type: 'list'
      });
    }
    
    if (offer.classSize) {
      fields.push({
        icon: '👨‍🎓',
        label: 'Taille de classe',
        value: `${offer.classSize} élèves`,
        type: 'text'
      });
    }
    
    return fields;
  }

  private getCommerceFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.salesType?.length) {
      fields.push({
        icon: '💰',
        label: 'Type de vente',
        value: offer.salesType,
        type: 'tags'
      });
    }
    
    if (offer.productType?.length) {
      fields.push({
        icon: '📦',
        label: 'Type de produit',
        value: offer.productType,
        type: 'tags'
      });
    }
    
    if (offer.salesTarget?.length) {
      fields.push({
        icon: '🎯',
        label: 'Objectifs de vente',
        value: offer.salesTarget,
        type: 'tags'
      });
    }
    
    if (offer.customerManagementTools?.length) {
      fields.push({
        icon: '🛠️',
        label: 'Outils CRM',
        value: offer.customerManagementTools,
        type: 'tags'
      });
    }
    
    if (offer.mobilityRequired !== undefined) {
      fields.push({
        icon: '🚗',
        label: 'Mobilité',
        value: offer.mobilityRequired ? 'Requise' : 'Non requise',
        type: 'text'
      });
    }
    
    return fields;
  }

  private getIndustryFields(offer: Offer): SpecificField[] {
    const fields: SpecificField[] = [];
    
    if (offer.machineOperation?.length) {
      fields.push({
        icon: '⚙️',
        label: 'Machines',
        value: offer.machineOperation,
        type: 'tags'
      });
    }
    
    if (offer.safetyCertifications?.length) {
      fields.push({
        icon: '🦺',
        label: 'Certifications sécurité',
        value: offer.safetyCertifications,
        type: 'tags'
      });
    }
    
    if (offer.shiftType) {
      fields.push({
        icon: '🕐',
        label: 'Type de poste',
        value: offer.shiftType,
        type: 'text'
      });
    }
    
    if (offer.productionEnvironment) {
      fields.push({
        icon: '🏭',
        label: 'Environnement',
        value: offer.productionEnvironment,
        type: 'text'
      });
    }
    
    if (offer.qualityControl) {
      fields.push({
        icon: '✅',
        label: 'Contrôle qualité',
        value: offer.qualityControl,
        type: 'text'
      });
    }
    
    return fields;
  }

  /**
   * Détermine quels champs afficher dans la card (liste)
   */
  getCardPreviewFields(offer: Offer): { show: string[], limit: number } {
    return {
      show: ['title', 'company', 'location', 'contractType', 'salaryRange', 'workingHours', 'requiredSkills'],
      limit: 4 // Nombre max de skills à afficher
    };
  }

  /**
   * Vérifie si une offre a des champs spécifiques
   */
  hasSpecificFields(offer: Offer): boolean {
    return this.getSpecificFields(offer).length > 0;
  }
}

export interface SpecificField {
  icon: string;
  label: string;
  value: string | string[];
  type: 'text' | 'tags' | 'list';
}