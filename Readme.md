## ABC Corporation - Gestion des Commandes et Paiements

Ce projet est une application Node.js en mode console qui permet de gérer les commandes et les paiements pour ABC Corporation. L'application inclut des fonctionnalités CRUD (Create, Read, Update, Delete) pour les commandes et les paiements, avec une gestion rigoureuse des exceptions et des erreurs de saisie.

## Fonctionnalités

L'application permet la gestion des opérations suivantes :

- CRUD pour les clients : Créer, lire, mettre à jour et supprimer des clients.
- CRUD pour les produits : Créer, lire, mettre à jour et supprimer des produits.
- CRUD pour les commandes : Créer, lire, mettre à jour et supprimer des commandes.
- CRUD pour les paiements : Créer, lire, mettre à jour et supprimer des paiements associés aux commandes.

Elle inclut également :

- Validation des saisies : Gestion des erreurs de saisie des montants, dates et autres informations.
- Gestion des exceptions : Gestion des erreurs liées à la base de données, connexions, et saisies incorrectes.

## Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé :

- [Node.js] (version 14+ recommandée)
- [MySQL] ou un autre SGBDR compatible
- [npm] (pour gérer les dépendances)

## Installation

1. Clonez le repository du projet sur votre machine locale :

   ```bash
   git clone https://github.com/FatimataAliouSall/Gestion-Commandes-Paiements.git
   cd Gestion-Commandes-Paiements

   ```

2. Installez les dépendances :

   ```bash
   npm install

   ```

## Configuration de la Base de Données

1. Localisez le fichier db.jsà la racine du projet (ou créez-le si nécessaire). Ce fichier est utilisé pour configurer la connexion à la base de données MySQL. :

2. Modifiez ce fichier pour inclure vos informations d'identification pour MySQL. Voici un exemple de configuration :

   ```bash

      host: 'localhost',
      user: 'yourusername',
      password: 'yourpassword',
      database: 'abc_corporation',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000

   ```

Instructions d'adaptation :

- Remplacez 'yourusername'par votre nom d'utilisateur MySQL
- Remplacez 'yourpassword'par votre mot de passe MySQL.
- Modifiez 'abc_corporation'si vous utilisez une base de données avec un nom différent.

## Auteur

[Fatimata Aliou Sall](https://github.com/FatimataAliouSall/)
