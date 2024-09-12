##  ABC Corporation - Gestion des Commandes et Paiements

Ce projet est une application Node.js en mode console qui permet de gérer les commandes et les paiements pour ABC Corporation. L'application inclut des fonctionnalités CRUD (Create, Read, Update, Delete) pour les commandes et les paiements, avec une gestion rigoureuse des exceptions et des erreurs de saisie.

##  Fonctionnalités

 - CRUD pour les clients : Créer, lire, mettre à jour et supprimer des clients.
 - CRUD pour les produits : Créer, lire, mettre à jour et supprimer des produits.
 - CRUD pour les commandes : Créer, lire, mettre à jour et supprimer des commandes.
 - CRUD pour les paiements : Créer, lire, mettre à jour et supprimer des paiements associés aux commandes.
 - Validation des saisies : Gestion des erreurs de saisie des montants, dates et autres informations.
 - Gestion des exceptions : Gestion des erreurs liées à la base de données, connexions, et saisies incorrectes.


##  Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé :

 - [Node.js] (version 14+ recommandée)
 - [MySQL] ou un autre SGBDR compatible
 - [npm] (pour gérer les dépendances)

##  Installation
 

 1. Clonez le repository du projet sur votre machine locale :

   ```bash
   git clone https://github.com/FatimataAliouSall/ABC-Corporation.git
   cd ABC-Corporation

   ```

 2. Installez les dépendances :

   ```bash
   npm install

   ``` 
   
  3. Créez un fichier .db.js dans la racine du projet et configurez les informations de base de données :

   ```bash
      -  const mysql = require('mysql2/promise');


          -  const connPool = mysql.createPool({
          - host: 'localhost',             
          -  user: 'root',                  
          -  password: 'root',             
          -  database: 'abc_corporation',   
          -  waitForConnections: true,       
          -  connectionLimit: 10,           
          -  queueLimit: 0 ,
          -  connectTimeout: 10000 
                            
        });


     - connPool.getConnection()
        .then(connection => {
            console.log("CONNECTED to MySQL Database");
            connection.release();  
        })
        .catch(err => {
            console.error("Failed to connect to the database:", err.message);
        });

     module.exports = connPool;


   ```   
##  Utilisation
    
   1. Lancez l'application en exécutant le script principal :

    ```bash
       node index.js
    ``` 

   2. Interagissez avec l'application en utilisant les options proposées  :

      === MENU PRINCIPAL ===
      1. Gérer les clients
      2. Gérer les produits
      3. Gérer les commandes
      4. Gérer les paiements
      5. Quitter

##  Gestion des Erreurs et Exceptions

  - Validation des entrées utilisateur : Assurez-vous que toutes les saisies (montant, date, etc.) sont correctes avant de les enregistrer dans la base de données.
  - Gestion des erreurs SQL et des erreurs de connexion à la base de données.


##  Auteur 

 Fatimata Aliou Sall [https://github.com/FatimataAliouSall/ABC-Corporation.git]  



   

