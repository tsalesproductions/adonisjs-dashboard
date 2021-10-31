import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
      this.schema.createTable(this.tableName, table => {
          table.increments('id').unique();
          table.string('name').notNullable();
          table.string('email').notNullable();
          table.string('password').notNullable();
          table.string('url').notNullable();
      });
  }

  public async down() {
      this.schema.dropTable(this.tableName);
  }
}