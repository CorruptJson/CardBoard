const db= require('../scripts/database.js')
db.run_query(`Select * from users`).then(res => (console.log(res))).catch(err => console.log(err))
