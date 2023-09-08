export type JwtPayload = {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};
