import {
  VehicleCreateSchema,
  VehicleSchema,
  VehicleUpdateSchema,
} from "@domain/vehicle";

/**
 * @openapi
 * components:
 *   schemas:
 *     VehicleDTO:
 *       type: object
 *       properties:
 *         id:
 *            type: string
 *         name:
 *            type: string
 *         model:
 *            type: string
 *         plate:
 *            type: string
 *         year:
 *            type: number
 *         km:
 *            type: number
 */
export const VehicleDTO = VehicleSchema;

/**
 * @openapi
 * components:
 *   schemas:
 *     VehiclePostDTO:
 *       type: object
 *       properties:
 *         name:
 *            type: string
 *         model:
 *            type: string
 *         plate:
 *            type: string
 *         year:
 *            type: string
 *         km:
 *            types: string
 */
export const VehiclePostSchema = VehicleCreateSchema;

/**
 * @openapi
 * components:
 *   schemas:
 *     VehiclePutDTO:
 *       type: object
 *       properties:
 *         name:
 *            type: string
 *         model:
 *            type: string
 *         plate:
 *            type: string
 *         year:
 *            type: string
 *         km:
 *            types: string
 */
export const VehiclePutSchema = VehicleUpdateSchema;
