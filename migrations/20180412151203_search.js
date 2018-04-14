
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table heroes add fulltext(heroDescription)"),
  ]);  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table heroes drop index heroDescription"),
  ]);
};
