import { z } from "zod";

export const VehicleSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  model: z.string(),
  plate: z.string(),
  year: z.number(),
  km: z.number(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleCreateSchema = VehicleSchema.omit({
  id: true,
});
export type VehicleCreateDTO = z.infer<typeof VehicleCreateSchema>;

export const VehicleUpdateSchema = VehicleSchema.omit({
  id: true,
});
export type VehicleUpdateDTO = z.infer<typeof VehicleUpdateSchema>;
