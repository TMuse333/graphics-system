import { Collection, ObjectId } from 'mongodb';
import clientPromise, { DB_NAME } from './clientPromise';
import type { Package } from '../types';

const COLLECTION_NAME = 'packages';

interface PackageDocument extends Omit<Package, '_id'> {
  _id?: ObjectId;
}

async function getCollection(): Promise<Collection<PackageDocument>> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<PackageDocument>(COLLECTION_NAME);
}

function docToPackage(doc: PackageDocument): Package {
  return {
    ...doc,
    _id: doc._id?.toHexString() || '',
  };
}

export async function getPackages(agentId?: string): Promise<Package[]> {
  const collection = await getCollection();
  const query = agentId ? { agentId } : {};
  const docs = await collection.find(query).toArray();
  return docs.map(docToPackage);
}

export async function getPackage(id: string): Promise<Package | null> {
  const collection = await getCollection();

  let doc = null;
  try {
    doc = await collection.findOne({ _id: new ObjectId(id) });
  } catch {
    doc = await collection.findOne({ _id: id as unknown as ObjectId });
  }

  return doc ? docToPackage(doc) : null;
}

export async function getActivePackage(agentId: string): Promise<Package | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ agentId, status: 'active' });
  return doc ? docToPackage(doc) : null;
}

export async function createPackage(pkg: Omit<Package, '_id'>): Promise<Package> {
  const collection = await getCollection();

  const doc: PackageDocument = {
    ...pkg,
    _id: new ObjectId(),
  };

  await collection.insertOne(doc);
  return docToPackage(doc);
}

export async function updatePackage(
  id: string,
  updates: Partial<Package>
): Promise<Package | null> {
  const collection = await getCollection();

  const { _id, ...updateFields } = updates;

  let result = null;
  try {
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
  } catch {
    result = await collection.findOneAndUpdate(
      { _id: id as unknown as ObjectId },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
  }

  return result ? docToPackage(result) : null;
}

// Seed initial packages if collection is empty
export async function seedPackagesIfEmpty(initialPackages: Package[]): Promise<void> {
  const collection = await getCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    const docs = initialPackages.map(pkg => ({
      ...pkg,
      _id: new ObjectId(),
    }));
    await collection.insertMany(docs);
    console.log(`[mongodb:packages] Seeded ${docs.length} packages`);
  }
}
