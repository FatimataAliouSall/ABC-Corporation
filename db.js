const mysql = require('mysql2/promise');


const connPool = mysql.createPool({
  host: 'localhost',             
  user: 'root',                  
  password: 'root',             
  database: 'abc_corporation',   
  waitForConnections: true,       
  connectionLimit: 100,           
  queueLimit: 0 ,
  connectTimeout: 300000 
                    
});


connPool.getConnection()
  .then(connection => {
    console.log("CONNECTED to MySQL Database");
    connection.release();  
  })
  .catch(err => {
    console.error("Failed to connect to the database:", err.message);
  });

module.exports = connPool;
