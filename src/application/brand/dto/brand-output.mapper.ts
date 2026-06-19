import { Brand } from '@domain/brand/entities/brand.entity';
import { MenuItem } from '@domain/brand/entities/menu-item.entity';
import { BrandEvent } from '@domain/brand/entities/brand-event.entity';

export interface BrandOutput {
  id: number;
  slug: string;
  type: Brand['type'];
  name: Brand['name'];
  description: Brand['description'];
  logoUrl: string | null;
  coverImageUrl: string | null;
  address: Brand['address'];
  phone: string | null;
  mapEmbed: string | null;
  socialLinks: Brand['socialLinks'];
  workHours: Brand['workHours'];
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandDetailOutput extends BrandOutput {
  menuItems?: MenuItemOutput[];
  events?: BrandEventOutput[];
}

export interface MenuItemOutput {
  id: number;
  brandId: number;
  category: MenuItem['category'];
  name: MenuItem['name'];
  description: MenuItem['description'];
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandEventOutput {
  id: number;
  brandId: number;
  title: BrandEvent['title'];
  description: BrandEvent['description'];
  eventDate: string;
  location: BrandEvent['location'];
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toBrandOutput(brand: Brand): BrandOutput {
  return {
    id: brand.id,
    slug: brand.slug,
    type: brand.type,
    name: brand.name,
    description: brand.description,
    logoUrl: brand.logoUrl,
    coverImageUrl: brand.coverImageUrl,
    address: brand.address,
    phone: brand.phone,
    mapEmbed: brand.mapEmbed,
    socialLinks: brand.socialLinks,
    workHours: brand.workHours,
    sortOrder: brand.sortOrder,
    isPublished: brand.isPublished,
    publishedAt: brand.publishedAt?.toISOString() ?? null,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
  };
}

export function toMenuItemOutput(item: MenuItem): MenuItemOutput {
  return {
    id: item.id,
    brandId: item.brandId,
    category: item.category,
    name: item.name,
    description: item.description,
    price: item.price,
    imageUrl: item.imageUrl,
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
    isPublished: item.isPublished,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function toBrandEventOutput(event: BrandEvent): BrandEventOutput {
  return {
    id: event.id,
    brandId: event.brandId,
    title: event.title,
    description: event.description,
    eventDate: event.eventDate.toISOString(),
    location: event.location,
    imageUrl: event.imageUrl,
    sortOrder: event.sortOrder,
    isPublished: event.isPublished,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
