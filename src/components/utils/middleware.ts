// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export const validate = (schema: AnySchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      schema.validateSync(req.body)
        .then(() => next())
        .catch((err: { details: any; }) => res.status(400).send(err.details));
    };
  };
