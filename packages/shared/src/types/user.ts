// User-related types and interfaces

export enum UserRole {
  VISITOR = 'VISITOR',
  CUSTOMER = 'CUSTOMER',
  CONTRACTOR = 'CONTRACTOR',
  COORDINATOR = 'COORDINATOR',
  SALES = 'SALES',
  ADMIN = 'ADMIN',
}

export enum Province {
  BANGKOK = 'BANGKOK',
  NONTHABURI = 'NONTHABURI',
  PATHUM_THANI = 'PATHUM_THANI',
  SAMUT_PRAKAN = 'SAMUT_PRAKAN',
  SAMUT_SAKHON = 'SAMUT_SAKHON',
  NAKHON_PATHOM = 'NAKHON_PATHOM',
  CHONBURI = 'CHONBURI',
  RAYONG = 'RAYONG',
  CHACHOENGSAO = 'CHACHOENGSAO',
  PRACHIN_BURI = 'PRACHIN_BURI',
  NAKHON_NAYOK = 'NAKHON_NAYOK',
  SA_KAEO = 'SA_KAEO',
  AYUTTHAYA = 'AYUTTHAYA',
  LOPBURI = 'LOPBURI',
  SARABURI = 'SARABURI',
  SING_BURI = 'SING_BURI',
  ANG_THONG = 'ANG_THONG',
  SUPHAN_BURI = 'SUPHAN_BURI',
  KANCHANABURI = 'KANCHANABURI',
  RATCHABURI = 'RATCHABURI',
  SAMUT_SONGKHRAM = 'SAMUT_SONGKHRAM',
  PHETCHABURI = 'PHETCHABURI',
  PRACHUAP_KHIRI_KHAN = 'PRACHUAP_KHIRI_KHAN',
}

export interface IUser {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  lineNotifications: boolean;
  inAppNotifications: boolean;
  address?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithProfile extends IUser {
  profile?: IUserProfile;
}

// User creation and update DTOs
export interface CreateUserDto {
  email: string;
  phone?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export interface UpdateUserDto {
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language?: string;
  isActive?: boolean;
}

export interface UpdateUserProfileDto {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  lineNotifications?: boolean;
  inAppNotifications?: boolean;
  address?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
  timezone?: string;
}