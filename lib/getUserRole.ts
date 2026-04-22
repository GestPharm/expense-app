import { supabase } from './supabase';

export const getUserRole = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return null;

  const { data, error } = await supabase
    .from('members')
    .select('role, organization_id')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};