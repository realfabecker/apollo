import { IVehicleRepository, IVehicleService } from "@ports/ports";
import { inject, injectable } from "inversify";
import { Vehicle, VehicleCreateDTO, VehicleUpdateDTO } from "@domain/vehicle";
import { Types } from "@ports/types";
import Boom from "@hapi/boom";

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(Types.VehicleRepository)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}
  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findById(id);
  }
  async create(data: VehicleCreateDTO): Promise<Vehicle> {
    return this.vehicleRepository.create(data);
  }
  async list(): Promise<Vehicle[]> {
    return this.vehicleRepository.list();
  }
  async remove(id: string): Promise<void> {
    const model = await this.vehicleRepository.findById(id);
    if (!model) throw Boom.notFound();
    return this.vehicleRepository.remove(model.id);
  }
  async update(id: string, data: VehicleUpdateDTO): Promise<Vehicle> {
    const model = await this.vehicleRepository.findById(id);
    if (!model) throw Boom.notFound();
    return this.vehicleRepository.update(model.id, data);
  }
}
