import { MongoClient, ObjectId, Db } from 'mongodb';
import type { Agent, Listing, Graphic, Photo } from './types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'listing-graphics';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionError: string | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (connectionError) throw new Error(connectionError);

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    connectionError = null;
    return db;
  } catch (error) {
    connectionError = 'MongoDB not connected';
    throw new Error(connectionError);
  }
}

export async function isDbConnected(): Promise<boolean> {
  try {
    await getDb();
    return true;
  } catch {
    return false;
  }
}

export function getConnectionError(): string | null {
  return connectionError;
}

// ============ AGENTS ============
// Agents use string IDs (slugs like "greg-caseley"), not ObjectId

export async function getAgents(): Promise<Agent[]> {
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.collection('agents').find().toArray() as any;
}

export async function getAgent(id: string): Promise<Agent | null> {
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return db.collection('agents').findOne({ _id: id } as any) as any;
}

export async function createAgent(agent: Agent): Promise<Agent> {
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.collection('agents').insertOne(agent as any);
  return agent;
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
  const db = await getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await db.collection('agents').findOneAndUpdate(
    { _id: id } as any,
    { $set: updates },
    { returnDocument: 'after' }
  ) as any;
  return result;
}

// ============ LISTINGS ============

export async function getListings(agentId?: string): Promise<Listing[]> {
  const db = await getDb();
  const query = agentId ? { agentId } : {};
  return db.collection<Listing>('listings')
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getListing(id: string): Promise<Listing | null> {
  const db = await getDb();
  return db.collection<Listing>('listings').findOne({ _id: new ObjectId(id) });
}

export async function createListing(listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
  const db = await getDb();
  const now = new Date();
  const doc = {
    ...listing,
    photos: listing.photos || [],
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection('listings').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
  const db = await getDb();
  const result = await db.collection<Listing>('listings').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deleteListing(id: string): Promise<boolean> {
  const db = await getDb();
  // Also delete associated graphics
  await db.collection('graphics').deleteMany({ listingId: new ObjectId(id) });
  const result = await db.collection('listings').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// ============ PHOTOS (embedded in listings) ============

export async function addPhoto(listingId: string, photo: Photo): Promise<Listing | null> {
  const db = await getDb();
  const result = await db.collection<Listing>('listings').findOneAndUpdate(
    { _id: new ObjectId(listingId) },
    {
      $push: { photos: photo },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function updatePhoto(listingId: string, photoId: string, updates: Partial<Photo>): Promise<Listing | null> {
  const db = await getDb();
  const result = await db.collection<Listing>('listings').findOneAndUpdate(
    { _id: new ObjectId(listingId), 'photos.id': photoId },
    {
      $set: {
        'photos.$': { ...updates, id: photoId },
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function updatePhotoFocal(listingId: string, photoId: string, focal: { x: number; y: number }): Promise<Listing | null> {
  const db = await getDb();
  const result = await db.collection<Listing>('listings').findOneAndUpdate(
    { _id: new ObjectId(listingId), 'photos.id': photoId },
    {
      $set: {
        'photos.$.focal': focal,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deletePhoto(listingId: string, photoId: string): Promise<Listing | null> {
  const db = await getDb();
  const result = await db.collection<Listing>('listings').findOneAndUpdate(
    { _id: new ObjectId(listingId) },
    {
      $pull: { photos: { id: photoId } },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function reorderPhotos(listingId: string, photoIds: string[]): Promise<Listing | null> {
  const listing = await getListing(listingId);
  if (!listing) return null;

  // Reorder photos based on photoIds array
  const photoMap = new Map(listing.photos.map(p => [p.id, p]));
  const reorderedPhotos = photoIds
    .map((id, index) => {
      const photo = photoMap.get(id);
      return photo ? { ...photo, sort: index } : null;
    })
    .filter((p): p is Photo => p !== null);

  return updateListing(listingId, { photos: reorderedPhotos });
}

// ============ GRAPHICS ============

export async function getGraphics(listingId?: string): Promise<Graphic[]> {
  const db = await getDb();
  const query = listingId ? { listingId: new ObjectId(listingId) } : {};
  return db.collection<Graphic>('graphics')
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getGraphicsByAgent(agentId: string): Promise<Graphic[]> {
  const db = await getDb();
  // Get all listings for this agent
  const listings = await db.collection<Listing>('listings')
    .find({ agentId })
    .project({ _id: 1 })
    .toArray();

  const listingIds = listings.map(l => l._id);

  return db.collection<Graphic>('graphics')
    .find({ listingId: { $in: listingIds } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getGraphic(id: string): Promise<Graphic | null> {
  const db = await getDb();
  return db.collection<Graphic>('graphics').findOne({ _id: new ObjectId(id) });
}

export async function createGraphic(graphic: Omit<Graphic, '_id' | 'createdAt' | 'updatedAt'>): Promise<Graphic> {
  const db = await getDb();
  const now = new Date();
  const doc = {
    ...graphic,
    overrides: graphic.overrides || {},
    photoAssignments: graphic.photoAssignments || {},
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection('graphics').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateGraphic(id: string, updates: Partial<Graphic>): Promise<Graphic | null> {
  const db = await getDb();
  const result = await db.collection<Graphic>('graphics').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deleteGraphic(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection('graphics').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// ============ AGGREGATIONS ============

export async function getAgentStats(agentId: string): Promise<{ listings: number; graphics: number }> {
  const db = await getDb();

  const listings = await db.collection('listings').countDocuments({ agentId });

  const listingDocs = await db.collection<Listing>('listings')
    .find({ agentId })
    .project({ _id: 1 })
    .toArray();

  const listingIds = listingDocs.map(l => l._id);
  const graphics = await db.collection('graphics').countDocuments({
    listingId: { $in: listingIds }
  });

  return { listings, graphics };
}

// ============ FULL GRAPHIC DATA (for rendering) ============

export type FullGraphicData = {
  graphic: Graphic;
  listing: Listing;
  agent: Agent;
  coAgent?: Agent;
};

export async function getFullGraphicData(graphicId: string): Promise<FullGraphicData | null> {
  const graphic = await getGraphic(graphicId);
  if (!graphic) return null;

  const listing = await getListing(graphic.listingId.toString());
  if (!listing) return null;

  const agent = await getAgent(listing.agentId);
  if (!agent) return null;

  return { graphic, listing, agent };
}
