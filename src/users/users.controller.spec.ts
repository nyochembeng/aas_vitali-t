import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = new User({
    _id: '123',
    fullname: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException if email exists', async () => {
      const createUserDto: CreateUserDto = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      mockUsersService.create.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById('123');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findById('123')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { fullname: 'Jane Doe' };
      const updatedUser = { ...mockUser, fullname: 'Jane Doe' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('123', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        '123',
        updateUserDto,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = { fullname: 'Jane Doe' };
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.update('123', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(
        '123',
        updateUserDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUsersService.delete.mockResolvedValue(undefined);

      await controller.delete('123');
      expect(mockUsersService.delete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.delete.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.delete('123')).rejects.toThrow(NotFoundException);
      expect(mockUsersService.delete).toHaveBeenCalledWith('123');
    });
  });
});
