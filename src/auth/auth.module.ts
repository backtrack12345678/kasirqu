import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { OtpModule } from '../otp/otp.module';
import { UserModule } from '../user/user.module';
import { RoleGuard } from './guards/role.guard';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [OtpModule, UserModule, EmployeeModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
  ],
})
export class AuthModule {}
