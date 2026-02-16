import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthController } from '@/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockHttpHealthIndicator = {
    pingCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttpHealthIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check result', async () => {
      const healthResult = {
        status: 'ok',
        info: { 'nestjs-docs': { status: 'up' } },
        error: {},
        details: { 'nestjs-docs': { status: 'up' } },
      };
      mockHealthCheckService.check.mockImplementation((checks: unknown[]) => {
        expect(checks).toHaveLength(1);
        expect(typeof checks[0]).toBe('function');
        return Promise.resolve(healthResult);
      });

      const result = await controller.check();

      expect(mockHealthCheckService.check).toHaveBeenCalled();
      expect(result).toEqual(healthResult);
    });

    it('should run ping check for nestjs-docs', async () => {
      mockHttpHealthIndicator.pingCheck.mockResolvedValue({
        'nestjs-docs': { status: 'up' },
      });
      mockHealthCheckService.check.mockImplementation(
        async (checks: Array<() => Promise<unknown>>) => {
          expect(checks).toHaveLength(1);
          const pingCheckFn = checks[0];
          if (pingCheckFn) await pingCheckFn();
          return {
            status: 'ok',
            info: { 'nestjs-docs': { status: 'up' } },
            error: {},
            details: { 'nestjs-docs': { status: 'up' } },
          };
        },
      );

      await controller.check();

      expect(mockHttpHealthIndicator.pingCheck).toHaveBeenCalledWith(
        'nestjs-docs',
        'https://docs.nestjs.com',
      );
    });
  });
});
