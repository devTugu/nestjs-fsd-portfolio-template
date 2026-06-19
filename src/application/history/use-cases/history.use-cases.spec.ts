import { HistoryEntry } from '@domain/history/entities/history-entry.entity';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateHistoryEntryUseCase,
  DeleteHistoryEntryUseCase,
  GetHistoryEntryUseCase,
  ListHistoryEntriesUseCase,
  ListPublicHistoryUseCase,
  UpdateHistoryEntryUseCase,
} from './history.use-cases';

describe('History use cases', () => {
  const now = new Date();

  const entry = new HistoryEntry(
    1,
    2020,
    localizedText('Founded', 'Founded'),
    localizedText('Company founded', 'Company founded'),
    null,
    0,
    true,
    now,
    now,
  );

  const history = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('CreateHistoryEntryUseCase creates entry', async () => {
    history.create.mockResolvedValue(entry);
    const result = await new CreateHistoryEntryUseCase(
      history as never,
    ).execute({
      year: 2020,
      title: localizedText('Founded', 'Founded'),
      description: localizedText('Company founded', 'Company founded'),
    });
    expect(result.id).toBe(1);
  });

  it('UpdateHistoryEntryUseCase updates entry', async () => {
    history.findById.mockResolvedValue(entry);
    history.update.mockResolvedValue({ ...entry, year: 2021 });
    const result = await new UpdateHistoryEntryUseCase(
      history as never,
    ).execute(1, { year: 2021 });
    expect(result.year).toBe(2021);
  });

  it('UpdateHistoryEntryUseCase throws NOT_FOUND', async () => {
    history.findById.mockResolvedValue(null);
    await expect(
      new UpdateHistoryEntryUseCase(history as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetHistoryEntryUseCase returns entry', async () => {
    history.findById.mockResolvedValue(entry);
    const result = await new GetHistoryEntryUseCase(history as never).execute(
      1,
    );
    expect(result.id).toBe(1);
  });

  it('GetHistoryEntryUseCase throws NOT_FOUND', async () => {
    history.findById.mockResolvedValue(null);
    await expect(
      new GetHistoryEntryUseCase(history as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListHistoryEntriesUseCase maps paginated items', async () => {
    history.findAll.mockResolvedValue({
      items: [entry],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListHistoryEntriesUseCase(
      history as never,
    ).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('DeleteHistoryEntryUseCase soft deletes', async () => {
    history.findById.mockResolvedValue(entry);
    await new DeleteHistoryEntryUseCase(history as never).execute(1);
    expect(history.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteHistoryEntryUseCase throws NOT_FOUND', async () => {
    history.findById.mockResolvedValue(null);
    await expect(
      new DeleteHistoryEntryUseCase(history as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPublicHistoryUseCase returns published entries', async () => {
    history.findAllPublished.mockResolvedValue([entry]);
    const result = await new ListPublicHistoryUseCase(
      history as never,
    ).execute();
    expect(result).toHaveLength(1);
  });
});
