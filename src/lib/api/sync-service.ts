import { supabase } from '../supabase-client';

export interface SyncJob {
  id: string;
  company_id: string;
  platform_name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  error_message?: string;
  reviews_fetched: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export const SyncService = {
  async getSyncJobs(companyId: string, limit: number = 100): Promise<SyncJob[]> {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getSyncJobsByPlatform(
    companyId: string,
    platformName: string,
    limit: number = 50
  ): Promise<SyncJob[]> {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('*')
      .eq('company_id', companyId)
      .eq('platform_name', platformName)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getLatestSyncJob(companyId: string, platformName: string): Promise<SyncJob | null> {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('*')
      .eq('company_id', companyId)
      .eq('platform_name', platformName)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getSyncStats(companyId: string) {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('status, reviews_fetched, platform_name')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      totalJobs: data?.length || 0,
      successfulJobs: 0,
      failedJobs: 0,
      totalReviewsFetched: 0,
      byPlatform: {} as Record<string, any>,
    };

    if (!data) return stats;

    for (const job of data) {
      if (job.status === 'success') {
        stats.successfulJobs++;
        stats.totalReviewsFetched += job.reviews_fetched || 0;
      } else if (job.status === 'failed') {
        stats.failedJobs++;
      }

      const platform = job.platform_name;
      if (!stats.byPlatform[platform]) {
        stats.byPlatform[platform] = {
          successful: 0,
          failed: 0,
          totalReviews: 0,
        };
      }

      if (job.status === 'success') {
        stats.byPlatform[platform].successful++;
        stats.byPlatform[platform].totalReviews += job.reviews_fetched || 0;
      } else if (job.status === 'failed') {
        stats.byPlatform[platform].failed++;
      }
    }

    return stats;
  },

  async getSuccessRate(companyId: string, days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('sync_jobs')
      .select('status')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const successful = data.filter((j) => j.status === 'success').length;
    return (successful / data.length) * 100;
  },
};
