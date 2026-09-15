import { Collection, ObjectId } from 'mongodb';
import clientPromise, { DB_NAME } from './clientPromise';
import type { Graphic } from '../types';

const COLLECTION_NAME = 'graphics';

interface GraphicDocument extends Omit<Graphic, '_id'> {
  _id?: ObjectId;
}

async function getCollection(): Promise<Collection<GraphicDocument>> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<GraphicDocument>(COLLECTION_NAME);
}

function docToGraphic(doc: GraphicDocument): Graphic {
  return {
    ...doc,
    _id: doc._id?.toHexString(),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

export async function getGraphics(listingId?: string): Promise<Graphic[]> {
  const collection = await getCollection();
  const query = listingId ? { listingId } : {};
  const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToGraphic);
}

export async function getGraphicsByAgent(agentId: string, listingIds: string[]): Promise<Graphic[]> {
  const collection = await getCollection();
  const docs = await collection
    .find({ listingId: { $in: listingIds } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(docToGraphic);
}

export async function getGraphic(id: string): Promise<Graphic | null> {
  const collection = await getCollection();

  let doc = null;
  try {
    doc = await collection.findOne({ _id: new ObjectId(id) });
  } catch {
    doc = await collection.findOne({ _id: id as unknown as ObjectId });
  }

  return doc ? docToGraphic(doc) : null;
}

export async function createGraphic(
  graphic: Omit<Graphic, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Graphic> {
  const collection = await getCollection();

  const now = new Date();
  const doc: GraphicDocument = {
    ...graphic,
    _id: new ObjectId(),
    overrides: graphic.overrides || {},
    photoAssignments: graphic.photoAssignments || {},
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return docToGraphic(doc);
}

export async function updateGraphic(
  id: string,
  updates: Partial<Graphic>
): Promise<Graphic | null> {
  const collection = await getCollection();

  const { _id, createdAt, ...updateFields } = updates;
  const updateDoc = {
    ...updateFields,
    updatedAt: new Date(),
  };

  let result = null;
  try {
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
  } catch {
    result = await collection.findOneAndUpdate(
      { _id: id as unknown as ObjectId },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
  }

  return result ? docToGraphic(result) : null;
}

export async function deleteGraphic(id: string): Promise<boolean> {
  const collection = await getCollection();

  let result;
  try {
    result = await collection.deleteOne({ _id: new ObjectId(id) });
  } catch {
    result = await collection.deleteOne({ _id: id as unknown as ObjectId });
  }

  return result.deletedCount > 0;
}

export async function deleteGraphicsByListing(listingId: string): Promise<number> {
  const collection = await getCollection();
  const result = await collection.deleteMany({ listingId });
  return result.deletedCount;
}

// Seed initial graphics if collection is empty
export async function seedGraphicsIfEmpty(initialGraphics: Graphic[]): Promise<void> {
  const collection = await getCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    const now = new Date();
    const docs = initialGraphics.map(graphic => ({
      ...graphic,
      _id: new ObjectId(),
      createdAt: graphic.createdAt || now,
      updatedAt: graphic.updatedAt || now,
    }));
    await collection.insertMany(docs);
    console.log(`[mongodb:graphics] Seeded ${docs.length} graphics`);
  }
}
