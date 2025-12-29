
export function validate(schema, source = 'body') {
    return async (req, res, next) => {
        try {
            const data = await schema.parseAsync(req[source]);
            // In Express 5.x, req.query is read-only, so we store validated data separately
            if (!req.validated) {
                req.validated = {};
            }
            req.validated[source] = data;
            // For body, we can still assign directly
            if (source === 'body') {
                req.body = data;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}
