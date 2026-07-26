/**
 * Build pagination meta and Prisma skip/take values
 * @param {object} query - Express req.query object
 * @param {number} totalCount - Total number of records from DB
 * @returns {{ skip, take, meta }}
 */
const paginate = (query, totalCount) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  const meta = {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { skip, take: limit, meta };
};

module.exports = { paginate };
