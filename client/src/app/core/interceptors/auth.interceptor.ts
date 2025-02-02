import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const clonedRequest = req.clone({
    withCredentials: true   // Necessary for cookies or authentication tokens
  });

  return next(clonedRequest);
};
