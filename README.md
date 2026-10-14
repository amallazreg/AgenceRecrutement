# Recruitment Platform — Plateforme de Recrutement

## 📌 Présentation du projet

Cette plateforme web de recrutement a pour objectif de faciliter la mise en relation entre les candidats à la recherche d'opportunités professionnelles et les recruteurs souhaitant identifier les meilleurs profils.

Elle propose un espace dédié à chaque type d'utilisateur afin de simplifier le processus de recrutement, de la publication des offres d'emploi jusqu'à la gestion des candidatures.

## 🎯 Objectifs

- Faciliter la recherche d'emploi et la découverte d'opportunités professionnelles.
- Permettre aux recruteurs de publier et de gérer leurs offres d'emploi.
- Simplifier le dépôt et le suivi des candidatures.
- Centraliser les informations des candidats et des recruteurs.
- Améliorer l'expérience utilisateur grâce à une interface intuitive et responsive.

## ✨ Fonctionnalités principales

### 👤 Espace candidat
- Création de compte et authentification.
- Gestion du profil professionnel.
- Consultation et recherche d'offres d'emploi.
- Candidature aux offres disponibles.
- Suivi du statut des candidatures.

### 🏢 Espace recruteur
- Création de compte et gestion du profil de l'entreprise.
- Publication, modification et suppression des offres d'emploi.
- Consultation des candidatures reçues.
- Gestion des candidatures et suivi de leur évolution.

### ⚙️ Fonctionnalités générales
- Interface utilisateur responsive.
- Recherche et filtrage des offres d'emploi.
- Gestion des accès selon le rôle de l'utilisateur.
- Communication centralisée entre candidats et recruteurs, selon les fonctionnalités implémentées.

🤖 Intelligence artificielle et recommandations intelligentes

La plateforme intègre un système de recommandation basé sur l'intelligence artificielle afin d'optimiser le processus de recrutement et de faciliter la mise en relation entre les candidats et les recruteurs.

Pour les candidats :

- Recommandation automatique des offres d'emploi les plus adaptées à leur profil.
- Calcul d'un score de correspondance entre les compétences du candidat et les exigences des offres.
- Classement des offres selon leur niveau de compatibilité avec le profil du candidat.

Pour les recruteurs :

- Analyse des profils des candidats par rapport aux exigences de chaque offre d'emploi.
- Calcul d'un score de compatibilité pour chaque candidat.
- Classement automatique des candidats selon leur score de correspondance.
- Identification rapide des profils les plus pertinents pour faciliter la présélection des candidats.

## 🛠️ Technologies utilisées

**Frontend**
- Angular
- TypeScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express.js

**Base de données**
- À préciser selon la solution utilisée dans le projet.

**Outils de développement**
- Git et GitHub
- Visual Studio Code
- npm

## 🏗️ Architecture du projet

Le projet repose sur une architecture client-serveur :

- **Frontend Angular :** interface utilisateur, navigation et interactions.
- **Backend Node.js / Express.js :** gestion des requêtes HTTP, logique métier et API REST.
- **Base de données :** stockage et gestion des données des utilisateurs, des offres d'emploi et des candidatures.

## 🚀 Installation et lancement

### Prérequis

- Node.js et npm
- Angular CLI
- Git

### 1. Cloner le projet

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd <NOM_DU_PROJET>
```

### 2. Installer et lancer le frontend

```bash
cd frontend
npm install
ng serve
```

Accéder à l'application : `http://localhost:4200`

### 3. Installer et lancer le backend

Dans un autre terminal :

```bash
cd backend
npm install
npm run dev
```

La commande de lancement dépend des scripts définis dans le fichier `package.json`.

## 🔐 Sécurité

La plateforme doit prévoir une authentification sécurisée, une gestion des rôles et des autorisations, ainsi qu'une validation des données reçues par l'API.

## 📈 Perspectives d'évolution

- Notifications concernant les nouvelles offres et les candidatures.
- Système de messagerie entre candidats et recruteurs.


