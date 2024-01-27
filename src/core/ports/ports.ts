import { ApolloConfigEntity, BuildConfig } from "@domain/config";
import { Vehicle, VehicleCreateDTO, VehicleUpdateDTO } from "@domain/vehicle";
import express from "express";

export interface IHttpApp {
  listen(port: number): void;
  register(): void;
}

export interface IConsoleApp {
  run(): Promise<void>;
}

export interface ILogger {
  label(key: string, val: string): void;
  inf(message: string): void;
  err(message: string): void;
  exp(error: Error): void;
}

export interface IHttpAuth {
  authorize(request: express.Request): Promise<boolean>;
}

export interface ICacheProvider {
  set(key: string, val: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
}

export interface IJwtProvider {
  encode(data: Record<string, any>, key: string): string;
  verify(token: string, key: string): Record<string, any> | null;
  decode(token: string): Record<string, any> | null;
}

export interface IAuthService {
  auth(login: string, password: string): Promise<{ token: string }>;
  verify(token: string): Promise<boolean>;
}

export interface IBuildConfigReader {
  read(): Promise<BuildConfig | undefined>;
}

export interface IVehicleRepository {
  create(data: VehicleCreateDTO): Promise<Vehicle>;
  list(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  update(id: string, data: VehicleUpdateDTO): Promise<Vehicle>;
  remove(id: string): Promise<void>;
}

export interface IVehicleService {
  create(data: VehicleCreateDTO): Promise<Vehicle>;
  list(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  update(id: string, data: VehicleUpdateDTO): Promise<Vehicle>;
  remove(id: string): Promise<void>;
}

export interface IConfigStore<T extends object> {
  get(key: keyof T): string;
}

export type IApolloConfig = IConfigStore<ApolloConfigEntity>;
