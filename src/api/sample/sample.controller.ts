
import { Request, Response } from 'express';
import { SampleService } from './sample.service';

/**
 * Handles incoming HTTP requests and sends back responses.
 * It acts as a bridge between the routes and the service layer.
 */
export const SampleController = {
  /**
   * Handles the request to get all samples for the logged-in agent.
   */
  getAgentSamples: async (req: Request, res: Response) => {
    try {
      // For now, we'll pass the agentId as a query parameter for testing.
      // LATER, this will come from `req.auth.userId` after implementing auth.
      const agentId = req.query.agentId as string;
      if (!agentId) {
        return res.status(400).json({ message: 'Agent ID is required.' });
      }

      const samples = await SampleService.getSamplesByAgent(agentId);
      res.status(200).json(samples);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Failed to fetch samples.', error: err.message });
    }
  },

  /**
   * Handles the request to add a new sample.
   */
  addSample: async (req: Request, res: Response) => {
    try {
      // The request body should match the AddSampleBody interface
      const sampleData = req.body;

      // Basic validation
      if (!sampleData.patientName || !sampleData.sampleType || !sampleData.hospitalId || !sampleData.agentId) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }

      const newSample = await SampleService.addSample(sampleData);
      res.status(201).json(newSample); // 201 Created status
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Failed to add sample.', error: err.message });
    }
  },

  /**
   * Handles the request to mark a sample as collected.
   */
  markSampleCollected: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Get sample ID from URL parameter
      
      // For now, agentId comes from the body. LATER, from `req.auth.userId`.
      const { agentId } = req.body; 
      if (!agentId) {
          return res.status(400).json({ message: 'Agent ID is required.' });
      }

      const updatedSample = await SampleService.markAsCollected(id, agentId);
      res.status(200).json(updatedSample);
    } catch (error) {
      const err = error as Error;
      // Handle the specific error from the service for better client feedback
      if (err.message.includes('not found or you do not have permission')) {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Failed to update sample.', error: err.message });
    }
  },
};
