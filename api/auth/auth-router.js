// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { add, findBy } = require('../users/users-model');
const { 
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  } = require("../auth/auth-middleware");
 
 router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
   try {
     const { username, password } = req.body;
     const hash = bcrypt.hashSync(password, 8);
     const user = { username, password: hash };
     const newUser = await add(user);
 
     res.status(201).json({ 
       user_id: newUser.user_id,
       username: newUser.username,
      });
   } catch (err) {
     next(err);
   }
 });
 
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.user;
    // does username correspond to an existing user?
   if (bcrypt.compareSync(req.body.password, password)) {
      console.log(req.user);
      console.log(req.session);
      // we have determined the username and password are legit
      // we have to start a session with this user!!!!
      req.session.user = req.user;
      // 1- a cookie will be set on the client with a sessionId
      // 2- the sessionId will also be stored in the server (the session)
      res.json({ message: `Welcome ${username}!` })
    } else {
      next({ status: 401, message: 'bad credentials' })
    }
  } catch (err) {
    next(err);
  }
});

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res, next) =>{
  res.json("logout");
});

module.exports = router;
