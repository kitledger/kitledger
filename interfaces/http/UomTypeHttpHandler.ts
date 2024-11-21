import { type Context, Hono } from '@hono/hono';
import { create, validateCreation } from '../../domain/actions/UomTypeActions.ts';
import { v7 as uuid } from 'uuid';

const router = new Hono();
const GENERIC_ERROR_MESSAGE = 'Internal server error';

router.post('/', async (c: Context) => {
	const body = await c.req.json();
	body.id = uuid();

	const validation_result = await validateCreation(body);

	// Return 422 if Zod Error
	if (!validation_result.success) {
		return c.json(validation_result.error.issues, 422);
	}

	try {
		const result = await create(validation_result.data);
		return c.json(result[0]);
	} catch (error) {
		// IMPLEMENT_LOGGER
		console.error(error);
		return c.json({ message: GENERIC_ERROR_MESSAGE }, 500);
	}
});

export default router;
