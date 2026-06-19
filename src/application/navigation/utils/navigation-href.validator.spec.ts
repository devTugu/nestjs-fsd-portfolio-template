import { BadRequestException } from '@nestjs/common';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';
import { assertValidNavigationHref } from './navigation-href.validator';

describe('assertValidNavigationHref', () => {
  it('allows mega nodes without href', () => {
    expect(() =>
      assertValidNavigationHref(NavigationNodeType.MEGA, null),
    ).not.toThrow();
  });

  it('requires href for link nodes', () => {
    expect(() =>
      assertValidNavigationHref(NavigationNodeType.LINK, null),
    ).toThrow(BadRequestException);
  });

  it('accepts relative href for link nodes', () => {
    expect(() =>
      assertValidNavigationHref(NavigationNodeType.LINK, '/pricing'),
    ).not.toThrow();
  });

  it('accepts https href for link nodes', () => {
    expect(() =>
      assertValidNavigationHref(
        NavigationNodeType.LINK,
        'https://example.com/docs',
      ),
    ).not.toThrow();
  });

  it('rejects invalid href scheme', () => {
    expect(() =>
      assertValidNavigationHref(NavigationNodeType.LINK, 'http://example.com'),
    ).toThrow(BadRequestException);
  });
});
