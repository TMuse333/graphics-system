import { Collection, ObjectId } from 'mongodb';
import clientPromise, { DB_NAME } from './clientPromise';
import type { Listing, Photo } from '../types';

const COLLECTION_NAME = 'listings';

interface ListingDocument extends Omit<Listing, '_id'> {
  _id?: ObjectId;
}

async function getCollection(): Promise<Collection<ListingDocument>> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<ListingDocument>(COLLECTION_NAME);
}

function docToListing(doc: ListingDocument): Listing {
  return {
    ...doc,
    _id: doc._id?.toHexString(),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

export async function getListings(agentId?: string): Promise<Listing[]> {
  const collection = await getCollection();
  const query = agentId ? { agentId } : {};
  const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(docToListing);
}

export async function getListing(id: string): Promise<Listing | null> {
  const collection = await getCollection();

  let doc = null;
  try {
    doc = await collection.findOne({ _id: new ObjectId(id) });
  } catch {
    doc = await collection.findOne({ _id: id as unknown as ObjectId });
  }

  return doc ? docToListing(doc) : null;
}

export async function createListing(
  listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Listing> {
  const collection = await getCollection();

  const now = new Date();
  const doc: ListingDocument = {
    ...listing,
    _id: new ObjectId(),
    photos: listing.photos || [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return docToListing(doc);
}

export async function updateListing(
  id: string,
  updates: Partial<Listing>
): Promise<Listing | null> {
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

  return result ? docToListing(result) : null;
}

export async function deleteListing(id: string): Promise<boolean> {
  const collection = await getCollection();

  let result;
  try {
    result = await collection.deleteOne({ _id: new ObjectId(id) });
  } catch {
    result = await collection.deleteOne({ _id: id as unknown as ObjectId });
  }

  return result.deletedCount > 0;
}

// Photo operations
export async function addPhoto(listingId: string, photo: Photo): Promise<Listing | null> {
  const collection = await getCollection();

  let result = null;
  try {
    result = await collection.findOneAndUpdate(
      { _id: new ObjectId(listingId) },
      {
        $push: { photos: photo },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );
  } catch {
    result = await collection.findOneAndUpdate(
      { _id: listingId as unknown as ObjectId },
      {
        $push: { photos: photo },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );
  }

  return result ? docToListing(result) : null;
}

export async function updatePhoto(
  listingId: string,
  photoId: string,
  updates: Partial<Photo>
): Promise<Listing | null> {
  const listing = await getListing(listingId);
  if (!listing) return null;

  const photos = listing.photos.map(p =>
    p.id === photoId ? { ...p, ...updates } : p
  );

  return updateListing(listingId, { photos });
}

export async function deletePhoto(listingId: string, photoId: string): Promise<Listing | null> {
  const listing = await getListing(listingId);
  if (!listing) return null;

  const photos = listing.photos.filter(p => p.id !== photoId);
  return updateListing(listingId, { photos });
}

export async function reorderPhotos(listingId: string, photoIds: string[]): Promise<Listing | null> {
  const listing = await getListing(listingId);
  if (!listing) return null;

  const photoMap = new Map(listing.photos.map(p => [p.id, p]));
  const reorderedPhotos = photoIds
    .map((id, index) => {
      const photo = photoMap.get(id);
      return photo ? { ...photo, sort: index } : null;
    })
    .filter((p): p is Photo => p !== null);

  return updateListing(listingId, { photos: reorderedPhotos });
}

// Seed initial listings if collection is empty
export async function seedListingsIfEmpty(initialListings: Listing[]): Promise<void> {
  const collection = await getCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    const now = new Date();
    const docs = initialListings.map(listing => ({
      ...listing,
      _id: new ObjectId(),
      createdAt: listing.createdAt || now,
      updatedAt: listing.updatedAt || now,
    }));
    await collection.insertMany(docs);
    console.log(`[mongodb:listings] Seeded ${docs.length} listings`);
  }
}
