
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('heroes', function(table) {
      table.increments('id').primary();
      table.string('heroName');
      table.string('heroDescription');
      table.dateTime('created');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('heroes'),
  ]);
};