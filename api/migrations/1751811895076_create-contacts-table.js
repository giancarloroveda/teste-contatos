/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType("contact_type", ["email", "phone"]);

  pgm.createTable("contacts", {
    id: "id",
    type: {type: "contact_type", notNull: true},
    description: {type: "varchar(255)", notNull: true},
    person_id: {type: "int", notNull: true},
  });

  pgm.addConstraint(
    "contacts",
    "contacts_person_id_fkey",
    "FOREIGN KEY(person_id) REFERENCES people(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("contacts");
  pgm.dropType("contact_type");
};
