const pool = require('../db');

// Vérifie si une commande existe
async function exists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM purchase_orders WHERE id = ?', [id]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Ajoute une nouvelle commande
async function store(order, details) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.execute(
      'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
      [order.date, order.customer_id, order.delivery_address, order.track_number, order.status]
    );
    console.log(result)
    console.log(order)
    console.log(details)
    for(let i=0;i<details.length;i++){
      const detail=details[i];
      await connection.execute(
        'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [result.insertId, detail.productId, detail.quantity, detail.price]
      );
    }
    
    await connection.commit();
    
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    // if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
    //   throw new Error(`Valeur incorrecte pour le champ 'date'. Assurez-vous que la date est au format 'AAAA-MM-JJ'.`);
    // } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    //   throw new Error(`Le client avec l'ID ${customer_id} n'existe pas. Veuillez vérifier l'ID du client.`);
    // }
    throw error;
  } finally {
    connection.release();
  }
}

// Ajoute un détail de commande
async function addOrderDetail(orderId, productId, quantity, price) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, price]
    );
    console.log('Détail de commande ajouté avec succès!');
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Récupère une commande avec ses détails
async function getOrderWithDetails(orderId) {
  const connection = await pool.getConnection();
  try {
    const [order] = await connection.execute('SELECT * FROM purchase_orders WHERE id = ?', [orderId]);
    const [details] = await connection.execute('SELECT * FROM order_details WHERE order_id = ?', [orderId]);

    if (order.length > 0) {
      return { order: order[0], details };
    } else {
      throw new Error(`La commande avec l'ID ${orderId} n'a pas été trouvée.`);
    }
  } catch (error) {
    if (error.message.includes('ETIMEDOUT')) {
      throw new Error('Impossible de se connecter à la base de données. Veuillez réessayer plus tard.');
    }
    throw error;
  } finally {
    connection.release();
  }
}

// Met à jour une commande et ses détails
async function update(date, customer_id, delivery_address, track_number, status, id, details) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const purchaseOrderExists = await exists(id);
    if (!purchaseOrderExists) {
      throw new Error(`La commande avec l'ID ${id} n'existe pas.`);
    }
    const [result] = await connection.execute(
      'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
      [date, customer_id, delivery_address, track_number, status, id]
    );

    if (result.affectedRows === 0) {
      throw new Error(`Aucune mise à jour n'a été effectuée sur la commande avec l'ID ${id}.`);
    }
    for (const detail of details) {
      const [updateDetailResult] = await connection.execute(
        'UPDATE order_details SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?',
        [detail.quantity, detail.price, id, detail.productId]
      );

      // Optionnel : vérifier si la mise à jour a échoué pour un produit
      if (updateDetailResult.affectedRows === 0) {
        throw new Error(`Impossible de mettre à jour le détail de commande pour le produit avec l'ID ${detail.productId}.`);
      }
    }
    await connection.commit();
    console.log('Commande mise à jour avec succès.');
    
  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      console.log(`Valeur incorrecte pour le champ 'date'. Assurez-vous que la date est au format 'AAAA-MM-JJ'.`);
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.log(`Le client avec l'ID ${customer_id} n'existe pas. Veuillez vérifier l'ID du client.`);
    } else {
      console.log('Erreur lors de la modification :', error.message);
    }

    throw error;
    
  } finally {
    connection.release();
  }
}


// Récupère toutes les commandes
async function getAll() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM purchase_orders');
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Supprime une commande et ses détails
async function destroy(orderId) {
  const connection = await pool.getConnection();
  try {
    const purchaseOrderExists = await exists(orderId);
    if (!purchaseOrderExists) {
      throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
    }

    await connection.execute('DELETE FROM order_details WHERE order_id = ?', [orderId]);
    const [result] = await connection.execute('DELETE FROM purchase_orders WHERE id = ?', [orderId]);

    return result.affectedRows;
  } catch (error) {
    if (error.message.includes('n\'existe pas')) {
      throw new Error(`Impossible de supprimer : ${error.message}`);
    } else {
      throw new Error('Veuillez réessayer.');
    }
  } finally {
    connection.release();
  }
}

module.exports = {
  store,
  addOrderDetail,
  getOrderWithDetails,
  update,
  getAll,
  destroy,
  exists
};
