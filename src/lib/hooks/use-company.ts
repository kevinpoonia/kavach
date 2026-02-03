import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyService, Company, Platform } from '../api/company-service';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getCompanies(),
  });
};

export const useCompanyById = (companyId: string | null) => {
  return useQuery({
    queryKey: ['companies', companyId],
    queryFn: () => (companyId ? CompanyService.getCompanyById(companyId) : null),
    enabled: !!companyId,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) =>
      CompanyService.createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      updates,
    }: {
      companyId: string;
      updates: Partial<Company>;
    }) => CompanyService.updateCompany(companyId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', data.id] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => CompanyService.deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const usePlatforms = (companyId: string) => {
  return useQuery({
    queryKey: ['platforms', companyId],
    queryFn: () => CompanyService.getPlatforms(companyId),
    enabled: !!companyId,
  });
};

export const useAddPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platform: Omit<Platform, 'id' | 'created_at'>) =>
      CompanyService.addPlatform(platform),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['platforms', data.company_id] });
    },
  });
};

export const useUpdatePlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      platformId,
      updates,
      companyId,
    }: {
      platformId: string;
      updates: Partial<Platform>;
      companyId: string;
    }) => CompanyService.updatePlatform(platformId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['platforms', variables.companyId],
      });
    },
  });
};

export const useDeletePlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      platformId,
      companyId,
    }: {
      platformId: string;
      companyId: string;
    }) => CompanyService.deletePlatform(platformId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['platforms', variables.companyId],
      });
    },
  });
};

export const useFetchReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CompanyService.triggerFetchReviews(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['sync-jobs'] });
    },
  });
};

export const useSendNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CompanyService.triggerSendNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-logs'] });
    },
  });
};
