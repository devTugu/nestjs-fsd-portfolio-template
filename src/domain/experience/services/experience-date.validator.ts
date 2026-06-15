export function validateExperienceDates(input: {
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
}): { endDate: Date | null; isCurrent: boolean } {
  const isCurrent = input.isCurrent ?? false;
  const endDate = isCurrent ? null : (input.endDate ?? null);

  if (isCurrent && input.endDate) {
    throw new Error('Current experience cannot have an end date.');
  }
  if (endDate && endDate < input.startDate) {
    throw new Error('End date must be on or after start date.');
  }

  return { endDate, isCurrent };
}
