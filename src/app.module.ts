import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';
import { RegencyModule } from './regency/regency.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { CashBookModule } from './cash-book/cash-book.module';
import { OrderModule } from './order/order.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CostModule } from './cost/cost.module';
import { ChargeModule } from './charge/charge.module';
import { QrisModule } from './qris/qris.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    EmployeeModule,
    OtpModule,
    ProductModule,
    RegencyModule,
    CategoryModule,
    FileModule,
    CashBookModule,
    OrderModule,
    SubscriptionModule,
    CostModule,
    ChargeModule,
    QrisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
