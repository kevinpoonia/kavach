import { useQuery } from '@tanstack/react-query';
import { SyncService } from '../api/sync-service';

export const useSyncJobs = (companyId: string, limit: number = 100) => {
  return useQuery({
    queryKey: ['sync-jobs', companyId],
    queryFn: () => SyncService.getSyncJobs(companyId, limit),
    enabled: !!companyId,
  });
};

export const useSyncJobsByPlatform = (
  companyId: string,
  platformName: string,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['sync-jobs-platform', companyId, platformName],
    queryFn: () =>
      SyncService.getSyncJobsByPlatform(companyId, platformName, limit),
    enabled: !!companyId && !!platformName,
  });
};

export const useLatestSyncJob = (companyId: string, platformName: string) => {
  return useQuery({
    queryKey: ['latest-sync-job', companyId, platformName],
    queryFn: () => SyncService.getLatestSyncJob(companyId, platformName),
    enabled: !!companyId && !!platformName,
  });
};

export const useSyncStats = (companyId: string) => {
  return useQuery({
    queryKey: ['sync-stats', companyId],
    queryFn: () => SyncService.getSyncStats(companyId),
    enabled: !!companyId,
  });
};

export const useSyncSuccessRate = (companyId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['sync-success-rate', companyId, days],
    queryFn: () => SyncService.getSuccessRate(companyId, days),
    enabled: !!companyId,
  });
};
