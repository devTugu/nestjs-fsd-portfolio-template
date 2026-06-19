import { Inject, Injectable } from '@nestjs/common';
import { IHistoryEntryRepository } from '@domain/history/repositories/history-entry.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { HISTORY_ENTRY_REPOSITORY } from '@shared/constants/tokens';
import {
  HistoryEntryOutput,
  toHistoryEntryOutput,
} from '../dto/history-output.mapper';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

@Injectable()
export class CreateHistoryEntryUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(input: {
    year: number;
    title: LocalizedText;
    description: LocalizedText;
    imageUrl?: string | null;
    sortOrder?: number;
    isPublished?: boolean;
  }): Promise<HistoryEntryOutput> {
    const entry = await this.history.create(input);
    return toHistoryEntryOutput(entry);
  }
}

@Injectable()
export class UpdateHistoryEntryUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(
    id: number,
    input: {
      year?: number;
      title?: LocalizedText;
      description?: LocalizedText;
      imageUrl?: string | null;
      sortOrder?: number;
      isPublished?: boolean;
    },
  ): Promise<HistoryEntryOutput> {
    const existing = await this.history.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('History entry not found.');
    const entry = await this.history.update(id, input);
    return toHistoryEntryOutput(entry);
  }
}

@Injectable()
export class GetHistoryEntryUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(id: number): Promise<HistoryEntryOutput> {
    const entry = await this.history.findById(id);
    if (!entry) throw AppErrors.NOT_FOUND('History entry not found.');
    return toHistoryEntryOutput(entry);
  }
}

@Injectable()
export class ListHistoryEntriesUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<HistoryEntryOutput>> {
    const result = await this.history.findAll(query);
    return { ...result, items: result.items.map(toHistoryEntryOutput) };
  }
}

@Injectable()
export class DeleteHistoryEntryUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const entry = await this.history.findById(id);
    if (!entry) throw AppErrors.NOT_FOUND('History entry not found.');
    await this.history.softDelete(id);
  }
}

@Injectable()
export class ListPublicHistoryUseCase {
  constructor(
    @Inject(HISTORY_ENTRY_REPOSITORY)
    private readonly history: IHistoryEntryRepository,
  ) {}

  async execute(): Promise<HistoryEntryOutput[]> {
    const items = await this.history.findAllPublished();
    return items.map(toHistoryEntryOutput);
  }
}
