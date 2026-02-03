import { supabase } from '../supabase-client';

export interface ApiKeyConfig {
  id: string;
  company_id: string;
  platform_name: string;
  key_name: string;
  encrypted_value: string;
  created_at: string;
}

export const ApiKeyService = {
  async getApiKeys(companyId: string, platformName?: string): Promise<ApiKeyConfig[]> {
    let query = supabase
      .from('api_keys')
      .select('id, company_id, platform_name, key_name, created_at')
      .eq('company_id', companyId);

    if (platformName) {
      query = query.eq('platform_name', platformName);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveApiKey(
    companyId: string,
    platformName: string,
    keyName: string,
    keyValue: string
  ): Promise<ApiKeyConfig> {
    // Basic client-side encoding (in production, use server-side encryption)
    const encodedValue = btoa(keyValue);

    // Check if key exists
    const { data: existing } = await supabase
      .from('api_keys')
      .select('id')
      .eq('company_id', companyId)
      .eq('platform_name', platformName)
      .eq('key_name', keyName)
      .maybeSingle();

    if (existing) {
      // Update existing key
      const { data, error } = await supabase
        .from('api_keys')
        .update({ encrypted_value: encodedValue })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new key
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            company_id: companyId,
            platform_name: platformName,
            key_name: keyName,
            encrypted_value: encodedValue,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async deleteApiKey(keyId: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  },

  async validateApiKey(
    platformName: string,
    keyValue: string
  ): Promise<boolean> {
    try {
      // This would normally validate against the actual API
      // For now, just check if it's not empty
      return keyValue.length > 0;
    } catch {
      return false;
    }
  },

  // Platform-specific key handlers
  async getRedditKeys(companyId: string) {
    const keys = await this.getApiKeys(companyId, 'reddit');
    return {
      clientId: keys.find((k) => k.key_name === 'client_id')?.encrypted_value,
      clientSecret: keys.find((k) => k.key_name === 'client_secret')?.encrypted_value,
    };
  },

  async saveRedditKeys(
    companyId: string,
    clientId: string,
    clientSecret: string
  ): Promise<void> {
    await this.saveApiKey(companyId, 'reddit', 'client_id', clientId);
    await this.saveApiKey(companyId, 'reddit', 'client_secret', clientSecret);
  },

  async getGoogleKey(companyId: string): Promise<string | undefined> {
    const keys = await this.getApiKeys(companyId, 'google');
    return keys.find((k) => k.key_name === 'api_key')?.encrypted_value;
  },

  async saveGoogleKey(companyId: string, apiKey: string): Promise<void> {
    await this.saveApiKey(companyId, 'google', 'api_key', apiKey);
  },

  async getTwitterToken(companyId: string): Promise<string | undefined> {
    const keys = await this.getApiKeys(companyId, 'twitter');
    return keys.find((k) => k.key_name === 'bearer_token')?.encrypted_value;
  },

  async saveTwitterToken(companyId: string, bearerToken: string): Promise<void> {
    await this.saveApiKey(companyId, 'twitter', 'bearer_token', bearerToken);
  },

  async getOpenAIKey(companyId: string): Promise<string | undefined> {
    const keys = await this.getApiKeys(companyId, 'openai');
    return keys.find((k) => k.key_name === 'api_key')?.encrypted_value;
  },

  async saveOpenAIKey(companyId: string, apiKey: string): Promise<void> {
    await this.saveApiKey(companyId, 'openai', 'api_key', apiKey);
  },

  async getGeminiKey(companyId: string): Promise<string | undefined> {
    const keys = await this.getApiKeys(companyId, 'gemini');
    return keys.find((k) => k.key_name === 'api_key')?.encrypted_value;
  },

  async saveGeminiKey(companyId: string, apiKey: string): Promise<void> {
    await this.saveApiKey(companyId, 'gemini', 'api_key', apiKey);
  },

  async getResendKey(companyId: string): Promise<string | undefined> {
    const keys = await this.getApiKeys(companyId, 'resend');
    return keys.find((k) => k.key_name === 'api_key')?.encrypted_value;
  },

  async saveResendKey(companyId: string, apiKey: string): Promise<void> {
    await this.saveApiKey(companyId, 'resend', 'api_key', apiKey);
  },

  async getTwilioKeys(companyId: string) {
    const keys = await this.getApiKeys(companyId, 'twilio');
    return {
      accountSid: keys.find((k) => k.key_name === 'account_sid')?.encrypted_value,
      authToken: keys.find((k) => k.key_name === 'auth_token')?.encrypted_value,
    };
  },

  async saveTwilioKeys(
    companyId: string,
    accountSid: string,
    authToken: string
  ): Promise<void> {
    await this.saveApiKey(companyId, 'twilio', 'account_sid', accountSid);
    await this.saveApiKey(companyId, 'twilio', 'auth_token', authToken);
  },
};
