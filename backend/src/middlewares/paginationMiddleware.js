const paginationMiddleware = (req, res, next) => {
  const pageParam = req.query.page;
  const limitParam = req.query.limit;
  const searchParam = req.query.search;

  if (!pageParam && !limitParam && !searchParam) {
    return next();
  }

  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;
  const search = searchParam ? searchParam.trim() : null;

  if (pageParam && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Página deve ser um número maior que 0',
    });
  }

  if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limite deve ser um número entre 1 e 100',
    });
  }

  const offset = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    offset,
    search,
  };

  next();
};

module.exports = paginationMiddleware;
