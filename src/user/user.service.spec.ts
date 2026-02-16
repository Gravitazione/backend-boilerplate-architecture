import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user via prisma', async () => {
      const dto = { email: 'a@b.com', name: 'Test' };
      const created = { id: 1, ...dto };
      mockPrismaService.user.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return users with posts', async () => {
      const users = [{ id: 1, email: 'a@b.com', name: 'Test', posts: [] }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: { posts: true },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      const user = { id: 1, email: 'a@b.com', name: 'Test', posts: [] };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('User #999 not found');
    });
  });

  describe('update', () => {
    it('should update user via prisma', async () => {
      const dto = { name: 'Updated' };
      const updated = { id: 1, email: 'a@b.com', name: 'Updated' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.user.update.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete user via prisma', async () => {
      const deleted = { id: 1, email: 'a@b.com', name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue(deleted);
      mockPrismaService.user.delete.mockResolvedValue(deleted);

      const result = await service.remove(1);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(deleted);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
