import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DevicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // async deleteSessionByUserId(deviceId: string, userId: string): Promise<any> {
  //   return this.prisma.user.deleteMany({ userId, deviceId });
  // }
  //
  // async updateUserSessionById(newSession: DevicesModal): Promise<UpdateResult> {
  //   return this.devicesModel.updateOne(
  //     { userId: newSession.userId, deviceId: newSession.deviceId },
  //     { $set: { ...newSession } },
  //   );
  // }
  //
  // async findAllUserDevicesByUserId(userId: string): Promise<DevicesModal[]> {
  //   return this.devicesModel.find({ userId }, { _id: 0, userId: 0 });
  // }
  //
  // async findDeviceByDeviceId(deviceId: string): Promise<DevicesModal | null> {
  //   return this.devicesModel.findOne({ deviceId });
  // }
  //
  // async findDeviceByUserIdDeviceIdAndLastActiveDate(
  //   userId: string,
  //   deviceId: string,
  //   lastActiveDate: string,
  // ): Promise<DevicesModal> {
  //   return this.devicesModel.findOne({ userId, deviceId, lastActiveDate });
  // }
  //
  // async deleteAllDevicesById(userId, deviceId): Promise<DeleteResult> {
  //   return this.devicesModel.deleteMany({
  //     userId,
  //     deviceId: { $ne: deviceId },
  //   });
  // }
  //
  // async deleteUserSessionByUserAndDeviceId(
  //   userId: string,
  //   deviceId: string,
  // ): Promise<boolean> {
  //   const res = await this.devicesModel.deleteOne({ userId, deviceId });
  //   return res.deletedCount === 1;
  // }
  //
  // async deleteSessionsBanUserById(userId: string): Promise<DeleteResult> {
  //   return this.devicesModel.deleteMany({ userId });
  // }
}
