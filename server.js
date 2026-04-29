// ============================================================
// server.js — Point d'entrée principal du serveur backend
// Ce fichier lance le serveur Express.js qui gère toute
// l'application de gestion de bibliothèque (Groupe 4).
// ============================================================

// --- Importation des modules nécessaires ---

// 'express' est un framework web pour Node.js qui simplifie
// la création de serveurs HTTP et la gestion des routes (URL).
const express = require('express');

// 'path' est un module natif de Node.js qui permet de
// manipuler les chemins de fichiers de manière portable
// (fonctionne sur Windows, Mac, Linux).
const path = require('path');

// 'fs' (File System) est un module natif de Node.js qui
// permet de lire et écrire des fichiers sur le disque dur.
// On utilise ici la version synchrone pour simplifier le code.
const fs = require('fs');

// --- Importation de nos fichiers de routes ---
// Chaque fichier de routes gère un domaine de l'application.

// Routes pour gérer les livres (ajouter, modifier, supprimer, lister)
const livresRoutes = require('./routes/livres');

// Routes pour gérer les emprunts (créer un emprunt, lister les emprunts)
const empruntsRoutes = require('./routes/emprunts');

// Routes pour gérer les retours (enregistrer un retour de livre)
const retoursRoutes = require('./routes/retours');

// Routes pour gérer les amendes simulées (calculer et afficher les amendes)
const amendesRoutes = require('./routes/amendes');

// --- Création de l'application Express ---
// 'app' est l'objet principal qui représente notre serveur web.
// On y ajoute des middlewares (fonctions intermédiaires) et des routes.
const app = express();

