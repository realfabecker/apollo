import { BuildConfigSchema } from "@domain/config";

/**
 * @openapi
 * components:
 *   schemas:
 *     BuildDTO:
 *       type: object
 *       properties:
 *         build:
 *            type: object
 *            properties:
 *              date:
 *                type: string
 *              number:
 *                type: number
 *         git:
 *            type: object
 *            properties:
 *              commit:
 *                type: string
 */
export const BuildDTO = BuildConfigSchema;
