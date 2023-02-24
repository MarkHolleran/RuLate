const bcrypt = require('bcrypt');

// Function to hash password
const hash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Function to compare password with hashed password
const compare = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
    hash,
    compare
};