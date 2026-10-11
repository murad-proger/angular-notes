import { HttpInterceptorFn } from '@angular/common/http';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    console.log(`[HTTP] ${req.method} ${req.urlWithParams}`);
    return next(req);
};