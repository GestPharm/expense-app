import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password, role, organization_id } = await req.json();

  // 1. create auth user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // 2. insert member
  await supabaseAdmin.from('members').insert([
    {
      user_id: data.user.id,
      organization_id,
      role,
      must_change_password: true
    }
  ]);

  return Response.json({ success: true });
}