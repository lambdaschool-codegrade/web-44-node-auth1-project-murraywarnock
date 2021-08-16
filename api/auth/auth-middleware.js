const { findBy } = require('../users/users-model');


function restricted(req, res, next) {
  if (req.session.user) { // session exists
    next();
  } else {
    next({ status: 401, message: 'You shall not pass!' });
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const user = await findBy({ username }); 
    if (user) {
console.log('user :>> ', user);
      req.user = user;
      res.status(422).json({ message: "Username taken" })
    } else {
      next(); // username is not taken
    }
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body;
    const user = await findBy({ username }); 
    if (user) {
      console.log(user)
      req.user = user;
      next();
    } else {
      next({ 
        status: 401, 
        message: "Invalid credentials" 
      })
    }
  } catch (err) {
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if (req.body.password.length < 3) {
    res.status(422).json({ message: "Password must be longer than 3 chars" })
  } else {
    next(); // password OK
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
