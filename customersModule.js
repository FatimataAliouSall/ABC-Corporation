const pool = require('./db');


async function store(name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
      [name, address, email, phone]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}


async function exists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM customers WHERE id = ?', [id]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}


async function update(id, name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const customerExists = await exists(id);
    if (!customerExists) {
      throw new Error(`Le client avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute(
      'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
      [name, address, email, phone, id]
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
    const [rows] = await connection.execute('SELECT * FROM customers');
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer un client
async function destroy(id) {
  const connection = await pool.getConnection();
  try {
    const customerExists = await exists(id);
    if (!customerExists) {
      throw new Error(`Le client avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Export des fonctions
module.exports = {
  store,
  update,
  getAll,
  destroy,
  exists
};
