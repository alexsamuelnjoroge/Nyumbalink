import { Request, Response } from 'express';
import { sendSuccess, sendNotFound, sendError, sendForbidden } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authenticate';
import * as ListingService from '../services/listing.service';

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const result = await ListingService.searchListings(req.query as ListingService.SearchQuery);
    sendSuccess(res, result);
  } catch (err) {
    sendError(res, 'Failed to fetch listings', 500);
  }
}

export async function getOne(req: Request, res: Response): Promise<void> {
  try {
    const listing = await ListingService.getListingById(String(req.params['id']));
    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }
    sendSuccess(res, listing);
  } catch {
    sendError(res, 'Failed to fetch listing', 500);
  }
}

export async function recordWhatsappTap(req: Request, res: Response): Promise<void> {
  try {
    await ListingService.recordWhatsappTap(String(req.params['id']));
    sendSuccess(res, { recorded: true });
  } catch {
    // Non-critical — don't error the client
    sendSuccess(res, { recorded: false });
  }
}

export async function confirmAvailability(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthenticatedRequest;
  const confirmed = await ListingService.confirmAvailability(String(req.params['id']), userId);

  if (!confirmed) {
    sendForbidden(res, 'Listing not found or you do not own it');
    return;
  }
  sendSuccess(res, { confirmed: true });
}
