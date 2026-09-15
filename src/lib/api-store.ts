import type { Agent, Listing, Graphic, Photo, Package } from './types';
import { PACKAGE_LIMITS } from './types';

const API_BASE = '/api';

// ============ AGENTS ============

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function getAgent(id: string): Promise<Agent | null> {
  const res = await fetch(`${API_BASE}/agents/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch agent');
  return res.json();
}

export async function createAgent(agent: Omit<Agent, '_id'> & { _id?: string }): Promise<Agent> {
  const res = await fetch(`${API_BASE}/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error('Failed to create agent');
  return res.json();
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
  const res = await fetch(`${API_BASE}/agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to update agent');
  return res.json();
}

export async function deleteAgent(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/agents/${id}`, { method: 'DELETE' });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error('Failed to delete agent');
  return true;
}

// ============ LISTINGS ============

export async function getListings(agentId?: string): Promise<Listing[]> {
  const url = agentId ? `${API_BASE}/listings?agentId=${agentId}` : `${API_BASE}/listings`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch listings');
  const listings = await res.json();
  return listings.map((l: Listing) => ({
    ...l,
    createdAt: new Date(l.createdAt),
    updatedAt: new Date(l.updatedAt),
  }));
}

export async function getListing(id: string): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch listing');
  const listing = await res.json();
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  };
}

export async function createListing(listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  const created = await res.json();
  return {
    ...created,
    createdAt: new Date(created.createdAt),
    updatedAt: new Date(created.updatedAt),
  };
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to update listing');
  const updated = await res.json();
  return {
    ...updated,
    createdAt: new Date(updated.createdAt),
    updatedAt: new Date(updated.updatedAt),
  };
}

export async function deleteListing(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/listings/${id}`, { method: 'DELETE' });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error('Failed to delete listing');
  return true;
}

// ============ PHOTOS ============

export async function addPhoto(listingId: string, photo: Photo): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${listingId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to add photo');
  const listing = await res.json();
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  };
}

export async function updatePhoto(listingId: string, photoId: string, updates: Partial<Photo>): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${listingId}/photos/${photoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to update photo');
  const listing = await res.json();
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  };
}

export async function updatePhotoFocal(listingId: string, photoId: string, focal: { x: number; y: number }): Promise<Listing | null> {
  return updatePhoto(listingId, photoId, { focal });
}

export async function deletePhoto(listingId: string, photoId: string): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${listingId}/photos/${photoId}`, {
    method: 'DELETE',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to delete photo');
  const listing = await res.json();
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  };
}

export async function reorderPhotos(listingId: string, photoIds: string[]): Promise<Listing | null> {
  const res = await fetch(`${API_BASE}/listings/${listingId}/photos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoIds }),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to reorder photos');
  const listing = await res.json();
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  };
}

// ============ GRAPHICS ============

export async function getGraphics(listingId?: string): Promise<Graphic[]> {
  const url = listingId ? `${API_BASE}/graphics?listingId=${listingId}` : `${API_BASE}/graphics`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch graphics');
  const graphics = await res.json();
  return graphics.map((g: Graphic) => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
  }));
}

export async function getGraphicsByAgent(agentId: string): Promise<Graphic[]> {
  const listings = await getListings(agentId);
  const listingIds = listings.map(l => l._id);
  const allGraphics = await getGraphics();
  return allGraphics.filter(g => listingIds.includes(g.listingId));
}

export async function getGraphic(id: string): Promise<Graphic | null> {
  const res = await fetch(`${API_BASE}/graphics/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch graphic');
  const graphic = await res.json();
  return {
    ...graphic,
    createdAt: new Date(graphic.createdAt),
    updatedAt: new Date(graphic.updatedAt),
  };
}

export async function createGraphic(graphic: Omit<Graphic, '_id' | 'createdAt' | 'updatedAt'>): Promise<Graphic> {
  const res = await fetch(`${API_BASE}/graphics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphic),
  });
  if (!res.ok) throw new Error('Failed to create graphic');
  const created = await res.json();
  return {
    ...created,
    createdAt: new Date(created.createdAt),
    updatedAt: new Date(created.updatedAt),
  };
}

export async function updateGraphic(id: string, updates: Partial<Graphic>): Promise<Graphic | null> {
  const res = await fetch(`${API_BASE}/graphics/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to update graphic');
  const updated = await res.json();
  return {
    ...updated,
    createdAt: new Date(updated.createdAt),
    updatedAt: new Date(updated.updatedAt),
  };
}

export async function deleteGraphic(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/graphics/${id}`, { method: 'DELETE' });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error('Failed to delete graphic');
  return true;
}

// ============ PACKAGES ============

export async function getPackages(agentId?: string): Promise<Package[]> {
  const url = agentId ? `${API_BASE}/packages?agentId=${agentId}` : `${API_BASE}/packages`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch packages');
  return res.json();
}

export async function getPackage(id: string): Promise<Package | null> {
  const res = await fetch(`${API_BASE}/packages/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch package');
  return res.json();
}

export async function getActivePackage(agentId: string): Promise<Package | null> {
  const res = await fetch(`${API_BASE}/packages?agentId=${agentId}&active=true`);
  if (!res.ok) throw new Error('Failed to fetch active package');
  return res.json();
}

export async function createPackage(pkg: Omit<Package, '_id'>): Promise<Package> {
  const res = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pkg),
  });
  if (!res.ok) throw new Error('Failed to create package');
  return res.json();
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to update package');
  return res.json();
}

export async function getPackageUsage(packageId: string): Promise<{ used: number; limit: number }> {
  const pkg = await getPackage(packageId);
  if (!pkg) return { used: 0, limit: 0 };

  const graphics = await getGraphics();
  const used = graphics.filter(g => g.packageId === packageId).length;
  return {
    used,
    limit: PACKAGE_LIMITS[pkg.type],
  };
}

// ============ AGGREGATIONS ============

export async function getAgentStats(agentId: string): Promise<{ listings: number; graphics: number; packageUsage?: { used: number; limit: number } }> {
  const listings = await getListings(agentId);
  const graphics = await getGraphicsByAgent(agentId);
  const activePackage = await getActivePackage(agentId);

  const result: { listings: number; graphics: number; packageUsage?: { used: number; limit: number } } = {
    listings: listings.length,
    graphics: graphics.length,
  };

  if (activePackage) {
    result.packageUsage = await getPackageUsage(activePackage._id);
  }

  return result;
}

// ============ FULL GRAPHIC DATA ============

export type FullGraphicData = {
  graphic: Graphic;
  listing: Listing;
  agent: Agent;
  coAgent?: Agent;
};

export async function getFullGraphicData(graphicId: string): Promise<FullGraphicData | null> {
  const graphic = await getGraphic(graphicId);
  if (!graphic) return null;

  const listing = await getListing(graphic.listingId);
  if (!listing) return null;

  const agent = await getAgent(listing.agentId);
  if (!agent) return null;

  return { graphic, listing, agent };
}
