export const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
export const defaultPagination = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};
