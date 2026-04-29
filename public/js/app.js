// ============================================================
// app.js — Fichier JavaScript principal du frontend
// Gestion de Bibliothèque - Groupe 4
// Ce fichier contient toute la logique côté client :
// navigation entre les pages, appels API, affichage des données,
// gestion des formulaires et interactions utilisateur.
// ============================================================

// ============================================================
// VARIABLES GLOBALES
// ============================================================

// Référence vers la zone de contenu principal
// C'est ici que le contenu de chaque page sera injecté
const contentArea = document.getElementById('contentArea');

// Référence vers le titre de la page dans la barre supérieure
const pageTitle = document.getElementById('pageTitle');

// Référence vers les éléments de la modal (popup)
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// Référence vers les éléments du toast (notification)
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Variable pour stocker la page actuellement affichée
let currentPage = 'dashboard';

// ============================================================
// INITIALISATION DE L'APPLICATION
// ============================================================

// Quand le DOM est complètement chargé, initialiser l'application
// 'DOMContentLoaded' se déclenche quand le HTML est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Afficher la date du jour dans la barre supérieure
    afficherDateDuJour();

    // Configurer les événements de navigation (clics sur le menu)
    configurerNavigation();

    // Configurer le bouton hamburger pour le menu mobile
    configurerMenuMobile();

    // Configurer la fermeture de la modal
    configurerModal();

    // Charger la page du tableau de bord par défaut
    chargerPage('dashboard');
});

// ============================================================
// FONCTIONS D'INITIALISATION
// ============================================================

/**
 * Affiche la date du jour dans la barre supérieure
 * Format : "Mercredi 15 Mars 2024"
 */
function afficherDateDuJour() {
    // Créer un objet Date pour aujourd'hui
    const aujourdhui = new Date();

    // Options de formatage pour afficher la date en français
    const options = {
        weekday: 'long',   // Nom du jour en entier (ex: "Mercredi")
        year: 'numeric',   // Année en chiffres (ex: "2024")
        month: 'long',     // Nom du mois en entier (ex: "Mars")
        day: 'numeric'     // Jour du mois (ex: "15")
    };

    // Formater la date en français ('fr-FR')
    // 'toLocaleDateString' convertit la date en texte lisible
    const dateFormatee = aujourdhui.toLocaleDateString('fr-FR', options);

    // Injecter la date formatée dans l'élément HTML
    document.getElementById('currentDate').textContent = dateFormatee;
}

/**
 * Configure les événements de clic sur les éléments du menu de navigation
 * Quand on clique sur un élément, on charge la page correspondante
 */
function configurerNavigation() {
    // Sélectionner tous les éléments de navigation
    // 'querySelectorAll' retourne une liste de tous les éléments '.nav-item'
    const navItems = document.querySelectorAll('.nav-item');

    // Ajouter un écouteur de clic sur chaque élément
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Retirer la classe 'active' de tous les éléments
            navItems.forEach(i => i.classList.remove('active'));

            // Ajouter la classe 'active' à l'élément cliqué
            item.classList.add('active');

            // Récupérer le nom de la page depuis l'attribut 'data-page'
            const page = item.dataset.page;

            // Charger la page correspondante
            chargerPage(page);

            // Sur mobile, fermer la sidebar après la navigation
            document.getElementById('sidebar').classList.remove('active');
        });
    });
}

/**
 * Configure le bouton hamburger pour ouvrir/fermer la sidebar sur mobile
 */
function configurerMenuMobile() {
    // Récupérer le bouton hamburger
    const menuToggle = document.getElementById('menuToggle');

    // Récupérer la sidebar
    const sidebar = document.getElementById('sidebar');

    // Au clic sur le bouton, basculer la classe 'active' de la sidebar
    // 'toggle' ajoute la classe si elle n'existe pas, la retire si elle existe
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

/**
 * Configure les événements de la fenêtre modale (popup)
 */
function configurerModal() {
    // Fermer la modal au clic sur le bouton de fermeture (croix)
    modalClose.addEventListener('click', fermerModal);

    // Fermer la modal au clic sur le fond sombre (overlay)
    modalOverlay.addEventListener('click', (e) => {
        // Vérifier que le clic est sur l'overlay et non sur la modal elle-même
        if (e.target === modalOverlay) {
            fermerModal();
        }
    });

    // Fermer la modal avec la touche Échap (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fermerModal();
        }
    });
}

// ============================================================
// FONCTIONS DE NAVIGATION
// ============================================================

/**
 * Charge une page dans la zone de contenu principal
 * @param {string} page - Le nom de la page à charger
 * ('dashboard', 'livres', 'emprunts', 'retours', 'amendes')
 */
