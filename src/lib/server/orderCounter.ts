import { collections } from './database.js';
import type { OrderCounterConfig } from '$lib/types/RuntimeConfig.js';

/**
 * Gets the next order number and increments the counter atomically
 * @returns Promise<number> The next order number
 */
export async function getNextOrderNumber(): Promise<number> {
	const result = await collections.runtimeConfig.findOneAndUpdate(
		{ _id: 'orderCounter' },
		{
			$inc: { value: 1 },
			$setOnInsert: {
				_id: 'orderCounter',
				value: 1,
				description: 'Global counter for order numbers',
				createdAt: new Date(),
			},
			$set: {
				updatedAt: new Date(),
			},
		},
		{
			upsert: true,
			returnDocument: 'after',
		}
	);

	if (!result.value) {
		throw new Error('Failed to get next order number');
	}

	return result.value.value as number;
}

/**
 * Initialize the order counter if it doesn't exist
 * @param startingNumber The number to start counting from (default: 1000)
 */
export async function initializeOrderCounter(startingNumber: number = 1000): Promise<void> {
	await collections.runtimeConfig.updateOne(
		{ _id: 'orderCounter' },
		{
			$setOnInsert: {
				_id: 'orderCounter',
				value: startingNumber,
				description: 'Global counter for order numbers',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
		{ upsert: true }
	);
}

/**
 * Get the current order counter value without incrementing
 * @returns Promise<number> The current counter value
 */
export async function getCurrentOrderNumber(): Promise<number> {
	const config = await collections.runtimeConfig.findOne({ _id: 'orderCounter' });
	return (config?.value as number) || 0;
}
