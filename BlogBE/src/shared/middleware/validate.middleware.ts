// import { Request, Response, NextFunction, RequestHandler } from 'express'
// import { ZodObject, ZodRawShape, ZodTypeAny, ZodError } from 'zod'

// type InferReq<S extends ZodObject<any>> = {
//   body: S extends ZodObject<infer B> ? B : unknown
//   query: S extends ZodObject<infer Q> ? Q : unknown
//   params: S extends ZodObject<infer P> ? P : unknown
// }

// /**
//  * Middleware validate request with Zod
//  * @param schema Zod schema for { body?, query?, params? }
//  */
// export function validate<S extends ZodObject<any>>(
//   schema: S
// ): RequestHandler<InferReq<S>['params'], any, InferReq<S>['body'], InferReq<S>['query']> {
//   return (req, res, next) => {
//     try {
//       schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params
//       })
//       next()
//     } catch (err) {
//       if (err instanceof ZodError) {
//         return res.status(400).json({
//           message: 'Validation error',
//           errors: err.flatten()
//         })
//       }
//       next(err)
//     }
//   }
// }
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodObject, ZodTypeAny, ZodError, z, ZodRawShape } from 'zod'

type InferReq<S extends ZodObject<any>> = {
  body: S['shape'] extends { body: ZodTypeAny } ? z.infer<S['shape']['body']> : unknown
  query: S['shape'] extends { query: ZodTypeAny } ? z.infer<S['shape']['query']> : unknown
  params: S['shape'] extends { params: ZodTypeAny } ? z.infer<S['shape']['params']> : unknown
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
      // Hàm parse vẫn hoạt động như cũ
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.flatten()
        })
      }
      next(err)
    }
  }
}
