const pool = require('./db');

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

async function store(date, customer_id, delivery_address, track_number, status) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
      [date, customer_id, delivery_address, track_number, status]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      throw new Error(`Valeur incorrecte pour le champ 'date'. Assurez-vous que la date est au format 'AAAA-MM-JJ'.`);
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new Error(`Le client avec l'ID ${customer_id} n'existe pas. Veuillez vérifier l'ID du client.`);
    }
    
    throw error;
  } finally {
    connection.release();
  }
}


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


async function getOrderWithDetails(orderId) {
  const connection = await pool.getConnection();
  try {
    const [order] = await connection.execute('SELECT * FROM purchase_orders WHERE id = ?', [orderId]);
    const [details] = await connection.execute('SELECT * FROM order_details WHERE order_id = ?', [orderId]);

    if (order.length > 0) {
      return {
        order: order[0],
        details: details
      };
    } else {
      throw new Error(`La commande avec l'ID ${orderId} n'a pas été trouvée.`);
    }
  } catch (error) {
    if (error.message.includes('ETIMEDOUT')) {
      console.error('Problème de connexion à la base de données :', error.message);
      throw new Error('Impossible de se connecter à la base de données. Veuillez réessayer plus tard.');
    }
 
    throw error;
  } finally {
    connection.release();
  }
}



async function update(date, customer_id, delivery_address, track_number, status, id, details) {
  const connection = await pool.getConnection();
  try {
    const purchaseOrderExists = await exists(id);
    if (!purchaseOrderExists) {
      throw new Error(`La commande avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute(
      'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
      [date, customer_id, delivery_address, track_number, status, id]
    );
    for (const detail of details) {
      await connection.execute(
          'UPDATE order_details SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?',
          [detail.quantity, detail.price, id, detail.productId]
      );
  }

    if (result.affectedRows === 0) {
      throw new Error(`Aucune mise à jour n'a été effectuée sur la commande avec l'ID ${id}.`);
    }
    else{
      console.log('Commande mise à jour avec succès.');
    }
    //  else if  (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
    //   throw new Error(`Valeur incorrecte pour le champ 'date'. Assurez-vous que la date est au format 'AAAA-MM-JJ'.`);
    // } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    //   throw new Error(`Le client avec l'ID ${customer_id} n'existe pas. Veuillez vérifier l'ID du client.`);
    // } else if (error.message.includes('n\'existe pas')) {
    //   throw new Error(error.message);
    // } else {
    //   throw new Error(' Veuillez vérifier les informations fournies.');
    // }

    
  } catch (error) {
     if  (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      console.log(`Valeur incorrecte pour le champ 'date'. Assurez-vous que la date est au format 'AAAA-MM-JJ'.`);
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.log(`Le client avec l'ID ${customer_id} n'existe pas. Veuillez vérifier l'ID du client.`);
    } else if (error.message.includes('n\'existe pas')) {
      console.log(error.message);
    } else {
      console.log(' Erreur lors de la modification.',error.message);
    }

    // console.error('Veuillez entrer un ID de client valide:', error.message);
  } finally {
    connection.release();
  }
}




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
