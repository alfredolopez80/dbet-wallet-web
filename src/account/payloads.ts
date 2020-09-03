import { PagedPayload } from '@/modules/shared/models/pagedPayload';

export interface ListenAccountChangesPayload {
  addresses: string[];
  chainTag: string;
  balance: string;
  error: Error;
}
