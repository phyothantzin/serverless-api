import { serial, timestamp, text, pgTable } from "drizzle-orm/pg-core";

const User = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export default User;
