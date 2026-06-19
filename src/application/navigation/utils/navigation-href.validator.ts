import { BadRequestException } from '@nestjs/common';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';

export function assertValidNavigationHref(
  type: NavigationNodeType,
  href: string | null | undefined,
): void {
  if (type !== NavigationNodeType.LINK && type !== NavigationNodeType.CTA_ROW) {
    return;
  }
  if (!href?.trim()) {
    throw new BadRequestException('href is required for link nodes');
  }
  const value = href.trim();
  const isRelative = value.startsWith('/');
  const isHttps = value.startsWith('https://');
  if (!isRelative && !isHttps) {
    throw new BadRequestException('href must be a relative path or https URL');
  }
}
