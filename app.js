const express = require('express')
const auth = require('./scripts/auth.js')

auth.signup('jason', 'jason123').catch(err => console.log(err))

auth.login('jason', 'jason')
.then(res => console.log(res), err => console.log(err))