/**
 * API Routes Index
 * Combines all route modules
 */

import { Router } from 'express';
import weatherRoutes from './weather.routes';

const router = Router();

// Mount weather routes
router.use('/', weatherRoutes);

export default router;
