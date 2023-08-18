# TP_SQL_RESTAPI

## API de Gestion des Soutenances

Cette API permet de gérer les données relatives aux soutenances universitaires, y compris les informations sur les entreprises, les professeurs, les étudiants, les jurys, les salles et les soutenances.

## Tables de la Base de Données

La base de données utilise les tables suivantes :

- **ENTREPRISE**: Stocke les informations sur les entreprises participant aux soutenances.
- **PROFESSEUR**: Contient les données des professeurs.
- **SALLE**: Représente les salles où se déroulent les soutenances.
- **ETUDIANT**: Stocke les informations des étudiants et leurs données de soutenance.
- **JURY**: Enregistre les détails des jurys participant aux soutenances.
- **SECOMPOSE**: Table de liaison entre les jurys et les professeurs qui les composent.
- **SOUTIENT**: Contient les données sur les soutenances individuelles.

## Endpoints

### Entreprises

- `GET /api/tp_sql/entreprise`: Récupère la liste des entreprises.
- `GET /api/tp_sql/entreprise/:n`: Récupère la liste des professeurs assistants pour une entreprise donnée.
- `POST /api/tp_sql/entreprise`: Ajoute une nouvelle entreprise.
- `DELETE /api/tp_sql/entreprise/:n`: Supprime une entreprise.

### Professeurs

- `POST /api/tp_sql/entreprise/prof`: Ajoute un nouveau professeur.

### Jurys

- `POST /api/tp_sql/entreprise/jury`: Ajoute un nouveau jury.

### Étudiants

- `POST /api/tp_sql/entreprise/etudiant`: Ajoute un nouvel étudiant.

### Soutenances

- `POST /api/tp_sql/entreprise/soutenance`: Ajoute une nouvelle soutenance.

## Utilisation

1. Cloner ce référentiel.
2. Installer les dépendances avec `npm install` & `npm i pg` + `npm i --save express`.
3. Configurer les variables d'environnement si nécessaire.
4. Exécuter l'API avec `node server.js` (ou en configurant votre IDE).

## Exemple de Requête

Pour obtenir la liste des entreprises :




       GET http://localhost:3000/api/tp_sql/
       Accept: application/json

