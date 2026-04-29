# 📚 Gestion de Bibliothèque - Groupe 4

## Description
Application web de gestion de bibliothèque développée en JavaScript (Node.js + Express.js).
Ce projet permet de gérer les livres, les emprunts, les retours et les amendes simulées d'une bibliothèque.

## Fonctionnalités

- **📖 Gestion des Livres** : Ajouter, modifier, supprimer et rechercher des livres
- **🤲 Gestion des Emprunts** : Enregistrer les emprunts de livres avec durée personnalisable
- **🔄 Gestion des Retours** : Enregistrer le retour des livres avec détection automatique des retards
- **💰 Amendes Simulées** : Calcul automatique des amendes en cas de retard (0.50€/jour)
- **📊 Tableau de Bord** : Vue d'ensemble avec statistiques en temps réel

## Technologies utilisées

| Technologie | Rôle |
|------------|------|
| **Node.js** | Environnement d'exécution JavaScript côté serveur |
| **Express.js** | Framework web pour créer le serveur HTTP et les routes API |
| **HTML5** | Structure des pages web |
| **CSS3** | Design et mise en page responsive |
| **JavaScript (Vanilla)** | Logique côté client (aucun framework) |
| **JSON** | Stockage des données (fichier `data/bibliotheque.json`) |

## Installation et lancement

### Prérequis
- [Node.js](https://nodejs.org/) version 14 ou supérieure

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/abergbot-sudo/Gestion_de_biblioth-que-.git

# 2. Accéder au dossier du projet
cd Gestion_de_biblioth-que-

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur
npm start
```

### Accéder à l'application
Ouvrir un navigateur et aller sur : **http://localhost:3000**

## Structure du projet

```
Gestion_de_biblioth-que-/
├── server.js              # Point d'entrée du serveur Express.js
├── package.json           # Configuration du projet et dépendances
├── README.md              # Ce fichier
├── routes/                # Dossier des routes API
│   ├── livres.js          # Routes pour la gestion des livres
│   ├── emprunts.js        # Routes pour la gestion des emprunts
│   ├── retours.js         # Routes pour la gestion des retours
│   └── amendes.js         # Routes pour la gestion des amendes
├── public/                # Dossier des fichiers statiques (frontend)
│   ├── index.html         # Page HTML principale
│   ├── css/
│   │   └── style.css      # Feuille de style CSS
│   └── js/
│       └── app.js         # Logique JavaScript côté client
└── data/                  # Dossier des données
    └── bibliotheque.json  # Base de données JSON (créé automatiquement)
```

## API Endpoints

### Livres
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/livres` | Récupérer tous les livres |
| GET | `/api/livres/:id` | Récupérer un livre par ID |
| GET | `/api/livres/recherche?q=terme` | Rechercher des livres |
| POST | `/api/livres` | Ajouter un nouveau livre |
| PUT | `/api/livres/:id` | Modifier un livre |
| DELETE | `/api/livres/:id` | Supprimer un livre |

### Emprunts
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/emprunts` | Récupérer tous les emprunts |
| GET | `/api/emprunts/en-cours` | Récupérer les emprunts en cours |
| POST | `/api/emprunts` | Créer un nouvel emprunt |

### Retours
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/retours/:empruntId` | Enregistrer un retour |

### Amendes
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/amendes` | Récupérer toutes les amendes |
| GET | `/api/amendes/stats` | Statistiques des amendes |
| PUT | `/api/amendes/:id/payer` | Payer une amende (simulation) |

### Statistiques
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/stats` | Statistiques générales |

## Auteurs

**Groupe 4** — Projet JavaScript
