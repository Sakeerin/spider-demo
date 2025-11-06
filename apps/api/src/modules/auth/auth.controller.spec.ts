import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLinkService } from './magic-link.service';
import { UserRole } from '@spider/shared';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockMagicLinkService = {
    requestMagicLink: jest.fn(),
    verifyMagicLink: jest.fn(),
  };

  const mockAuthTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: '1',
      email: 'test@example.com',
      role: UserRole.CUSTOMER,
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      language: 'en',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: MagicLinkService,
          useValue: mockMagicLinkService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.CUSTOMER,
      };

      mockAuthService.register.mockResolvedValue(mockAuthTokens);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthTokens);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockAuthTokens);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthTokens);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens', async () => {
      const refreshTokenDto = {
        refreshToken: 'mock-refresh-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockAuthTokens);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockAuthTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe('requestMagicLink', () => {
    it('should request magic link', async () => {
      const magicLinkRequestDto = {
        email: 'contractor@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockResponse = {
        message: 'Magic link sent to your email',
        token: 'mock-magic-token',
      };

      mockMagicLinkService.requestMagicLink.mockResolvedValue(mockResponse);

      const result = await controller.requestMagicLink(magicLinkRequestDto);

      expect(result).toEqual(mockResponse);
      expect(mockMagicLinkService.requestMagicLink).toHaveBeenCalledWith(
        magicLinkRequestDto,
      );
    });
  });

  describe('verifyMagicLink', () => {
    it('should verify magic link', async () => {
      const magicLinkVerifyDto = {
        token: 'mock-magic-token',
      };

      mockMagicLinkService.verifyMagicLink.mockResolvedValue(mockAuthTokens);

      const result = await controller.verifyMagicLink(magicLinkVerifyDto);

      expect(result).toEqual(mockAuthTokens);
      expect(mockMagicLinkService.verifyMagicLink).toHaveBeenCalledWith(
        magicLinkVerifyDto,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const changePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      const mockUser = mockAuthTokens.user;
      mockAuthService.changePassword.mockResolvedValue(undefined);

      const result = await controller.changePassword(mockUser, changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        mockUser.id,
        changePasswordDto,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = mockAuthTokens.user;

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const result = await controller.logout();

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});