const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('username')
    .exists({ checkFalsy: false })
    .withMessage('Username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Get all users 
router.get('/', async (req, res) => {
  const user = await User.findAll();

  res.json(user);
});

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    let credentials = [];

    const { firstName, lastName, email, password, username } = req.body;

    const users = await User.findAll( {attributes: ["email", "username"]});

    users.forEach(user => {credentials.push(user.toJSON())});

    for (let cred of credentials) {
      if (cred.email === email) {
        const err = new Error("User already exists");
        err.title = "Validation Error";
        err.message = "User already exists";
        err.errors = { "email": "User with that email already exists" }
        err.status = 500;
        return next(err);
      } else if (cred.username === username) {
        const err = new Error("User already exists");
        err.title = "Validation Error";
        err.message = "User already exists";
        err.errors = { "username": "User with that username already exists" }
        err.status = 500;
        return next(err);
      }
    };

    const hashedPassword = bcrypt.hashSync(password);

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });
    
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;