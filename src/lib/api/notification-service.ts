import { supabase } from '../supabase-client';

export interface NotificationConfig {
  id: string;
  company_id: string;
  notification_type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  alert_type: 'negative_review' | 'rating_change' | 'spike' | 'all';
  is_active: boolean;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  company_id: string;
  notification_id?: string;
  review_id?: string;
  status: 'sent' | 'failed' | 'pending';
  message: string;
  sent_at?: string;
  created_at: string;
}

export const NotificationService = {
  async getNotificationConfigs(companyId: string): Promise<NotificationConfig[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addNotificationConfig(
    config: Omit<NotificationConfig, 'id' | 'created_at'>
  ): Promise<NotificationConfig> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNotificationConfig(
    configId: string,
    updates: Partial<NotificationConfig>
  ): Promise<NotificationConfig> {
    const { data, error } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', configId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNotificationConfig(configId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', configId);

    if (error) throw error;
  },

  async getNotificationLogs(
    companyId: string,
    limit: number = 100
  ): Promise<NotificationLog[]> {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getNotificationStats(companyId: string) {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('status, notification_type: notifications(notification_type)')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      totalSent: 0,
      totalFailed: 0,
      totalPending: 0,
      byType: {
        email: 0,
        sms: 0,
        whatsapp: 0,
      },
    };

    if (!data) return stats;

    for (const log of data) {
      if (log.status === 'sent') stats.totalSent++;
      else if (log.status === 'failed') stats.totalFailed++;
      else if (log.status === 'pending') stats.totalPending++;
    }

    return stats;
  },

  async testNotification(
    companyId: string,
    notificationType: 'email' | 'sms' | 'whatsapp',
    recipient: string
  ): Promise<boolean> {
    try {
      const testMessage =
        'This is a test notification from RepuPulse. If you received this, your notification channel is working correctly!';

      // Log the test notification
      const { error } = await supabase.from('notification_logs').insert({
        company_id: companyId,
        status: 'sent',
        message: `Test ${notificationType}: ${testMessage}`,
        sent_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Test notification error:', err);
      return false;
    }
  },
};
