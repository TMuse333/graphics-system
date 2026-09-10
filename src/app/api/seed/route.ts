import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { greg } from '@/lib/theme';
import type { Listing, Graphic } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export async function POST() {
  try {
    const db = await getDb();

    // Clear existing data
    await db.collection('agents').deleteMany({});
    await db.collection('listings').deleteMany({});
    await db.collection('graphics').deleteMany({});

    // Seed Greg Caseley (agent uses string _id, not ObjectId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.collection('agents').insertOne(greg as any);

    // Seed a sample listing
    const now = new Date();
    const listing: Listing = {
      agentId: greg._id,
      address: '278 Basinview Crescent',
      city: 'Darnley',
      province: 'PE',
      postal: 'C0B 1M0',
      mls: '202401',
      price: 425000,
      propertyType: 'residential',
      beds: 3,
      baths: 2,
      photos: [
        {
          id: uuid(),
          url: '/sample/hero.jpg',
          focal: { x: 50, y: 40 },
          tag: 'hero',
          sort: 0,
        },
        {
          id: uuid(),
          url: '/sample/interior1.jpg',
          focal: { x: 50, y: 50 },
          tag: 'interior',
          sort: 1,
        },
        {
          id: uuid(),
          url: '/sample/interior2.jpg',
          focal: { x: 50, y: 50 },
          tag: 'interior',
          sort: 2,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const listingResult = await db.collection('listings').insertOne(listing);

    // Seed a sample graphic
    const graphic: Graphic = {
      listingId: listingResult.insertedId,
      templateId: 'style-b-square',
      variant: 'new-listing',
      overrides: {},
      photoAssignments: {
        hero: listing.photos[0].id,
        strip: [listing.photos[1].id, listing.photos[2].id],
      },
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('graphics').insertOne(graphic);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        agent: greg._id,
        listingId: listingResult.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
