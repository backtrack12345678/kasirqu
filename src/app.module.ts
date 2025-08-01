import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, EmployeeModule, OtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
