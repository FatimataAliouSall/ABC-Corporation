const connection = require('../db'); 

async function orderExists(order_id) {
  const query = `SELECT 1 FROM purchase_orders WHERE id = ?`;
  const [rows] = await connection.execute(query, [order_id]);
  return rows.length > 0;
}


async function paymentExists(id) {
  const query = `SELECT 1 FROM payments WHERE id = ?`;
  const [rows] = await connection.execute(query, [id]);
  return rows.length > 0;
}


async function store(order_id, date, amount, payment_method) {
 
  const exists = await orderExists(order_id);
  if (!exists) {
    throw new Error(`Commande avec ID ${order_id} n'existe pas`);
  }

  const query = `INSERT INTO payments (order_id, date, amount, payment_method) VALUES (?, ?, ?, ?)`;
  const values = [order_id, date, amount, payment_method];
  const [result] = await connection.execute(query, values);
  return result;
}

async function update(id, order_id, date, amount, payment_method) {

  const paymentExistsCheck = await paymentExists(id);
  if (!paymentExistsCheck) {
    throw new Error(`Paiement avec ID ${id} n'existe pas`);
  }

  const orderExistsCheck = await orderExists(order_id);
  if (!orderExistsCheck) {
    throw new Error(`Commande avec ID ${order_id} n'existe pas`);
  }

  const query = `UPDATE payments SET order_id = ?, date = ?, amount = ?, payment_method = ? WHERE id = ?`;
  const values = [order_id, date, amount, payment_method, id];
  const [result] = await connection.execute(query, values);
  return result;
}


async function destroy(id) {
  const paymentExistsCheck = await paymentExists(id);
  if (!paymentExistsCheck) {
    throw new Error(`Paiement avec ID ${id} n'existe pas`);
  }

  const query = `DELETE FROM payments WHERE id = ?`;
  const [result] = await connection.execute(query, [id]);
  return result;
}


async function getAll() {
  const query = `SELECT * FROM payments`;
  const [rows] = await connection.execute(query);
  return rows;
}

module.exports = { store, update, destroy, getAll };
