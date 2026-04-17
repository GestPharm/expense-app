import { supabase } from '@/lib/supabase';

export async function ensureUserOrganization(user) {
  if (!user) return null;

  // 1. check if user already has org
  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (member) {
    return member.organization_id;
  }

  // 2. create organization
  const orgName = user.email
  ? `${user.email.split('@')[0]}'s Workspace`
  : 'My Workspace';

const { data: org, error } = await supabase
  .from('organizations')
  .insert([{ name: orgName }])
  .select()
  .single();

  if (orgError) throw orgError;

  // 3. add member as admin
  const { error: memberError } = await supabase
    .from('members')
    .insert([
      {
        user_id: user.id,
        organization_id: org.id,
        role: 'manager'
      }
    ]);

  if (memberError) throw memberError;

  return org.id;
}