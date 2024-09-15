const pool = require('../db');


async function store(name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
      [name, address, email, phone]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('customers.email')) {
        throw new Error('L\'email est déjà utilisé.');
      } else if (error.sqlMessage.includes('customers.phone')) {
        throw new Error('Le numéro de téléphone est déjà utilisé.');
      }
    }
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
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('customers.phone')) {
      throw new Error('Le numéro de téléphone est déjà utilisé.');
    } else if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('customers.email')) {
      throw new Error('L email  est déjà utilisé.');
    }
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
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error(`Impossible de supprimer le client avec l'ID ${id} car il est lié à des commandes existantes.`);
    }

    
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
