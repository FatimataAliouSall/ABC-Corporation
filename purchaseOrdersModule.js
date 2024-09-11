const pool = require('./db');


async function store(date, customer_id, delivery_address, track_number, status ) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
      [date, customer_id, delivery_address, track_number, status]
    );
    return result.insertId;
  } catch (error) {
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
    console.log('Order detail added successfully!');
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
      throw new Error('Commande non trouvée');
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}





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

// async  function addOrderDetail(orderDetail) {
//   const connection = await pool.getConnection();
//   try {
//     const result = await connection.execute(
//       'INSERT INTO order_details (product_id, quantity, price, order_id) VALUES (?, ?, ?, ?)', 
//       [orderDetail.product_id, orderDetail.quantity, orderDetail.price, orderDetail.order_id]
//     );
//     return result[0].insertId; // Récupère l'ID du détail de commande nouvellement inséré
//   } catch (error) {
//     console.error('Erreur lors de la création du détail de commande:', error);
//     throw error;
//   }
// }


async function update(date, customer_id, delivery_address, track_number, status) {
  const connection = await pool.getConnection();
  try {
    const purchaseOrderExists = await exists(id);
    if (!purchaseOrderExists) {
      throw new Error(`Le purchaseOrder avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute(
      'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
      [date, customer_id, delivery_address, track_number, status]
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
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



async function destroy(id) {
  const connection = await pool.getConnection();
  try {
    const purchaseOrderExists = await exists(id);
    if (!purchaseOrderExists) {
      throw new Error(`Le purchase_orders avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute('DELETE FROM purchase_orders WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer une commande
async function destroy(orderId) {
  const connection = await pool.getConnection();
  try {
    // Vérifier si la commande existe
    const [orderExists] = await connection.execute('SELECT * FROM purchase_orders WHERE id = ?', [orderId]);
    if (orderExists.length === 0) {
      throw new Error(`Commande avec l'ID ${orderId} non trouvée.`);
    }

    // Supprimer les détails de commande associés
    await connection.execute('DELETE FROM order_details WHERE order_id = ?', [orderId]);

    // Supprimer la commande elle-même
    const [result] = await connection.execute('DELETE FROM purchase_orders WHERE id = ?', [orderId]);

    return result.affectedRows;
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    throw error;
  } finally {
    connection.release();
  }
}





module.exports = {
  store,
  update,
  getAll,
  destroy,
  exists,
  addOrderDetail,
  getOrderWithDetails
};
