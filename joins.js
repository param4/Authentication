const sql = require('mysql')

const connection = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'join'
})


connection.connect(() => {
  console.log("Congrats.. You are connected!");
  
  let query=`SELECT customers.customer_id, name, age, amount
            FROM customers, orders
            WHERE customers.customer_id = orders.customer_id`
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  })
})



