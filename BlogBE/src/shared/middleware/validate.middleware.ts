import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodObject, z } from 'zod'

// (Type InferReq của bạn đã ổn)
type InferReq<S extends ZodObject<any>> = {
  body: S['shape'] extends { body: z.ZodTypeAny } ? z.infer<S['shape']['body']> : unknown
  query: S['shape'] extends { query: z.ZodTypeAny } ? z.infer<S['shape']['query']> : unknown
  params: S['shape'] extends { params: z.ZodTypeAny } ? z.infer<S['shape']['params']> : unknown
}

/**
 * Middleware validate request with Zod
 * @param schema Zod schema for { body?, query?, params? }
 */
export function validate<S extends ZodObject<any>>(
  schema: S
): RequestHandler<InferReq<S>['params'], any, InferReq<S>['body'], InferReq<S>['query']> {
  return (req, res, next) => {
    try {
      // 1. Parse TỪNG PHẦN một cách riêng rẽ
      // Bằng cách này, lỗi sẽ có path là 'email' chứ không phải 'body.email'
      if (schema.shape.body) {
        schema.shape.body.parse(req.body)
      }
      if (schema.shape.query) {
        schema.shape.query.parse(req.query)
      }
      if (schema.shape.params) {
        schema.shape.params.parse(req.params)
      }

      // Nếu tất cả đều ổn, đi tiếp
      next()
    } catch (err) {
      // 2. Nếu có lỗi (bất kể là ZodError hay không), ném nó cho globalErrorHandler
      next(err)
    }
  }
}
