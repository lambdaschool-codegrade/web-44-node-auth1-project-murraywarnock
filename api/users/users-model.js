const db = require("../../data/db-config");

module.exports = {
  find,
  findBy,
  findById,
  add,
};
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db("users")
    .select("id", "username")
    .orderBy("id");
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db("users")
    .where(filter)
    .orderBy("id"); // []
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db("users")
    .where(filter)
    .orderBy("id");

}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  return db("users")
    .where({ id })
    .first();
}

// Don't forget to add these to the `exports` object so they can be required in other modules
