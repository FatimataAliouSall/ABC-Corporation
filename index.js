const readlineSync = require('readline-sync');
const customersModule = require('./src/customerModule');
const productsModule = require('./src/productModule');
const paymentsModule = require('./src/paymentModule');
const purchaseOrdersModule = require('./src/purchaseOrderModule');

async function customersMenu() {
  let exit = false;
  while (!exit) {
    console.log(`
      === MENU CUSTOMERS ===
      1. Ajouter un customer
      2. Mettre à jour un customer
      3. Supprimer un customer
      4. Lister tous les customers
      5. Retourner au menu principal
    `);

    const choice = readlineSync.question('Choisissez une option: ');

    switch (choice) {
      case '1':
  const name = readlineSync.question('Entrez le nom: ');
  const address = readlineSync.question('Entrez l\'adresse: ');
  const email = readlineSync.question('Entrez l\'email: ');
  const phone = readlineSync.question('Entrez le téléphone: ');
  
  try {
    await customersModule.store(name, address, email, phone);
    console.log('Client ajouté avec succès!');
  } catch (error) {
    console.error('Erreur :', error.message);
  }
  break;


  case '2':
    const idToUpdate = readlineSync.question('Entrez l\'ID du customer à mettre à jour: ');
    const customerExists = await customersModule.exists(idToUpdate);
    if (!customerExists) {
      console.log(`Le client avec l'ID ${idToUpdate} n'existe pas.`);
      break;
    }
    const updatedName = readlineSync.question('Entrez le nouveau name: ');
    const updatedAddress = readlineSync.question('Entrez la nouvelle address: ');
    const updatedEmail = readlineSync.question('Entrez le nouvel email: ');
    const updatedPhone = readlineSync.question('Entrez le nouveau phone: ');
  
    try {
      await customersModule.update(idToUpdate, updatedName, updatedAddress, updatedEmail, updatedPhone);
      console.log('Client mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur :', error.message);
    }
    break;
  

        case '3':
          const idToDelete = readlineSync.question('Entrez l\'ID du client à supprimer: ');
          try {
            await customersModule.destroy(idToDelete);
            console.log('Client supprimé avec succès!');
          } catch (error) {
            console.log(error.message); 
          }
          break;
        

      case '4':
        const customers = await customersModule.getAll();
        console.log('Liste des customers:');
        console.table(customers);
        break;

      case '5':
        exit = true;
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

async function productsMenu() {
  let exit = false;
  while (!exit) {
    console.log(`
      === MENU PRODUITS ===
      1. Ajouter un produit
      2. Mettre à jour un produit
      3. Supprimer un produit
      4. Lister tous les produits
      5. Retourner au menu principal
    `);

    const choice = readlineSync.question('Choisissez une option: ');

    switch (choice) {
      case '1':
  try {
    const productName = readlineSync.question('Entrez le nom du produit: ');
    const productDescription = readlineSync.question('Entrez la description du produit: ');
    const productPrice = readlineSync.questionFloat('Entrez le prix du produit: ');
    const productStock = readlineSync.questionInt('Entrez le stock du produit: ');
    const productCategory = readlineSync.question('Entrez la catégorie du produit: ');
    const productBarcode = readlineSync.question('Entrez le code-barres du produit: ');
    const productStatus = readlineSync.question('Entrez le statut du produit (actif/inactif): ');
    
    await productsModule.store(productName, productDescription, productPrice, productStock, productCategory, productBarcode, productStatus);
    console.log('Produit ajouté avec succès!');
  } catch (error) {
    console.log(error.message);
  }
  break;


      case '2':
        const productIdToUpdate = readlineSync.question('Entrez l\'ID du produit à mettre à jour: ');
        const updatedProductName = readlineSync.question('Entrez le nouveau nom du produit: ');
        const updatedProductDescription = readlineSync.question('Entrez la nouvelle description du produit: ');
        const updatedProductPrice = readlineSync.questionFloat('Entrez le nouveau prix du produit: ');
        const updatedProductStock = readlineSync.questionInt('Entrez le nouveau stock du produit: ');
        const updatedProductCategory = readlineSync.question('Entrez la nouvelle catégorie du produit: ');
        const updatedProductBarcode = readlineSync.question('Entrez le nouveau code-barres du produit: ');
        const updatedProductStatus = readlineSync.question('Entrez le nouveau statut du produit (actif/inactif): ');
        await productsModule.update(productIdToUpdate, updatedProductName, updatedProductDescription, updatedProductPrice, updatedProductStock, updatedProductCategory, updatedProductBarcode, updatedProductStatus);
        console.log('Produit mis à jour avec succès!');
        break;

        case '3':
          try {
            const productIdToDelete = readlineSync.question('Entrez l\'ID du produit à supprimer: ');
            await productsModule.destroy(productIdToDelete);
            console.log('Produit supprimé avec succès!');
          } catch (error) {
            console.log(error.message);
          }
          break;
        

      case '4':
        const products = await productsModule.getAll();
        console.log('Liste des produits:');
        console.table(products);
        break;

      case '5':
        exit = true;
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

async function paymentsMenu() {
  let exit = false;
  while (!exit) {
    console.log(`
      === MENU PAIEMENTS ===
      1. Ajouter un paiement
      2. Mettre à jour un paiement
      3. Supprimer un paiement
      4. Lister tous les paiements
      5. Retourner au menu principal
    `);

    const choice = readlineSync.question('Choisissez une option: ');

    switch (choice) {
      case '1':
        const orderId = readlineSync.questionInt('Entrez l\'ID de la commande: ');
        const paymentDate = readlineSync.question('Entrez la date de paiement (AAAA-MM-JJ): ');
        const paymentAmount = readlineSync.questionFloat('Entrez le montant du paiement: ');
        const paymentMethod = readlineSync.question('Entrez la méthode de paiement: ');
        try {
          await paymentsModule.store(orderId, paymentDate, paymentAmount, paymentMethod);
          console.log('Paiement ajouté avec succès!');
        } catch (error) {
          console.log(error.message);
        }
        break;

      case '2':
        const paymentIdToUpdate = readlineSync.questionInt('Entrez l\'ID du paiement à mettre à jour: ');
        const updatedOrderId = readlineSync.questionInt('Entrez l\'ID de la commande: ');
        const updatedPaymentDate = readlineSync.question('Entrez la nouvelle date de paiement (AAAA-MM-JJ): ');
        const updatedPaymentAmount = readlineSync.questionFloat('Entrez le nouveau montant du paiement: ');
        const updatedPaymentMethod = readlineSync.question('Entrez la nouvelle méthode de paiement: ');
        try {
          await paymentsModule.update(paymentIdToUpdate, updatedOrderId, updatedPaymentDate, updatedPaymentAmount, updatedPaymentMethod);
          console.log('Paiement mis à jour avec succès!');
        } catch (error) {
          console.log(error.message);
        }
        break;

      case '3':
        const paymentIdToDelete = readlineSync.questionInt('Entrez l\'ID du paiement à supprimer: ');
        try {
          await paymentsModule.destroy(paymentIdToDelete);
          console.log('Paiement supprimé avec succès!');
        } catch (error) {
          console.log(error.message);
        }
        break;

      case '4':
        const payments = await paymentsModule.getAll();
        console.log('Liste des paiements:');
        console.table(payments);
        break;

      case '5':
        exit = true;
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

async function ordersMenu() {
  let exit = false;
  while (!exit) {
    console.log(`
      === MENU COMMANDES ===
      1. Ajouter une commande
      2. Mettre à jour une commande
      3. Supprimer une commande
      4. Lister toutes les commandes
      5. Récupérer une commande avec ses détails
      6. Retourner au menu principal
    `);

    const choice = readlineSync.question('Choisissez une option: ');

    switch (choice) {
      case '1':
        await addOrder();
        break;
      case '2':
        await updateOrder();
        break;
      case '3':
        await deleteOrder();
        break;
      case '4':
        await listOrders();
        break;
      case '5':
        await retrieveOrderWithDetails();
        break;
      case '6':
        exit = true;
        break;
      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

// Ajoute une commande
async function addOrder() {
  

  const date = readlineSync.question('Entrez la date de la commande (AAAA-MM-JJ): ');
  const customer_id = readlineSync.questionInt('Entrez l\'ID du client: ');
  const delivery_address = readlineSync.question('Entrez l\'adresse de livraison: ');
  const track_number = readlineSync.question('Entrez le numéro de suivi: ');
  const status = readlineSync.question('Entrez le statut de la commande: ');

  const order = {date, customer_id, delivery_address, track_number,status }
  try {
    // const orderId = await purchaseOrdersModule.store(date, customer_id, delivery_address, track_number, status);
    // console.log('Commande ajoutée avec succès!');
    await manageOrderDetails(order);
  } catch (error) {
    handleAddOrderError(error);
  }
}

// Gère les détails de la commande après l'ajout
const details = [];
async function manageOrderDetails(order) {
  let detailsAdded = false;
  let subMenuExit = false;
  while (!subMenuExit) {
    console.log(`
      === SOUS-MENU DÉTAILS DE COMMANDE ===
      1. Ajouter un détail de commande
      2. Sauvegarder et quitter
      3. Quitter sans sauvegarder
    `);

    const subChoice = readlineSync.question('Choisissez une option: ');

    switch (subChoice) {
      case '1':
        const productId = readlineSync.questionInt('Entrez l\'ID du produit: ');
        const quantity = readlineSync.questionInt('Entrez la quantité: ');
        const price = readlineSync.questionFloat('Entrez le prix: ');
        //await purchaseOrdersModule.addOrderDetail(orderId, productId, quantity, price);
        details.push({productId,quantity,price})
        detailsAdded = true;
        break;

      case '2':
        if (detailsAdded) {
            await purchaseOrdersModule.store(order,details);
   
          console.log('Commande et détails sauvegardés.');
          subMenuExit = true;
        } else {
          console.log('Vous devez ajouter au moins un détail de commande avant de sauvegarder.');
        }
        break;
      case '3':
        if (!detailsAdded) {
          // await purchaseOrdersModule.destroy(orderId);
          console.log('Commande annulée car aucun détail n\'a été ajouté.');
        }
        subMenuExit = true;
        break;
      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

// Mets à jour une commande
async function updateOrder() {
 
}

// Supprime une commande
async function deleteOrder() {
  const orderId = readlineSync.questionInt('Entrez l\'ID de la commande à supprimer: ');
  try {
    const rowsAffected = await purchaseOrdersModule.destroy(orderId);
    if (rowsAffected > 0) {
      console.log('Commande supprimée avec succès.');
    } else {
      console.log('Aucune commande trouvée avec cet ID.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error.message);
  }
}

// Liste toutes les commandes
async function listOrders() {
  try {
    const orders = await purchaseOrdersModule.getAll();
    console.table(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error.message);
  }
}

// Récupère une commande avec ses détails
async function retrieveOrderWithDetails() {
  const orderId = readlineSync.questionInt('Entrez l\'ID de la commande: ');
  try {
    const order = await purchaseOrdersModule.getOrderWithDetails(orderId);
    console.table(order.order);
    console.table(order.details);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error.message);
  }
}

// Gère les erreurs d'ajout de commande
function handleAddOrderError(error) {
  if (error.message.includes('ER_NO_REFERENCED_ROW_2')) {
    console.log(`Erreur: ${error.message}`);
  } else {
    console.error('Erreur lors de l\'ajout de la commande:', error.message);
  }
}
// Mets à jour une commande
async function updateOrder() {
  // Récupérer les informations de la commande
  const id = readlineSync.questionInt('Entrez l\'ID de la commande à mettre à jour: ');
  const date = readlineSync.question('Entrez la nouvelle date de la commande (AAAA-MM-JJ): ');
  const customer_id = readlineSync.questionInt('Entrez l\'ID du client: ');
  const delivery_address = readlineSync.question('Entrez la nouvelle adresse de livraison: ');
  const track_number = readlineSync.question('Entrez le nouveau numéro de suivi: ');
  const status = readlineSync.question('Entrez le nouveau statut de la commande: ');
  let productDetailsUpdate = [];

  while (true) {
    console.log(`
      21. Choisir un produit à modifier
      22. Retour`
    );
    const choix = readlineSync.question('Choisissez une option : ');
    
    switch (choix) {
      case '21':
        // Récupérer l'ID du produit à modifier
        const productId = readlineSync.questionInt('ID du produit : ');

        // Validation (facultative) : Vérifier si le produit existe
        // if (!(await productIdExists(productId))) {
        //   console.log(`Produit avec l'ID : ${productId} n'existe pas. Veuillez essayer un autre ID.`);
        //   break;
        // }

        // Récupérer la quantité et le prix pour le produit sélectionné
        const quantity = readlineSync.questionInt('Quantité du produit : ');
        const price = readlineSync.question('Prix du produit : ');

        // Ajouter le détail du produit à la liste de mise à jour
        productDetailsUpdate.push({
          productId,
          quantity,
          price
        });

        console.log(`Produit avec l'ID : ${productId} ajouté pour la mise à jour.`);
        break;

      case '22':
        if (productDetailsUpdate.length > 0) {
          try {
            await purchaseOrdersModule.update(date, customer_id, delivery_address, track_number, status, id, productDetailsUpdate);
            console.log(`Commande avec l'ID : ${id} mise à jour avec succès.`);
          } catch (error) {
            console.log(`Erreur lors de la mise à jour de la commande : ${error.message}`);
          }
        } else {
          console.log("Aucun produit n'a été sélectionné pour la mise à jour.");
        }
        return ordersMenu(); 

      default:
        console.log('Choix invalide.');
        break;
    }
  }
}


// Supprime une commande
async function deleteOrder() {
  const id = readlineSync.questionInt('Entrez l\'ID de la commande à supprimer: ');
  await purchaseOrdersModule.destroy(id);
  console.log('Commande supprimée avec succès.');
}

// Liste toutes les commandes
async function listOrders() {
  const orders = await purchaseOrdersModule.getAll();
  console.log('Liste des commandes:', orders);
}

// Récupère une commande avec ses détails
async function retrieveOrderWithDetails() {
  const orderId = readlineSync.questionInt('Entrez l\'ID de la commande à récupérer: ');
  const orderWithDetails = await purchaseOrdersModule.getOrderWithDetails(orderId);
  console.log('Commande:', orderWithDetails.order);
  console.log('Détails de la commande:', orderWithDetails.details);
}



async function mainMenu() {
  let exit = false;
  while (!exit) {
    console.log(`
      === MENU PRINCIPAL ===
      1. Gérer les clients
      2. Gérer les produits
      3. Gérer les commandes
      4. Gérer les paiements
      5. Quitter
    `);

    const choice = readlineSync.question('Choisissez une option: ');

    switch (choice) {
      case '1':
        await customersMenu();
        break;

      case '2':
        await productsMenu();
        break;

      case '3':
        await ordersMenu();  
        break;

      case '4':
        await paymentsMenu();
        break;

      case '5':
        exit = true;
        console.log('Au revoir!');
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
    }
  }
}

mainMenu();
