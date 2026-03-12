import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CredentialsService } from '../credential/credential.service';
import { IFileService } from 'src/common/service/i-file.service';
import { OptimizeImageService } from 'src/common/service/optimize-image.service';
import { OpService } from 'src/common/service/op.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly credentialService: CredentialsService,
    private readonly dataSource: DataSource,

    @Inject(IFileService)
    private readonly fileService: IFileService,
    private readonly opService: OpService,
    private readonly optimizeImageService: OptimizeImageService,
  ) {}

  async create(
    createStaffDto: CreateStaffDto,
    file: Express.Multer.File,
  ): Promise<Staff> {
    const { email, password, company, branch, role, ...staffData } =
      createStaffDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let imageUrl: string | undefined;

    try {
      const credential = await this.credentialService.register(
        {
          email,
          password,
        },
        queryRunner.manager,
      );

      if (file) {
        const optimizedFile =
          await this.optimizeImageService.optimizeImage(file);
        imageUrl = await this.fileService.uploadFile(optimizedFile, 'staff');
      }

      const staff = queryRunner.manager.create(Staff, {
        ...staffData,
        image: imageUrl,
        credential: { id: credential.id },
        company: { id: company },
        branch: { id: branch },
        role: { id: role },
      });

      const savedStaff = await queryRunner.manager.save(staff);

      await queryRunner.commitTransaction();
      return savedStaff;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (imageUrl) {
        await this.fileService.deleteFile(imageUrl);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new BadRequestException(
        `Registration failed! ${errorMessage}. All changes rolled back.`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      relations: {
        company: true,
        credential: true,
        branch: true,
        role: true,
      },
      select: {
        id: true,
        staffName: true,
        phone: true,
        position: true,
        image: true,
        status: true,
        credential: {
          id: true,
          email: true,
        },
        branch: {
          id: true,
          branches_name: true,
        },
        company: {
          id: true,
          company_name: true,
          phone: true,
        },
        role: {
          id: true,
          role_name: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: {
        company: true,
        credential: true,
        branch: true,
        role: true,
      },
      select: {
        id: true,
        staffName: true,
        phone: true,
        position: true,
        image: true,
        status: true,
        credential: {
          id: true,
          email: true,
        },
        branch: {
          id: true,
          branches_name: true,
        },
        company: {
          id: true,
          company_name: true,
          phone: true,
        },
        role: {
          id: true,
          role_name: true,
        },
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff not found`);
    }

    return staff;
  }

  async update(
    id: string,
    updateStaffDto: UpdateStaffDto,
    file?: Express.Multer.File,
  ): Promise<Staff> {
    const staff = await this.findOne(id);

    const { email, password, company, branch, role, ...staffData } =
      updateStaffDto;

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    Object.assign(staff, staffData);

    if (company) {
      staff.company = { id: company } as Staff['company'];
    }

    if (branch) {
      staff.branch = { id: branch } as Staff['branch'];
    }

    if (role) {
      staff.role = { id: role } as Staff['role'];
    }

    if (file) {
      if (staff.image) {
        await this.fileService.deleteFile(staff.image);
      }

      const optimizedFile = await this.optimizeImageService.optimizeImage(file);
      staff.image = await this.fileService.uploadFile(optimizedFile, 'staff');
    }

    if ((email || password) && staff.credential) {
      await this.credentialService.updateCredential(
        staff.credential.id,
        email,
        password,
      );
    }

    return await this.opService.update<Staff>(this.staffRepository, id, staff);
  }

  async remove(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['credential'],
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    if (staff.image) {
      await this.fileService.deleteFile(staff.image);
    }

    const credentialId = staff.credential?.id;

    const deletedStaff = await this.opService.remove<Staff>(
      this.staffRepository,
      id,
    );

    if (credentialId) {
      await this.credentialService.deleteCredential(credentialId);
    }
    return deletedStaff;
  }
}
