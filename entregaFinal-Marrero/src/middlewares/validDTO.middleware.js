export function validateDto(dto) {
    return (req, res, next) => {
      const result = dto.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          error: "Bad Request",
          details: result.error.errors.map(err => err.message),
        });
      }
  
      req.body = result.data;
  
      next();
    };
  }
  