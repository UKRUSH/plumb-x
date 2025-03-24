export const isAuthPage = (pathname) => {
  const authPaths = ['/signin', '/register', '/reset-password'];
  return authPaths.some(path => pathname?.startsWith(path));
}; 