function chargerPage(page) {
    // Sauvegarder la page actuelle
    currentPage = page;

    // Tableau de correspondance entre les noms de pages et leurs titres
    const titres = {
        'dashboard': 'Tableau de bord',
        'livres': 'Gestion des Livres',
        'emprunts': 'Gestion des Emprunts',
        'retours': 'Retour de Livres',
        'amendes': 'Amendes Simulées'
    };

    // Mettre à jour le titre dans la barre supérieure
    pageTitle.textContent = titres[page] || 'Page';

    // Charger le contenu de la page selon le nom
    // Chaque page a sa propre fonction de chargement
    switch (page) {
        case 'dashboard':
            chargerDashboard();  // Tableau de bord avec statistiques
            break;
        case 'livres':
            chargerLivres();     // Page de gestion des livres
            break;
        case 'emprunts':
            chargerEmprunts();   // Page de gestion des emprunts
            break;
        case 'retours':
            chargerRetours();    // Page de gestion des retours
            break;
        case 'amendes':
            chargerAmendes();    // Page des amendes simulées
            break;
    }
}

// ============================================================
// PAGE : TABLEAU DE BORD (DASHBOARD)
// ============================================================

/**
 * Charge et affiche le tableau de bord avec les statistiques
 * et l'activité récente de la bibliothèque
 */