// --- Définition du port d'écoute ---
// Le serveur écoutera sur le port 3000.
// 'process.env.PORT' permet de le changer via une variable d'environnement
// (utile pour le déploiement sur un hébergeur comme Heroku, Render, etc.)
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARES (fonctions qui s'exécutent avant chaque requête)
// ============================================================

// Ce middleware permet au serveur de comprendre les données
// envoyées au format JSON dans le corps (body) des requêtes POST/PUT.
// Sans cela, 'req.body' serait 'undefined'.
app.use(express.json());

// Ce middleware permet de servir les fichiers statiques
// (HTML, CSS, JavaScript, images) depuis le dossier 'public'.
// Par exemple, si un fichier 'public/index.html' existe,
// il sera accessible à l'URL 'http://localhost:3000/index.html'.
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// INITIALISATION DES FICHIERS DE DONNÉES
// ============================================================

// Chemin vers le fichier qui stocke toutes les données de la bibliothèque
// '__dirname' est le dossier où se trouve le fichier server.js
const dataFilePath = path.join(__dirname, 'data', 'bibliotheque.json');

// Structure initiale des données si le fichier n'existe pas encore
// C'est le "schéma" de notre base de données JSON
const initialData = {
    // Liste de tous les livres de la bibliothèque
    livres: [
        // Quelques livres pré-remplis pour la démonstration
        {
            id: 1,                                    // Identifiant unique du livre
            titre: "Le Petit Prince",                 // Titre du livre
            auteur: "Antoine de Saint-Exupéry",       // Nom de l'auteur
            isbn: "978-2-07-040850-4",                // Numéro ISBN (identifiant international)
            annee: 1943,                              // Année de publication
            genre: "Conte",                           // Genre littéraire
            disponible: true                          // true = disponible, false = emprunté
        },
        {
            id: 2,
            titre: "Les Misérables",
            auteur: "Victor Hugo",
            isbn: "978-2-07-040951-8",
            annee: 1862,
            genre: "Roman",
            disponible: true
        },
        {
            id: 3,
            titre: "L'Étranger",
            auteur: "Albert Camus",
            isbn: "978-2-07-036024-8",
            annee: 1942,
            genre: "Roman",
            disponible: true
        },
        {
            id: 4,
            titre: "Germinal",
            auteur: "Émile Zola",
            isbn: "978-2-07-040930-3",
            annee: 1885,
            genre: "Roman",
            disponible: true
        },
        {
            id: 5,
            titre: "Le Comte de Monte-Cristo",
            auteur: "Alexandre Dumas",
            isbn: "978-2-07-040298-4",
            annee: 1844,
            genre: "Roman d'aventure",
            disponible: true
        }
    ],
    // Liste de tous les emprunts (en cours et passés)
    emprunts: [],
    // Liste de toutes les amendes générées
    amendes: []
};

// Vérifier si le fichier de données existe déjà
// 'fs.existsSync' retourne true si le fichier existe, false sinon
if (!fs.existsSync(dataFilePath)) {
    // Le fichier n'existe pas, on le crée avec les données initiales
    // 'JSON.stringify' convertit l'objet JavaScript en texte JSON
    // Le '2' à la fin ajoute une indentation de 2 espaces pour la lisibilité
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
    // Afficher un message dans la console pour confirmer la création
    console.log('📚 Fichier de données créé avec les livres de démonstration.');
}

// ============================================================
// FONCTIONS UTILITAIRES POUR LIRE/ÉCRIRE LES DONNÉES
// ============================================================

/**
 * Fonction pour lire toutes les données depuis le fichier JSON
 * @returns {Object} - L'objet contenant livres, emprunts et amendes
 */
function lireDonnees() {
    // Lire le contenu du fichier en texte (encodage UTF-8)
    const contenu = fs.readFileSync(dataFilePath, 'utf-8');
    // Convertir le texte JSON en objet JavaScript et le retourner
    return JSON.parse(contenu);
}

/**
 * Fonction pour sauvegarder les données dans le fichier JSON
 * @param {Object} donnees - L'objet contenant les données à sauvegarder
 */
function sauvegarderDonnees(donnees) {
    // Convertir l'objet en texte JSON avec indentation
    // puis l'écrire dans le fichier (écrase l'ancien contenu)
    fs.writeFileSync(dataFilePath, JSON.stringify(donnees, null, 2));
}

// Rendre ces fonctions accessibles aux fichiers de routes
// via 'app.locals' (variables partagées dans toute l'application)
app.locals.lireDonnees = lireDonnees;
app.locals.sauvegarderDonnees = sauvegarderDonnees;

// ============================================================
// ENREGISTREMENT DES ROUTES
// ============================================================

// Toutes les requêtes commençant par '/api/livres' seront
// gérées par le fichier 'routes/livres.js'
app.use('/api/livres', livresRoutes);

// Toutes les requêtes commençant par '/api/emprunts' seront
// gérées par le fichier 'routes/emprunts.js'
app.use('/api/emprunts', empruntsRoutes);

// Toutes les requêtes commençant par '/api/retours' seront
// gérées par le fichier 'routes/retours.js'
app.use('/api/retours', retoursRoutes);

// Toutes les requêtes commençant par '/api/amendes' seront
// gérées par le fichier 'routes/amendes.js'
app.use('/api/amendes', amendesRoutes);

// ============================================================
// ROUTE POUR LE TABLEAU DE BORD (DASHBOARD)
// ============================================================

// Route GET '/api/stats' — Retourne les statistiques de la bibliothèque
// Utilisée par le tableau de bord pour afficher les chiffres clés
app.get('/api/stats', (req, res) => {
    // Lire toutes les données actuelles
    const donnees = lireDonnees();

    // Calculer les statistiques
    const stats = {
        // Nombre total de livres dans la bibliothèque
        totalLivres: donnees.livres.length,

        // Nombre de livres actuellement disponibles (non empruntés)
        // 'filter' crée un nouveau tableau ne contenant que les éléments
        // qui respectent la condition (disponible === true)
        livresDisponibles: donnees.livres.filter(l => l.disponible).length,

        // Nombre de livres actuellement empruntés (non disponibles)
        livresEmpruntes: donnees.livres.filter(l => !l.disponible).length,

        // Nombre total d'emprunts enregistrés (en cours + terminés)
        totalEmprunts: donnees.emprunts.length,

        // Nombre d'emprunts actuellement en cours (pas encore retournés)
        // 'dateRetourEffective' est null quand le livre n'a pas été rendu
        empruntsEnCours: donnees.emprunts.filter(e => !e.dateRetourEffective).length,

        // Nombre total d'amendes générées
        totalAmendes: donnees.amendes.length,

        // Somme totale de toutes les amendes en euros
        // 'reduce' parcourt le tableau et accumule les montants
        montantTotalAmendes: donnees.amendes.reduce((total, a) => total + a.montant, 0)
    };

    // Envoyer les statistiques au client en format JSON
    res.json(stats);
});

// ============================================================
// ROUTE PAR DÉFAUT — Servir la page d'accueil
// ============================================================

// Pour toute URL qui ne correspond pas à une route API,
// renvoyer la page d'accueil (index.html)
// Cela permet à l'application de fonctionner comme une SPA
// (Single Page Application) côté client
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

// Lancer le serveur et écouter les connexions sur le port défini
// La fonction callback s'exécute quand le serveur est prêt
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Gestion de Bibliothèque - Groupe 4`);
    console.log(`-------------------------------------------`);
});
