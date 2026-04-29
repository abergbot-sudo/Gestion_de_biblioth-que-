// ============================================================
// routes/livres.js — Routes pour la gestion des livres
// Ce fichier contient toutes les routes API liées aux livres :
// lister, ajouter, modifier, supprimer et rechercher des livres.
// ============================================================

// Importer le module 'express' pour créer un routeur
const express = require('express');

// Créer un routeur Express
// Un routeur est un mini-application qui gère un groupe de routes
// Il sera attaché au chemin '/api/livres' dans server.js
const router = express.Router();

// ============================================================
// GET /api/livres — Récupérer tous les livres
// ============================================================
// Cette route retourne la liste complète de tous les livres
// de la bibliothèque au format JSON.
router.get('/', (req, res) => {
    // 'req' = la requête HTTP reçue du client
    // 'res' = l'objet réponse pour envoyer des données au client
    // 'req.app.locals' contient les fonctions partagées depuis server.js

    // Lire toutes les données depuis le fichier JSON
    const donnees = req.app.locals.lireDonnees();

    // Envoyer la liste des livres au client en format JSON
    // Le navigateur recevra un tableau d'objets livre
    res.json(donnees.livres);
});

// ============================================================
// GET /api/livres/recherche — Rechercher des livres
// ============================================================
// Cette route permet de rechercher des livres par titre, auteur,
// ISBN ou genre. Le terme de recherche est passé en paramètre
// de requête (query string), par exemple :
// GET /api/livres/recherche?q=hugo
router.get('/recherche', (req, res) => {
    // Récupérer le terme de recherche depuis les paramètres de l'URL
    // 'req.query.q' correspond au '?q=...' dans l'URL
    // '.toLowerCase()' convertit en minuscules pour une recherche
    // insensible à la casse (majuscules/minuscules)
    const terme = req.query.q ? req.query.q.toLowerCase() : '';

    // Si aucun terme de recherche n'est fourni, retourner une erreur
    if (!terme) {
        // Code 400 = "Bad Request" (requête invalide)
        return res.status(400).json({
            erreur: 'Veuillez fournir un terme de recherche avec ?q=votre_recherche'
        });
    }

    // Lire toutes les données
    const donnees = req.app.locals.lireDonnees();

    // Filtrer les livres qui correspondent au terme de recherche
    // On cherche dans le titre, l'auteur, l'ISBN et le genre
    const resultats = donnees.livres.filter(livre => {
        // Vérifier si le terme apparaît dans l'un des champs du livre
        // '.includes()' retourne true si la chaîne contient le terme
        return livre.titre.toLowerCase().includes(terme) ||
               livre.auteur.toLowerCase().includes(terme) ||
               livre.isbn.toLowerCase().includes(terme) ||
               livre.genre.toLowerCase().includes(terme);
    });

    // Envoyer les résultats de la recherche au client
    res.json(resultats);
});

// ============================================================
// GET /api/livres/:id — Récupérer un livre par son ID
// ============================================================
// ':id' est un paramètre dynamique dans l'URL.
// Par exemple, GET /api/livres/3 retournera le livre avec l'id 3.
router.get('/:id', (req, res) => {
    // Récupérer l'ID depuis les paramètres de l'URL
    // 'parseInt' convertit la chaîne de caractères en nombre entier
    const id = parseInt(req.params.id);

    // Lire toutes les données
    const donnees = req.app.locals.lireDonnees();

    // Chercher le livre avec l'ID correspondant
    // '.find()' retourne le premier élément qui correspond à la condition
    // ou 'undefined' si aucun élément ne correspond
    const livre = donnees.livres.find(l => l.id === id);

    // Vérifier si le livre a été trouvé
    if (!livre) {
        // Code 404 = "Not Found" (ressource non trouvée)
        return res.status(404).json({ erreur: 'Livre non trouvé' });
    }

    // Envoyer le livre trouvé au client
    res.json(livre);
});