async function chargerDashboard() {
    try {
        // 'fetch' envoie une requête HTTP GET au serveur
        // 'await' attend la réponse avant de continuer
        // '/api/stats' est la route qui retourne les statistiques
        const reponse = await fetch('/api/stats');

        // Convertir la réponse JSON en objet JavaScript
        const stats = await reponse.json();

        // Récupérer aussi les emprunts en cours pour l'activité récente
        const reponseEmprunts = await fetch('/api/emprunts/en-cours');
        const empruntsEnCours = await reponseEmprunts.json();

        // Construire le HTML du tableau de bord
        // Les backticks (`) permettent d'écrire du HTML sur plusieurs lignes
        // '${...}' insère des valeurs JavaScript dans le texte (template literals)
        contentArea.innerHTML = `
            <!-- Grille de 4 cartes de statistiques -->
            <div class="stats-grid">

                <!-- Carte 1 : Total des livres -->
                <div class="stat-card livres">
                    <div class="stat-card-header">
                        <!-- Étiquette de la statistique -->
                        <span>Total Livres</span>
                        <!-- Icône dans un cercle coloré -->
                        <div class="stat-icon">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <!-- Nombre affiché en grand -->
                    <div class="stat-number">${stats.totalLivres}</div>
                    <!-- Sous-texte informatif -->
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        ${stats.livresDisponibles} disponible(s)
                    </p>
                </div>

                <!-- Carte 2 : Emprunts en cours -->
                <div class="stat-card emprunts">
                    <div class="stat-card-header">
                        <span>Emprunts en cours</span>
                        <div class="stat-icon">
                            <i class="fas fa-hand-holding"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.empruntsEnCours}</div>
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        ${stats.totalEmprunts} au total
                    </p>
                </div>

                <!-- Carte 3 : Livres empruntés -->
                <div class="stat-card retards">
                    <div class="stat-card-header">
                        <span>Livres empruntés</span>
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.livresEmpruntes}</div>
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        en circulation
                    </p>
                </div>

                <!-- Carte 4 : Amendes -->
                <div class="stat-card amendes">
                    <div class="stat-card-header">
                        <span>Amendes</span>
                        <div class="stat-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.montantTotalAmendes.toFixed(2)}€</div>
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        ${stats.totalAmendes} amende(s) au total
                    </p>
                </div>
            </div>

            <!-- Section activité récente : emprunts en cours -->
            <div class="recent-section">
                <h3><i class="fas fa-history" style="margin-right: 8px; color: var(--primary);"></i>Emprunts en cours</h3>
                ${empruntsEnCours.length > 0 ? `
                    <!-- Tableau des emprunts en cours -->
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Livre</th>
                                    <th>Emprunteur</th>
                                    <th>Date d'emprunt</th>
                                    <th>Retour prévu</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${empruntsEnCours.map(e => {
                                    // Vérifier si l'emprunt est en retard
                                    const maintenant = new Date();
                                    const dateRetour = new Date(e.dateRetourPrevue);
                                    const enRetard = maintenant > dateRetour;

                                    return `
                                        <tr>
                                            <td><strong>${e.titreLivre}</strong></td>
                                            <td>${e.emprunteur}</td>
                                            <td>${formaterDate(e.dateEmprunt)}</td>
                                            <td>${formaterDate(e.dateRetourPrevue)}</td>
                                            <td>
                                                ${enRetard
                                                    ? '<span class="badge badge-danger">En retard</span>'
                                                    : '<span class="badge badge-info">En cours</span>'
                                                }
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <!-- Message si aucun emprunt en cours -->
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <p>Aucun emprunt en cours</p>
                    </div>
                `}
            </div>
        `;

    } catch (erreur) {
        // En cas d'erreur (serveur inaccessible, etc.)
        console.error('Erreur lors du chargement du dashboard:', erreur);
        contentArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des données</p>
            </div>
        `;
    }
}

// ============================================================
// PAGE : GESTION DES LIVRES
// ============================================================

/**
 * Charge et affiche la page de gestion des livres
 * avec la barre de recherche, le bouton d'ajout et la liste des livres
 */
async function chargerLivres() {
    try {
        // Récupérer la liste de tous les livres depuis le serveur
        const reponse = await fetch('/api/livres');
        const livres = await reponse.json();

        // Construire le HTML de la page des livres
        contentArea.innerHTML = `
            <!-- Barre d'outils : recherche + bouton ajouter -->
            <div class="toolbar">
                <!-- Champ de recherche -->
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <!-- L'événement 'oninput' se déclenche à chaque caractère tapé -->
                    <input type="text" placeholder="Rechercher un livre..." id="searchInput" oninput="rechercherLivres()">
                </div>
                <!-- Bouton pour ajouter un nouveau livre -->
                <!-- 'onclick' appelle la fonction quand on clique -->
                <button class="btn btn-primary" onclick="ouvrirModalAjoutLivre()">
                    <i class="fas fa-plus"></i>
                    Ajouter un livre
                </button>
            </div>

            <!-- Conteneur pour la liste des livres -->
            <div id="livresContainer">
                ${genererTableauLivres(livres)}
            </div>
        `;

    } catch (erreur) {
        console.error('Erreur lors du chargement des livres:', erreur);
        contentArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des livres</p>
            </div>
        `;
    }
}

/**
 * Génère le HTML du tableau des livres
 * @param {Array} livres - Tableau d'objets livre
 * @returns {string} - Le HTML du tableau
 */
function genererTableauLivres(livres) {
    // Si aucun livre, afficher un message
    if (livres.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>Aucun livre trouvé</p>
            </div>
        `;
    }

    // Construire le tableau HTML avec les données des livres
    return `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>ISBN</th>
                        <th>Année</th>
                        <th>Genre</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Pour chaque livre, créer une ligne du tableau -->
                    ${livres.map(livre => `
                        <tr>
                            <td><strong>${livre.titre}</strong></td>
                            <td>${livre.auteur}</td>
                            <td><code>${livre.isbn}</code></td>
                            <td>${livre.annee || '-'}</td>
                            <td>${livre.genre}</td>
                            <td>
                                <!-- Badge coloré selon la disponibilité -->
                                ${livre.disponible
                                    ? '<span class="badge badge-success">Disponible</span>'
                                    : '<span class="badge badge-warning">Emprunté</span>'
                                }
                            </td>
                            <td>
                                <!-- Boutons d'action : Modifier et Supprimer -->
                                <div class="action-group">
                                    <!-- Bouton modifier : ouvre la modal d'édition -->
                                    <button class="btn btn-primary btn-sm" onclick="ouvrirModalModifierLivre(${livre.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <!-- Bouton supprimer : demande confirmation -->
                                    <button class="btn btn-danger btn-sm" onclick="supprimerLivre(${livre.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Recherche des livres en temps réel (à chaque caractère tapé)
 * Filtre les livres affichés selon le terme de recherche
 */
async function rechercherLivres() {
    // Récupérer le texte tapé dans le champ de recherche
    const terme = document.getElementById('searchInput').value;

    // Si le champ est vide, recharger tous les livres
    if (!terme.trim()) {
        const reponse = await fetch('/api/livres');
        const livres = await reponse.json();
        document.getElementById('livresContainer').innerHTML = genererTableauLivres(livres);
        return;
    }

    try {
        // Envoyer la requête de recherche au serveur
        // 'encodeURIComponent' encode les caractères spéciaux pour l'URL
        const reponse = await fetch(`/api/livres/recherche?q=${encodeURIComponent(terme)}`);
        const resultats = await reponse.json();

        // Mettre à jour l'affichage avec les résultats
        document.getElementById('livresContainer').innerHTML = genererTableauLivres(resultats);

    } catch (erreur) {
        console.error('Erreur lors de la recherche:', erreur);
    }
}

/**
 * Ouvre la modal pour ajouter un nouveau livre
 * Affiche un formulaire vide dans la fenêtre popup
 */
function ouvrirModalAjoutLivre() {
    // Définir le titre de la modal
    modalTitle.textContent = 'Ajouter un nouveau livre';

    // Injecter le formulaire d'ajout dans la modal
    modalBody.innerHTML = `
        <form id="formLivre" onsubmit="ajouterLivre(event)">
            <!-- Champ Titre (obligatoire) -->
            <div class="form-group">
                <label for="titre">Titre *</label>
                <input type="text" id="titre" placeholder="Ex: Le Petit Prince" required>
            </div>
            <!-- Champ Auteur (obligatoire) -->
            <div class="form-group">
                <label for="auteur">Auteur *</label>
                <input type="text" id="auteur" placeholder="Ex: Antoine de Saint-Exupéry" required>
            </div>
            <!-- Champ ISBN (obligatoire) -->
            <div class="form-group">
                <label for="isbn">ISBN *</label>
                <input type="text" id="isbn" placeholder="Ex: 978-2-07-040850-4" required>
            </div>
            <!-- Champ Année de publication (optionnel) -->
            <div class="form-group">
                <label for="annee">Année de publication</label>
                <input type="number" id="annee" placeholder="Ex: 2024" min="1000" max="2100">
            </div>
            <!-- Champ Genre (optionnel) -->
            <div class="form-group">
                <label for="genre">Genre</label>
                <select id="genre">
                    <option value="">-- Choisir un genre --</option>
                    <option value="Roman">Roman</option>
                    <option value="Conte">Conte</option>
                    <option value="Poésie">Poésie</option>
                    <option value="Théâtre">Théâtre</option>
                    <option value="Science-fiction">Science-fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Policier">Policier</option>
                    <option value="Biographie">Biographie</option>
                    <option value="Histoire">Histoire</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Philosophie">Philosophie</option>
                    <option value="Roman d'aventure">Roman d'aventure</option>
                    <option value="Autre">Autre</option>
                </select>
            </div>
            <!-- Bouton de soumission -->
            <button type="submit" class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-plus"></i>
                Ajouter le livre
            </button>
        </form>
    `;

    // Afficher la modal en ajoutant la classe 'active'
    ouvrirModal();
}

/**
 * Envoie les données du formulaire pour ajouter un nouveau livre
 * @param {Event} event - L'événement de soumission du formulaire
 */
async function ajouterLivre(event) {
    // Empêcher le rechargement de la page (comportement par défaut du formulaire)
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const livre = {
        titre: document.getElementById('titre').value,      // Titre saisi
        auteur: document.getElementById('auteur').value,    // Auteur saisi
        isbn: document.getElementById('isbn').value,        // ISBN saisi
        annee: document.getElementById('annee').value       // Année saisie
            ? parseInt(document.getElementById('annee').value) // Convertir en nombre
            : null,                                          // null si vide
        genre: document.getElementById('genre').value || 'Non classé' // Genre ou défaut
    };

    try {
        // Envoyer les données au serveur via une requête POST
        const reponse = await fetch('/api/livres', {
            method: 'POST',                        // Méthode HTTP POST (création)
            headers: {
                'Content-Type': 'application/json' // Indiquer que le corps est en JSON
            },
            body: JSON.stringify(livre)             // Convertir l'objet en texte JSON
        });

        // Vérifier si la requête a réussi
        if (reponse.ok) {
            // Fermer la modal
            fermerModal();
            // Afficher une notification de succès
            afficherToast('Livre ajouté avec succès !', 'success');
            // Recharger la liste des livres pour afficher le nouveau
            chargerLivres();
        } else {
            // La requête a échoué, lire le message d'erreur
            const erreur = await reponse.json();
            afficherToast(erreur.erreur || 'Erreur lors de l\'ajout', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

/**
 * Ouvre la modal pour modifier un livre existant
 * @param {number} id - L'identifiant du livre à modifier
 */
async function ouvrirModalModifierLivre(id) {
    try {
        // Récupérer les données actuelles du livre depuis le serveur
        const reponse = await fetch(`/api/livres/${id}`);
        const livre = await reponse.json();

        // Définir le titre de la modal
        modalTitle.textContent = 'Modifier le livre';

        // Injecter le formulaire pré-rempli avec les données du livre
        modalBody.innerHTML = `
            <form id="formLivre" onsubmit="modifierLivre(event, ${id})">
                <div class="form-group">
                    <label for="titre">Titre *</label>
                    <!-- 'value="${livre.titre}"' pré-remplit le champ -->
                    <input type="text" id="titre" value="${livre.titre}" required>
                </div>
                <div class="form-group">
                    <label for="auteur">Auteur *</label>
                    <input type="text" id="auteur" value="${livre.auteur}" required>
                </div>
                <div class="form-group">
                    <label for="isbn">ISBN *</label>
                    <input type="text" id="isbn" value="${livre.isbn}" required>
                </div>
                <div class="form-group">
                    <label for="annee">Année de publication</label>
                    <input type="number" id="annee" value="${livre.annee || ''}" min="1000" max="2100">
                </div>
                <div class="form-group">
                    <label for="genre">Genre</label>
                    <select id="genre">
                        <option value="">-- Choisir un genre --</option>
                        <!-- Chaque option vérifie si elle correspond au genre actuel -->
                        ${['Roman','Conte','Poésie','Théâtre','Science-fiction','Fantasy','Policier','Biographie','Histoire','Sciences','Philosophie','Roman d\'aventure','Autre'].map(g =>
                            `<option value="${g}" ${livre.genre === g ? 'selected' : ''}>${g}</option>`
                        ).join('')}
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-save"></i>
                    Enregistrer les modifications
                </button>
            </form>
        `;

        // Afficher la modal
        ouvrirModal();

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur lors du chargement du livre', 'error');
    }
}

/**
 * Envoie les données modifiées d'un livre au serveur
 * @param {Event} event - L'événement de soumission
 * @param {number} id - L'identifiant du livre à modifier
 */
async function modifierLivre(event, id) {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer les nouvelles valeurs
    const livre = {
        titre: document.getElementById('titre').value,
        auteur: document.getElementById('auteur').value,
        isbn: document.getElementById('isbn').value,
        annee: document.getElementById('annee').value
            ? parseInt(document.getElementById('annee').value)
            : null,
        genre: document.getElementById('genre').value
    };

    try {
        // Envoyer la requête PUT (modification) au serveur
        const reponse = await fetch(`/api/livres/${id}`, {
            method: 'PUT',                         // Méthode HTTP PUT (modification)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livre)
        });

        if (reponse.ok) {
            fermerModal();
            afficherToast('Livre modifié avec succès !', 'success');
            chargerLivres(); // Recharger la liste
        } else {
            const erreur = await reponse.json();
            afficherToast(erreur.erreur || 'Erreur lors de la modification', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

/**
 * Supprime un livre après confirmation de l'utilisateur
 * @param {number} id - L'identifiant du livre à supprimer
 */
async function supprimerLivre(id) {
    // Demander confirmation à l'utilisateur
    // 'confirm' affiche une boîte de dialogue avec OK/Annuler
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        return; // L'utilisateur a annulé, ne rien faire
    }

    try {
        // Envoyer la requête DELETE au serveur
        const reponse = await fetch(`/api/livres/${id}`, {
            method: 'DELETE'   // Méthode HTTP DELETE (suppression)
        });

        if (reponse.ok) {
            afficherToast('Livre supprimé avec succès !', 'success');
            chargerLivres(); // Recharger la liste
        } else {
            const erreur = await reponse.json();
            afficherToast(erreur.erreur || 'Erreur lors de la suppression', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

// ============================================================
// PAGE : GESTION DES EMPRUNTS
// ============================================================

/**
 * Charge et affiche la page de gestion des emprunts
 */
async function chargerEmprunts() {
    try {
        // Récupérer tous les emprunts et tous les livres disponibles
        // 'Promise.all' permet de faire les 2 requêtes en parallèle
        const [reponseEmprunts, reponseLivres] = await Promise.all([
            fetch('/api/emprunts'),
            fetch('/api/livres')
        ]);

        // Convertir les réponses en objets JavaScript
        const emprunts = await reponseEmprunts.json();
        const livres = await reponseLivres.json();

        // Filtrer pour ne garder que les livres disponibles (pour le formulaire)
        const livresDisponibles = livres.filter(l => l.disponible);

        // Construire le HTML de la page des emprunts
        contentArea.innerHTML = `
            <div class="toolbar">
                <!-- Bouton pour créer un nouvel emprunt -->
                <div></div>
                <button class="btn btn-primary" onclick="ouvrirModalNouvelEmprunt()">
                    <i class="fas fa-plus"></i>
                    Nouvel emprunt
                </button>
            </div>

            <!-- Onglets pour filtrer : Tous / En cours -->
            <div class="tabs">
                <button class="tab active" onclick="filtrerEmprunts('tous', this)">Tous</button>
                <button class="tab" onclick="filtrerEmprunts('en-cours', this)">En cours</button>
                <button class="tab" onclick="filtrerEmprunts('termines', this)">Terminés</button>
            </div>

            <!-- Conteneur pour le tableau des emprunts -->
            <div id="empruntsContainer">
                ${genererTableauEmprunts(emprunts)}
            </div>
        `;

    } catch (erreur) {
        console.error('Erreur lors du chargement des emprunts:', erreur);
        contentArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des emprunts</p>
            </div>
        `;
    }
}

/**
 * Génère le HTML du tableau des emprunts
 * @param {Array} emprunts - Tableau d'objets emprunt
 * @returns {string} - Le HTML du tableau
 */
function genererTableauEmprunts(emprunts) {
    if (emprunts.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-hand-holding"></i>
                <p>Aucun emprunt enregistré</p>
            </div>
        `;
    }

    return `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Livre</th>
                        <th>Emprunteur</th>
                        <th>Date d'emprunt</th>
                        <th>Retour prévu</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${emprunts.map(e => {
                        // Déterminer le statut de l'emprunt
                        let statutBadge;
                        if (e.dateRetourEffective) {
                            // Le livre a été rendu
                            statutBadge = '<span class="badge badge-success">Retourné</span>';
                        } else {
                            // Le livre n'a pas été rendu
                            const maintenant = new Date();
                            const dateRetour = new Date(e.dateRetourPrevue);
                            if (maintenant > dateRetour) {
                                // La date de retour est passée = en retard
                                statutBadge = '<span class="badge badge-danger">En retard</span>';
                            } else {
                                // La date de retour n'est pas encore passée
                                statutBadge = '<span class="badge badge-info">En cours</span>';
                            }
                        }

                        return `
                            <tr>
                                <td>#${e.id}</td>
                                <td><strong>${e.titreLivre}</strong></td>
                                <td>${e.emprunteur}</td>
                                <td>${formaterDate(e.dateEmprunt)}</td>
                                <td>${formaterDate(e.dateRetourPrevue)}</td>
                                <td>${statutBadge}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Filtre les emprunts affichés selon l'onglet sélectionné
 * @param {string} filtre - Le type de filtre ('tous', 'en-cours', 'termines')
 * @param {HTMLElement} bouton - Le bouton d'onglet cliqué
 */
async function filtrerEmprunts(filtre, bouton) {
    // Mettre à jour le style des onglets (actif/inactif)
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    bouton.classList.add('active');

    try {
        let emprunts;

        if (filtre === 'en-cours') {
            // Récupérer uniquement les emprunts en cours
            const reponse = await fetch('/api/emprunts/en-cours');
            emprunts = await reponse.json();
        } else if (filtre === 'termines') {
            // Récupérer tous les emprunts puis filtrer les terminés
            const reponse = await fetch('/api/emprunts');
            const tous = await reponse.json();
            emprunts = tous.filter(e => e.dateRetourEffective);
        } else {
            // Récupérer tous les emprunts
            const reponse = await fetch('/api/emprunts');
            emprunts = await reponse.json();
        }

        // Mettre à jour l'affichage
        document.getElementById('empruntsContainer').innerHTML = genererTableauEmprunts(emprunts);

    } catch (erreur) {
        console.error('Erreur lors du filtrage:', erreur);
    }
}

/**
 * Ouvre la modal pour créer un nouvel emprunt
 * Affiche un formulaire avec la liste des livres disponibles
 */
async function ouvrirModalNouvelEmprunt() {
    try {
        // Récupérer la liste des livres disponibles
        const reponse = await fetch('/api/livres');
        const livres = await reponse.json();
        const disponibles = livres.filter(l => l.disponible);

        // Vérifier qu'il y a des livres disponibles
        if (disponibles.length === 0) {
            afficherToast('Aucun livre disponible pour l\'emprunt', 'error');
            return;
        }

        modalTitle.textContent = 'Nouvel emprunt';

        modalBody.innerHTML = `
            <form id="formEmprunt" onsubmit="creerEmprunt(event)">
                <!-- Sélection du livre à emprunter -->
                <div class="form-group">
                    <label for="livreId">Livre à emprunter *</label>
                    <select id="livreId" required>
                        <option value="">-- Choisir un livre --</option>
                        <!-- Liste des livres disponibles dans le menu déroulant -->
                        ${disponibles.map(l =>
                            `<option value="${l.id}">${l.titre} - ${l.auteur}</option>`
                        ).join('')}
                    </select>
                </div>
                <!-- Nom de l'emprunteur -->
                <div class="form-group">
                    <label for="emprunteur">Nom de l'emprunteur *</label>
                    <input type="text" id="emprunteur" placeholder="Ex: Jean Dupont" required>
                </div>
                <!-- Durée de l'emprunt en jours -->
                <div class="form-group">
                    <label for="dureeJours">Durée de l'emprunt (jours)</label>
                    <!-- value="14" = 2 semaines par défaut -->
                    <input type="number" id="dureeJours" value="14" min="1" max="90">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-hand-holding"></i>
                    Enregistrer l'emprunt
                </button>
            </form>
        `;

        ouvrirModal();

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur lors du chargement des livres', 'error');
    }
}

/**
 * Envoie les données du formulaire pour créer un nouvel emprunt
 * @param {Event} event - L'événement de soumission
 */
async function creerEmprunt(event) {
    event.preventDefault();

    const emprunt = {
        // Convertir l'ID du livre en nombre entier
        livreId: parseInt(document.getElementById('livreId').value),
        emprunteur: document.getElementById('emprunteur').value,
        dureeJours: parseInt(document.getElementById('dureeJours').value) || 14
    };

    try {
        const reponse = await fetch('/api/emprunts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emprunt)
        });

        if (reponse.ok) {
            fermerModal();
            afficherToast('Emprunt enregistré avec succès !', 'success');
            chargerEmprunts();
        } else {
            const erreur = await reponse.json();
            afficherToast(erreur.erreur || 'Erreur lors de l\'emprunt', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

// ============================================================
// PAGE : GESTION DES RETOURS
// ============================================================

/**
 * Charge et affiche la page de gestion des retours
 * Affiche les emprunts en cours avec un bouton pour enregistrer le retour
 */
async function chargerRetours() {
    try {
        // Récupérer les emprunts en cours (livres non encore rendus)
        const reponse = await fetch('/api/emprunts/en-cours');
        const empruntsEnCours = await reponse.json();

        contentArea.innerHTML = `
            <div style="margin-bottom: 24px;">
                <p style="color: var(--gray-600); font-size: 15px;">
                    <i class="fas fa-info-circle" style="margin-right: 8px; color: var(--info);"></i>
                    Sélectionnez un emprunt pour enregistrer le retour du livre.
                    Si le retour est en retard, une amende sera automatiquement générée.
                </p>
            </div>

            ${empruntsEnCours.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Livre</th>
                                <th>Emprunteur</th>
                                <th>Emprunté le</th>
                                <th>Retour prévu</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${empruntsEnCours.map(e => {
                                // Vérifier si l'emprunt est en retard
                                const maintenant = new Date();
                                const dateRetour = new Date(e.dateRetourPrevue);
                                const enRetard = maintenant > dateRetour;

                                return `
                                    <tr>
                                        <td>#${e.id}</td>
                                        <td><strong>${e.titreLivre}</strong></td>
                                        <td>${e.emprunteur}</td>
                                        <td>${formaterDate(e.dateEmprunt)}</td>
                                        <td>${formaterDate(e.dateRetourPrevue)}</td>
                                        <td>
                                            ${enRetard
                                                ? '<span class="badge badge-danger">En retard</span>'
                                                : '<span class="badge badge-info">En cours</span>'
                                            }
                                        </td>
                                        <td>
                                            <!-- Bouton pour enregistrer le retour -->
                                            <button class="btn btn-success btn-sm" onclick="enregistrerRetour(${e.id})">
                                                <i class="fas fa-undo-alt"></i>
                                                Retourner
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>Tous les livres ont été retournés !</p>
                </div>
            `}
        `;

    } catch (erreur) {
        console.error('Erreur lors du chargement des retours:', erreur);
    }
}

/**
 * Enregistre le retour d'un livre emprunté
 * @param {number} empruntId - L'identifiant de l'emprunt
 */
async function enregistrerRetour(empruntId) {
    // Demander confirmation
    if (!confirm('Confirmer le retour de ce livre ?')) {
        return;
    }

    try {
        // Envoyer la requête POST pour enregistrer le retour
        const reponse = await fetch(`/api/retours/${empruntId}`, {
            method: 'POST'
        });

        const resultat = await reponse.json();

        if (reponse.ok) {
            // Vérifier si une amende a été générée
            if (resultat.enRetard) {
                // Afficher un message avec le montant de l'amende
                afficherToast(
                    `Livre retourné avec ${resultat.joursRetard} jour(s) de retard. Amende : ${resultat.amende.montant.toFixed(2)}€`,
                    'error'
                );
            } else {
                afficherToast('Livre retourné avec succès !', 'success');
            }
            // Recharger la page des retours
            chargerRetours();
        } else {
            afficherToast(resultat.erreur || 'Erreur lors du retour', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

// ============================================================
// PAGE : AMENDES SIMULÉES
// ============================================================

/**
 * Charge et affiche la page des amendes simulées
 */
async function chargerAmendes() {
    try {
        // Récupérer la liste des amendes et les statistiques
        const [reponseAmendes, reponseStats] = await Promise.all([
            fetch('/api/amendes'),
            fetch('/api/amendes/stats')
        ]);

        const amendes = await reponseAmendes.json();
        const stats = await reponseStats.json();

        contentArea.innerHTML = `
            <!-- Résumé des amendes en haut de la page -->
            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 32px;">
                <!-- Carte : montant total -->
                <div class="stat-card amendes">
                    <div class="stat-card-header">
                        <span>Montant total</span>
                        <div class="stat-icon">
                            <i class="fas fa-euro-sign"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.montantTotal.toFixed(2)}€</div>
                </div>
                <!-- Carte : amendes payées -->
                <div class="stat-card livres">
                    <div class="stat-card-header">
                        <span>Payées</span>
                        <div class="stat-icon">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.montantPaye.toFixed(2)}€</div>
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        ${stats.amendesPayees} amende(s)
                    </p>
                </div>
                <!-- Carte : amendes impayées -->
                <div class="stat-card retards">
                    <div class="stat-card-header">
                        <span>Impayées</span>
                        <div class="stat-icon">
                            <i class="fas fa-exclamation"></i>
                        </div>
                    </div>
                    <div class="stat-number">${stats.montantImpaye.toFixed(2)}€</div>
                    <p style="color: var(--gray-600); font-size: 13px; margin-top: 8px;">
                        ${stats.amendesImpayees} amende(s)
                    </p>
                </div>
            </div>

            <!-- Tableau des amendes -->
            ${amendes.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Livre</th>
                                <th>Emprunteur</th>
                                <th>Jours de retard</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${amendes.map(a => `
                                <tr>
                                    <td>#${a.id}</td>
                                    <td><strong>${a.titreLivre}</strong></td>
                                    <td>${a.emprunteur}</td>
                                    <td>${a.joursRetard} jour(s)</td>
                                    <td><strong>${a.montant.toFixed(2)}€</strong></td>
                                    <td>
                                        ${a.payee
                                            ? '<span class="badge badge-success">Payée</span>'
                                            : '<span class="badge badge-danger">Impayée</span>'
                                        }
                                    </td>
                                    <td>
                                        ${!a.payee ? `
                                            <!-- Bouton pour simuler le paiement -->
                                            <button class="btn btn-warning btn-sm" onclick="payerAmende(${a.id})">
                                                <i class="fas fa-coins"></i>
                                                Payer
                                            </button>
                                        ` : `
                                            <!-- Amende déjà payée -->
                                            <span style="color: var(--gray-400); font-size: 13px;">
                                                Payée le ${formaterDate(a.datePaiement)}
                                            </span>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="empty-state">
                    <i class="fas fa-smile"></i>
                    <p>Aucune amende pour le moment</p>
                </div>
            `}
        `;

    } catch (erreur) {
        console.error('Erreur lors du chargement des amendes:', erreur);
    }
}

/**
 * Simule le paiement d'une amende
 * @param {number} id - L'identifiant de l'amende à payer
 */
async function payerAmende(id) {
    // Demander confirmation
    if (!confirm('Confirmer le paiement de cette amende ? (simulation)')) {
        return;
    }

    try {
        // Envoyer la requête PUT pour marquer l'amende comme payée
        const reponse = await fetch(`/api/amendes/${id}/payer`, {
            method: 'PUT'
        });

        if (reponse.ok) {
            afficherToast('Amende payée avec succès ! (simulation)', 'success');
            chargerAmendes(); // Recharger la page
        } else {
            const erreur = await reponse.json();
            afficherToast(erreur.erreur || 'Erreur lors du paiement', 'error');
        }

    } catch (erreur) {
        console.error('Erreur:', erreur);
        afficherToast('Erreur de connexion au serveur', 'error');
    }
}

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

/**
 * Formate une date ISO en format français lisible
 * @param {string} dateISO - Date au format ISO (ex: "2024-03-15T14:30:00.000Z")
 * @returns {string} - Date formatée (ex: "15/03/2024")
 */
function formaterDate(dateISO) {
    // Vérifier que la date existe
    if (!dateISO) return '-';

    // Créer un objet Date à partir de la chaîne ISO
    const date = new Date(dateISO);

    // Formater la date en format français (jour/mois/année)
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',    // Jour sur 2 chiffres (ex: "15")
        month: '2-digit',  // Mois sur 2 chiffres (ex: "03")
        year: 'numeric'    // Année complète (ex: "2024")
    });
}

/**
 * Ouvre la fenêtre modale (popup)
 * Ajoute la classe 'active' pour déclencher l'animation CSS
 */
function ouvrirModal() {
    modalOverlay.classList.add('active');
}

/**
 * Ferme la fenêtre modale (popup)
 * Retire la classe 'active' pour déclencher l'animation de fermeture
 */
function fermerModal() {
    modalOverlay.classList.remove('active');
}

/**
 * Affiche une notification toast (petite bulle en bas à droite)
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification ('success' ou 'error')
 */
function afficherToast(message, type) {
    // Définir le message
    toastMessage.textContent = message;

    // Retirer les anciennes classes de type
    toast.classList.remove('success', 'error');

    // Ajouter la classe du type (pour la couleur de l'icône)
    toast.classList.add(type);

    // Changer l'icône selon le type
    const icone = toast.querySelector('.toast-icon');
    if (type === 'success') {
        icone.className = 'toast-icon fas fa-check-circle';  // Icône de succès (coche)
    } else {
        icone.className = 'toast-icon fas fa-exclamation-circle'; // Icône d'erreur
    }

    // Afficher le toast en ajoutant la classe 'show'
    toast.classList.add('show');

    // Masquer le toast après 4 secondes (4000 millisecondes)
    // 'setTimeout' exécute une fonction après un délai
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
