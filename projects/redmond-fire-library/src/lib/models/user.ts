export interface UserDoc {
        createdAt: number | string;
        name: string | null;
        email: string | null;
        isAnonymous: boolean;
        lastLoginAt: number | string;
        phoneNumber: string | null;
        photoURL: string | null;
        uid: string;
        updatedAt: number | string;
        access?: UserAccessDoc;
}

export interface UserAccessDoc {
        updatedAt: number | string;
        createdAt: number | string;
        uid: string;
        role: string;
        canAccess: string[];
}

export enum UserAccessKey {
      SITE = 'site',
      MANAGE_USERS = 'manage-users',
      MESSAGES = 'messages',
}

export const CAN_ACCESS_KEYS: UserAccessKey[] = Object.values(UserAccessKey)

export const USER_ROLE_COLORS = {
    admin: 'red',
    team: 'purple',
    user: 'cyan'
}
  
export enum UserRole {
  USER = 'user',
  TEAM = 'team',
  ADMIN = 'admin',
}
