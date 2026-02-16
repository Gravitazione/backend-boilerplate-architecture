import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create with dto', async () => {
      const dto = { email: 'a@b.com', name: 'Test' };
      mockUserService.create.mockResolvedValue({ id: 1, ...dto });

      await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return result of userService.findAll', async () => {
      const users = [{ id: 1, email: 'a@b.com', name: 'Test' }];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with id', async () => {
      const user = { id: 1, email: 'a@b.com', name: 'Test' };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(1);

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should call userService.update with id and dto', async () => {
      const dto = { name: 'Updated' };
      const updated = { id: 1, email: 'a@b.com', name: 'Updated' };
      mockUserService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(mockUserService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call userService.remove with id', async () => {
      const deleted = { id: 1, email: 'a@b.com', name: 'Test' };
      mockUserService.remove.mockResolvedValue(deleted);

      const result = await controller.remove(1);

      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleted);
    });
  });
});