// ============================================================
// POST /api/livres — Ajouter un nouveau livre
// ============================================================
// Cette route reçoit les données d'un nouveau livre dans le
// corps de la requête (req.body) et l'ajoute à la bibliothèque.
router.post('/', (req, res) => {
    // Extraire les données du corps de la requête
    // 'req.body' contient les données envoyées par le client
    // La déstructuration permet d'extraire chaque champ individuellement
    const { titre, auteur, isbn, annee, genre } = req.body;

    // Vérification que les champs obligatoires sont remplis
    // Si l'un d'eux est vide ou absent, on retourne une erreur
    if (!titre || !auteur || !isbn) {
        return res.status(400).json({
            erreur: 'Les champs titre, auteur et isbn sont obligatoires'
        });
    }

    // Lire les données actuelles
    const donnees = req.app.locals.lireDonnees();

    // Vérifier si un livre avec le même ISBN existe déjà
    // L'ISBN est un identifiant unique pour chaque livre
    const isbnExiste = donnees.livres.find(l => l.isbn === isbn);
    if (isbnExiste) {
        // Code 409 = "Conflict" (conflit avec une ressource existante)
        return res.status(409).json({
            erreur: 'Un livre avec cet ISBN existe déjà'
        });
    }

    // Générer un nouvel ID unique pour le livre
    // On prend l'ID le plus grand existant et on ajoute 1
    // Si la liste est vide, on commence à 1
    // 'Math.max()' retourne la plus grande valeur parmi ses arguments
    // '...donnees.livres.map(l => l.id)' crée un tableau de tous les IDs
    // et les passe comme arguments séparés à Math.max grâce à '...' (spread)
    const nouvelId = donnees.livres.length > 0
        ? Math.max(...donnees.livres.map(l => l.id)) + 1
        : 1;

    // Créer l'objet du nouveau livre
    const nouveauLivre = {
        id: nouvelId,                  // ID généré automatiquement
        titre: titre,                  // Titre du livre
        auteur: auteur,                // Auteur du livre
        isbn: isbn,                    // ISBN du livre
        annee: annee || null,          // Année (optionnelle, null si non fournie)
        genre: genre || 'Non classé',  // Genre (par défaut 'Non classé')
        disponible: true               // Un nouveau livre est toujours disponible
    };

    // Ajouter le nouveau livre au tableau des livres
    // '.push()' ajoute un élément à la fin du tableau
    donnees.livres.push(nouveauLivre);

    // Sauvegarder les données mises à jour dans le fichier JSON
    req.app.locals.sauvegarderDonnees(donnees);

    // Envoyer le livre créé au client avec le code 201
    // Code 201 = "Created" (ressource créée avec succès)
    res.status(201).json(nouveauLivre);
});

// ============================================================
// PUT /api/livres/:id — Modifier un livre existant
// ============================================================
// Cette route met à jour les informations d'un livre identifié
// par son ID. Seuls les champs fournis sont modifiés.
router.put('/:id', (req, res) => {
    // Récupérer l'ID du livre à modifier depuis l'URL
    const id = parseInt(req.params.id);

    // Extraire les nouvelles données du corps de la requête
    const { titre, auteur, isbn, annee, genre } = req.body;

    // Lire les données actuelles
    const donnees = req.app.locals.lireDonnees();

    // Trouver l'index (position) du livre dans le tableau
    // '.findIndex()' retourne la position (0, 1, 2...) ou -1 si non trouvé
    const index = donnees.livres.findIndex(l => l.id === id);

    // Vérifier si le livre existe
    if (index === -1) {
        return res.status(404).json({ erreur: 'Livre non trouvé' });
    }

    // Mettre à jour les champs du livre
    // L'opérateur '||' garde l'ancienne valeur si la nouvelle est vide/null
    // Cela permet de ne modifier que les champs fournis par le client
    donnees.livres[index].titre = titre || donnees.livres[index].titre;
    donnees.livres[index].auteur = auteur || donnees.livres[index].auteur;
    donnees.livres[index].isbn = isbn || donnees.livres[index].isbn;
    donnees.livres[index].annee = annee || donnees.livres[index].annee;
    donnees.livres[index].genre = genre || donnees.livres[index].genre;

    // Sauvegarder les modifications
    req.app.locals.sauvegarderDonnees(donnees);

    // Retourner le livre modifié
    res.json(donnees.livres[index]);
});

// ============================================================
// DELETE /api/livres/:id — Supprimer un livre
// ============================================================
// Cette route supprime un livre de la bibliothèque.
// Un livre emprunté ne peut pas être supprimé.
router.delete('/:id', (req, res) => {
    // Récupérer l'ID du livre à supprimer
    const id = parseInt(req.params.id);

    // Lire les données actuelles
    const donnees = req.app.locals.lireDonnees();

    // Trouver le livre à supprimer
    const index = donnees.livres.findIndex(l => l.id === id);

    // Vérifier si le livre existe
    if (index === -1) {
        return res.status(404).json({ erreur: 'Livre non trouvé' });
    }

    // Vérifier si le livre est actuellement emprunté
    // On ne peut pas supprimer un livre qui n'a pas été rendu
    if (!donnees.livres[index].disponible) {
        return res.status(400).json({
            erreur: 'Impossible de supprimer un livre actuellement emprunté'
        });
    }

    // Supprimer le livre du tableau
    // '.splice(index, 1)' retire 1 élément à la position 'index'
    donnees.livres.splice(index, 1);

    // Sauvegarder les données mises à jour
    req.app.locals.sauvegarderDonnees(donnees);

    // Retourner un message de confirmation
    res.json({ message: 'Livre supprimé avec succès' });
});

// ============================================================
// Exporter le routeur pour qu'il soit utilisable dans server.js
// ============================================================
module.exports = router;
