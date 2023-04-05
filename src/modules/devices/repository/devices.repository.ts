import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { Devices, User } from '@prisma/client';

@Injectable()
export class DevicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUserSession(
    ip: string,
    title: string,
    lastActiveData: string,
    deviceId: string,
    userId: string,
  ): Promise<Devices> {
    return this.prisma.devices.create({
      data: {
        id: randomUUID(),
        ip: ip,
        title: title,
        lastActiveData: lastActiveData,
        deviceId: deviceId,
        userId: userId,
      },
    });
  }

  async deleteAllDevicesById(userId, deviceId): Promise<void> {
    await this.prisma.devices.deleteMany({
      where: {
        userId: userId,
        NOT: {
          deviceId: deviceId,
        },
      },
    });
  }

  async findDeviceByUserIdDeviceIdAndLastActiveDate(
    userId: string,
    deviceId: string,
    lastActiveData: string,
  ): Promise<Devices> {
    return this.prisma.devices.findFirst({
      where: {
        userId,
        deviceId,
        lastActiveData,
      },
    });
  }

  async deleteSessionByDeviceId(deviceId: string) {
    return this.prisma.devices.deleteMany({ where: { deviceId } });
  }

  async findDeviceByDeviceId(deviceId: string): Promise<Devices> {
    return this.prisma.devices.findUnique({ where: { deviceId } });
  }

  async findAllUserDevicesByUserId(userId: string): Promise<Devices[]> {
    return this.prisma.devices.findMany({ where: { userId } });
  }

  async deleteUserSessionByUserAndDeviceId(userId: string, deviceId: string) {
    return this.prisma.devices.deleteMany({
      where: { userId, deviceId },
    });
  }

  async updateUserSessionById(
    ip: string,
    title: string,
    lastActiveData: string,
    deviceId: string,
    userId: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        devices: {
          update: {
            where: { deviceId },
            data: { ip, title, lastActiveData },
          },
        },
      },
    });
  }

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

  // async deleteSessionsBanUserById(userId: string): Promise<DeleteResult> {
  //   return this.devicesModel.deleteMany({ userId });
  // }
}
