const auth = require('../scripts/auth.js')

auth.signup('hi', 'jason123', 'jason123')
  .then(res => console.log(res))
  .catch(err => console.log(`Error: ${err}`))
  .then(() => {
    auth.login('hi', 'jason123')
      .then(res => console.log(`Logged in as ${res}`))
      .catch(err => console.log(`Error: ${err}`))
  })
