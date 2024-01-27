import { IVehicleRepository } from "@ports/ports";
import { injectable } from "inversify";
import { Vehicle, VehicleCreateDTO, VehicleUpdateDTO } from "@domain/vehicle";
import Boom from "@hapi/boom";
import fs from "fs";
import path from "path";
import os from "os";

@injectable()
export class VehicleFileSystemRepository implements IVehicleRepository {
  private readonly store = path.join(os.tmpdir(), "apollo", "vehicles");

  constructor() {
    if (!fs.existsSync(this.store)) {
      fs.mkdirSync(this.store, { recursive: true });
    }
  }

  async list(): Promise<Vehicle[]> {
    const smbs = fs.readdirSync(this.store, { encoding: "utf-8" });
    return smbs
      .map((item) => {
        const data = fs.readFileSync(path.join(this.store, item), {
          encoding: "utf8",
        });
        return data && JSON.parse(data);
      })
      .filter((item) => !!item);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const data = fs.readFileSync(path.join(this.store, id + ".json"), {
      encoding: "utf8",
    });
    return (data && JSON.parse(data)) || null;
  }

  async remove(id: string): Promise<void> {
    fs.rmSync(path.join(this.store, id + ".json"));
  }

  async update(id: string, data: VehicleUpdateDTO): Promise<Vehicle> {
    const vehicle = await this.findById(id);
    if (!vehicle) throw Boom.notFound();
    const payload = { ...vehicle, ...data };
    fs.writeFileSync(
      path.join(this.store, id + ".json"),
      JSON.stringify(payload),
    );
    return payload;
  }

  async create(data: VehicleCreateDTO): Promise<Vehicle> {
    const id = Math.random().toString(36).slice(2);
    const vehicle = { id, ...data };
    fs.writeFileSync(
      path.join(this.store, id + ".json"),
      JSON.stringify(vehicle),
    );
    return vehicle;
  }
}
