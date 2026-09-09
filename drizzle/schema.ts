import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 220 }).notNull(),
  section: mysqlEnum("section", ["store", "finds"]).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  videoUrl: text("videoUrl"),
  purchaseUrl: text("purchaseUrl").notNull(),
  position: int("position").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ sectionPosition: index("products_section_position_idx").on(table.section, table.position) }));

export const productClicks = mysqlTable("product_clicks", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  referrer: varchar("referrer", { length: 500 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productCreated: index("product_clicks_product_created_idx").on(table.productId, table.createdAt) }));

export const pageVisits = mysqlTable("page_visits", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 200 }).default("/").notNull(),
  referrer: varchar("referrer", { length: 500 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
