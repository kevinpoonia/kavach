import { supabase, callEdgeFunction } from '../supabase-client';

export interface Company {
  id: string;
  user_id: string;
  name: string;
  website?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: string;
  company_id: string;
  platform_name: string;
  business_id: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
}

export const CompanyService = {
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCompany(companyId: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) throw error;
  },

  async getPlatforms(companyId: string): Promise<Platform[]> {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addPlatform(platform: Omit<Platform, 'id' | 'created_at'>): Promise<Platform> {
    const { data, error } = await supabase
      .from('platforms')
      .insert([platform])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePlatform(platformId: string, updates: Partial<Platform>): Promise<Platform> {
    const { data, error } = await supabase
      .from('platforms')
      .update(updates)
      .eq('id', platformId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlatform(platformId: string): Promise<void> {
    const { error } = await supabase
      .from('platforms')
      .delete()
      .eq('id', platformId);

    if (error) throw error;
  },

  async triggerFetchReviews(): Promise<any> {
    return await callEdgeFunction('fetch-reviews');
  },

  async triggerSendNotifications(): Promise<any> {
    return await callEdgeFunction('send-notifications');
  },
};
