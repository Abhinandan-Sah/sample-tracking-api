import prisma from '../../utils/prisma';
import { AddSampleBody } from './sample.types';

/**
 * Contains the business logic for sample-related operations.
 * Interacts directly with the database.
 */
export const SampleService = {
  /**
   * Fetches all samples assigned to a specific agent.
   * @param agentId - The ID of the agent (from the authenticated user).
   * @returns A promise that resolves to an array of samples.
   */
  getSamplesByAgent: async (agentId: string) => {
    // Using Prisma to find all samples where the agentId matches.
    // We also include related hospital data in the response.
    return prisma.sample.findMany({
      where: {
        agentId: agentId,
      },
      include: {
        hospital: true, // Include the full hospital object
      },
    });
  },

  /**
   * Creates a new sample in the database.
   * @param sampleData - The data for the new sample.
   * @returns A promise that resolves to the newly created sample.
   */
  addSample: async (sampleData: AddSampleBody) => {
    // Using Prisma to create a new sample record.
    // The status defaults to 'PENDING' as defined in the schema.
    return prisma.sample.create({
      data: sampleData,
    });
  },

  /**
   * Marks a specific sample as 'COLLECTED'.
   * @param sampleId - The ID of the sample to update.
   * @param agentId - The ID of the agent performing the action.
   * @returns A promise that resolves to the updated sample.
   */
  markAsCollected: async (sampleId: string, agentId: string) => {
    // We use updateMany here to ensure that an agent can only mark
    // a sample that is actually assigned to them. This is a security check.
    const updateResult = await prisma.sample.updateMany({
      where: {
        id: sampleId,
        agentId: agentId, // Crucial check: only the assigned agent can update
      },
      data: {
        status: 'COLLECTED',
        collectedAt: new Date(), // Set the collection timestamp
      },
    });

    // If no records were updated, it means the sample doesn't exist
    // or doesn't belong to this agent.
    if (updateResult.count === 0) {
      throw new Error('Sample not found or you do not have permission to update it.');
    }

    // Return the updated sample record.
    return prisma.sample.findUnique({
      where: { id: sampleId },
    });
  },
};
