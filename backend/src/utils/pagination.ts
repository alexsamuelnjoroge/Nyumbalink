export interface PaginationParams {
  page:  number;
  limit: number;
  skip:  number;
}

export function getPagination(query: { page?: string; limit?: string }): PaginationParams {
  const page  = Math.max(1, parseInt(query.page  ?? '1',  10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationParams,
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
