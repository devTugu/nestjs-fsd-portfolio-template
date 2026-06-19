import { Inject, Injectable } from '@nestjs/common';
import { INavigationNodeRepository } from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';
import { AppErrors } from '@application/exceptions/application.exception';

@Injectable()
export class DeleteNavigationNodeUseCase {
  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.navigationNodes.findById(id);
    if (!existing) {
      throw AppErrors.NOT_FOUND('Navigation node not found.');
    }
    await this.navigationNodes.softDelete(id);
  }
}
