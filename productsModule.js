const pool = require('./db');

async function store(name, description, price, stock, category, barcode, status) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, barcode, status]
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
    const [rows] = await connection.execute('SELECT 1 FROM products WHERE id = ?', [id]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}


async function update(id, name, description, price, stock, category, barcode, status) {
  const connection = await pool.getConnection();
  try {
    const productExists = await exists(id);
    if (!productExists) {
      throw new Error(`Le produit avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?',
      [name, description, price, stock, category, barcode, status, id]
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
    const [rows] = await connection.execute('SELECT * FROM products');
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
    const productExists = await exists(id);
    if (!productExists) {
      throw new Error(`Le produit avec l'ID ${id} n'existe pas.`);
    }

    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
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
  exists
};
