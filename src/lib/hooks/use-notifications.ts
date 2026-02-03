import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService, NotificationConfig } from '../api/notification-service';

export const useNotificationConfigs = (companyId: string) => {
  return useQuery({
    queryKey: ['notification-configs', companyId],
    queryFn: () => NotificationService.getNotificationConfigs(companyId),
    enabled: !!companyId,
  });
};

export const useAddNotificationConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: Omit<NotificationConfig, 'id' | 'created_at'>) =>
      NotificationService.addNotificationConfig(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-configs', data.company_id],
      });
    },
  });
};

export const useUpdateNotificationConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      configId,
      updates,
      companyId,
    }: {
      configId: string;
      updates: Partial<NotificationConfig>;
      companyId: string;
    }) => NotificationService.updateNotificationConfig(configId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-configs', variables.companyId],
      });
    },
  });
};

export const useDeleteNotificationConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      configId,
      companyId,
    }: {
      configId: string;
      companyId: string;
    }) => NotificationService.deleteNotificationConfig(configId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-configs', variables.companyId],
      });
    },
  });
};

export const useNotificationLogs = (companyId: string, limit: number = 100) => {
  return useQuery({
    queryKey: ['notification-logs', companyId],
    queryFn: () => NotificationService.getNotificationLogs(companyId, limit),
    enabled: !!companyId,
  });
};

export const useNotificationStats = (companyId: string) => {
  return useQuery({
    queryKey: ['notification-stats', companyId],
    queryFn: () => NotificationService.getNotificationStats(companyId),
    enabled: !!companyId,
  });
};

export const useTestNotification = () => {
  return useMutation({
    mutationFn: ({
      companyId,
      notificationType,
      recipient,
    }: {
      companyId: string;
      notificationType: 'email' | 'sms' | 'whatsapp';
      recipient: string;
    }) =>
      NotificationService.testNotification(companyId, notificationType, recipient),
  });
};
