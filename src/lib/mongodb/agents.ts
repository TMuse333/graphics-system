import { Collection, ObjectId } from 'mongodb';
import clientPromise, { DB_NAME } from './clientPromise';
import type { Agent } from '../types';

const COLLECTION_NAME = 'agents';

interface AgentDocument extends Omit<Agent, '_id'> {
  _id?: ObjectId;
}

async function getCollection(): Promise<Collection<AgentDocument>> {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<AgentDocument>(COLLECTION_NAME);
}

function docToAgent(doc: AgentDocument): Agent {
  return {
    ...doc,
    _id: doc._id?.toHexString() || '',
  };
}

export async function getAgents(): Promise<Agent[]> {
  const collection = await getCollection();
  const docs = await collection.find().toArray();
  return docs.map(docToAgent);
}

export async function getAgent(id: string): Promise<Agent | null> {
  const collection = await getCollection();

  // Try ObjectId first, fall back to string _id for legacy data
  let doc = null;
  try {
    doc = await collection.findOne({ _id: new ObjectId(id) });
  } catch {
    // If ObjectId parsing fails, try string match
    doc = await collection.findOne({ _id: id as unknown as ObjectId });
  }

  return doc ? docToAgent(doc) : null;
}

export async function createAgent(agent: Omit<Agent, '_id'> & { _id?: string }): Promise<Agent> {
  const collection = await getCollection();

  const doc: AgentDocument = {
    ...agent,
    _id: agent._id ? new ObjectId(agent._id) : new ObjectId(),
  };

  await collection.insertOne(doc);
  return docToAgent(doc);
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
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

  return result ? docToAgent(result) : null;
}

export async function deleteAgent(id: string): Promise<boolean> {
  const collection = await getCollection();

  let result;
  try {
    result = await collection.deleteOne({ _id: new ObjectId(id) });
  } catch {
    result = await collection.deleteOne({ _id: id as unknown as ObjectId });
  }

  return result.deletedCount > 0;
}

// Seed initial agents if collection is empty
export async function seedAgentsIfEmpty(initialAgents: Agent[]): Promise<void> {
  const collection = await getCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    const docs = initialAgents.map(agent => ({
      ...agent,
      _id: new ObjectId(),
    }));
    await collection.insertMany(docs);
    console.log(`[mongodb:agents] Seeded ${docs.length} agents`);
  }
}
