exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('heroes', function(table) {
      table.increments('id').primary();
      table.string('heroName');
      table.string('heroDescription');
      table.string('heroClass');
      table.string('specialPower');
      table.integer('attackPoints');
      table.integer('defensePoints');
      table.integer('magicPoints');			
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

