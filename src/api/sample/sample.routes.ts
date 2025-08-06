import { Router } from 'express';
import { SampleController } from './sample.controller';
import { authMiddleware } from '../../middleware/auth.middleware';


const router = Router();

// Route to get all samples for an agent
// Example: GET /api/samples?agentId=user_2clE...
router.get('/', SampleController.getAgentSamples);

// Route to add a new sample
// Example: POST /api/samples
router.post('/', SampleController.addSample);

// Route to mark a sample as collected
// Example: PATCH /api/samples/cuid_abc123/collect
router.patch('/:id/collect', SampleController.markSampleCollected);

export default router;
