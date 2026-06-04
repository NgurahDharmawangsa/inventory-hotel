import { LocationsRepository } from "@/repositories/locations.repository";
import { LocationsValidator } from "@/validators/locations.validator";
import { Location } from "@/types/database.types";

export class LocationsService {
  /**
   * Fetch all locations.
   */
  static async getAllLocations(filters?: { query?: string; type?: string }): Promise<Location[]> {
    return LocationsRepository.findAll(filters);
  }

  /**
   * Fetch a single location by ID.
   */
  static async getLocationById(id: string): Promise<Location | null> {
    return LocationsRepository.findById(id);
  }

  /**
   * Create a new location.
   */
  static async createLocation(data: any): Promise<Location> {
    const validatedData = LocationsValidator.validateCreate(data);

    // Check if name already exists
    const exists = await LocationsRepository.existsByName(validatedData.name);
    if (exists) {
      throw new Error("A location with this name already exists.");
    }

    return LocationsRepository.create(validatedData);
  }

  /**
   * Update an existing location.
   */
  static async updateLocation(id: string, data: any): Promise<Location> {
    const validatedData = LocationsValidator.validateUpdate(data);

    // If name is being updated, check if it already exists
    if (validatedData.name) {
      const exists = await LocationsRepository.existsByName(validatedData.name, id);
      if (exists) {
        throw new Error("A location with this name already exists.");
      }
    }

    return LocationsRepository.update(id, validatedData);
  }

  /**
   * Delete a location.
   */
  static async deleteLocation(id: string): Promise<void> {
    return LocationsRepository.delete(id);
  }

  /**
   * Fetch distinct location types.
   */
  static async getDistinctTypes(): Promise<string[]> {
    return LocationsRepository.findDistinctTypes();
  }
}