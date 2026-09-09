import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertUser, pageVisits, productClicks, products, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublicProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.active, true)).orderBy(asc(products.section), asc(products.position), desc(products.createdAt));
}

export async function listAdminProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(asc(products.section), asc(products.position), desc(products.createdAt));
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(products).values(product);
  return result[0].insertId;
}

export async function updateProduct(id: number, values: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(products).set(values).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(products).where(eq(products.id, id));
}

export async function recordPageVisit(path: string, referrer?: string, userAgent?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pageVisits).values({ path, referrer, userAgent });
}

export async function recordProductClick(productId: number, referrer?: string, userAgent?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(productClicks).values({ productId, referrer, userAgent });
}

export async function getAnalytics() {
  const db = await getDb();
  if (!db) return { visits: 0, clicks: [] };
  const [visitRows, clickRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(pageVisits),
    db.select({ productId: productClicks.productId, name: products.name, section: products.section, clicks: sql<number>`count(*)` }).from(productClicks).leftJoin(products, eq(productClicks.productId, products.id)).groupBy(productClicks.productId, products.name, products.section).orderBy(desc(sql`count(*)`)),
  ]);
  return { visits: Number(visitRows[0]?.count ?? 0), clicks: clickRows.map((row) => ({ productId: row.productId, name: row.name ?? "Produto removido", section: row.section, clicks: Number(row.clicks) })) };
}
