export interface JwtPayload {
  email: string;
  displayName: string;
  isActive: boolean;
}

export type AuthRequest = Request & {
  user: JwtPayload;
};
