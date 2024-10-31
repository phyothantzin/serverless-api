import { serial, timestamp, text, pgTable } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
