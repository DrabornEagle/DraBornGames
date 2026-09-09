import { createClient } from 'npm:@supabase/supabase-js@2';

const dkd_cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

const dkd_json = (dkd_body: unknown, dkd_status = 200) => new Response(JSON.stringify(dkd_body), { status: dkd_status, headers: dkd_cors });

Deno.serve(async (dkd_request: Request) => {
  if (dkd_request.method === 'OPTIONS') return new Response('ok', { headers: dkd_cors });
  if (dkd_request.method !== 'POST') return dkd_json({ dkd_error: 'method_not_allowed' }, 405);

  try {
    const dkd_url = Deno.env.get('SUPABASE_URL') ?? '';
    const dkd_serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!dkd_url || !dkd_serviceKey) return dkd_json({ dkd_error: 'server_not_configured' }, 500);

    const dkd_authHeader = dkd_request.headers.get('Authorization') ?? '';
    const dkd_token = dkd_authHeader.startsWith('Bearer ') ? dkd_authHeader.slice(7) : '';
    if (!dkd_token) return dkd_json({ dkd_error: 'authentication_required' }, 401);

    const dkd_admin = createClient(dkd_url, dkd_serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: dkd_userData, error: dkd_userError } = await dkd_admin.auth.getUser(dkd_token);
    if (dkd_userError || !dkd_userData.user) return dkd_json({ dkd_error: 'invalid_session' }, 401);

    const dkd_user = dkd_userData.user;
    const dkd_body = await dkd_request.json().catch(() => ({})) as Record<string, unknown>;
    const dkd_action = String(dkd_body.dkd_action ?? 'bootstrap');
    const dkd_userMetadata = (dkd_user.user_metadata && typeof dkd_user.user_metadata === 'object') ? dkd_user.user_metadata as Record<string, unknown> : {};
    const dkd_role = String(dkd_user.app_metadata?.last_mile_role ?? '') === 'admin' ? 'admin' : 'player';

    const { error: dkd_profileError } = await dkd_admin.rpc('dkd_lastmile_ensure_profile', {
      dkd_user_id: dkd_user.id,
      dkd_email: dkd_user.email ?? '',
      dkd_full_name: String(dkd_userMetadata.dkd_full_name ?? ''),
      dkd_username: String(dkd_userMetadata.dkd_username ?? ''),
      dkd_company_name: String(dkd_userMetadata.dkd_company_name ?? ''),
      dkd_phone: String(dkd_userMetadata.dkd_phone ?? ''),
      dkd_role,
    });
    if (dkd_profileError) throw dkd_profileError;

    if (dkd_action === 'health') return dkd_json({ dkd_ok: true, dkd_version: '0.5', dkd_user_id: dkd_user.id, dkd_role });

    if (dkd_action === 'bootstrap') {
      const { data: dkd_data, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_bootstrap', { dkd_user_id: dkd_user.id });
      if (dkd_error) throw dkd_error;
      return dkd_json({ dkd_ok: true, dkd_data });
    }

    if (dkd_action === 'save_progress') {
      const dkd_state = (dkd_body.dkd_game_state && typeof dkd_body.dkd_game_state === 'object') ? dkd_body.dkd_game_state as Record<string, unknown> : {};
      if (JSON.stringify(dkd_state).length > 1_500_000) return dkd_json({ dkd_error: 'save_too_large' }, 413);
      const dkd_xp = Math.max(0, Math.floor(Number(dkd_state.dkd_xp ?? 0) || 0));
      const dkd_level = 1 + Math.floor(Math.sqrt(dkd_xp / 160));
      const dkd_wallet = Math.max(0, Math.floor(Number(dkd_state.dkd_wallet ?? 0) || 0));
      const dkd_deliveries = Math.max(0, Math.floor(Number(dkd_state.dkd_deliveries ?? 0) || 0));
      const { data: dkd_saved, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_save_progress', { dkd_user_id: dkd_user.id, dkd_game_state: dkd_state, dkd_level, dkd_xp, dkd_wallet, dkd_deliveries });
      if (dkd_error) throw dkd_error;
      return dkd_json({ dkd_ok: Boolean(dkd_saved), dkd_synced_at: new Date().toISOString() });
    }

    if (dkd_action === 'submit_reward_claim') {
      const dkd_rewardId = String(dkd_body.dkd_reward_id ?? '').slice(0, 100);
      const dkd_finalScore = Math.max(0, Math.min(100000, Math.floor(Number(dkd_body.dkd_final_score ?? 0) || 0)));
      if (!/^dkd_[a-z0-9_]+$/i.test(dkd_rewardId) || dkd_finalScore <= 0) return dkd_json({ dkd_error: 'invalid_reward_claim' }, 400);
      const { data: dkd_claim, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_submit_reward_claim', {
        dkd_user_id: dkd_user.id,
        dkd_reward_id: dkd_rewardId,
        dkd_final_score: dkd_finalScore,
      });
      if (dkd_error) throw dkd_error;
      return dkd_json({ dkd_ok: true, dkd_data: dkd_claim });
    }

    if (dkd_action === 'toggle_demo') {
      if (dkd_role !== 'admin') return dkd_json({ dkd_error: 'admin_required' }, 403);
      const dkd_enabled = dkd_body.dkd_enabled === true;
      const { error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_toggle_demo', { dkd_user_id: dkd_user.id, dkd_enabled });
      if (dkd_error) throw dkd_error;
      const { data: dkd_bootstrap, error: dkd_bootstrapError } = await dkd_admin.rpc('dkd_lastmile_bootstrap', { dkd_user_id: dkd_user.id });
      if (dkd_bootstrapError) throw dkd_bootstrapError;
      return dkd_json({ dkd_ok: true, dkd_data: dkd_bootstrap });
    }

    if (dkd_action === 'claim_job') {
      const dkd_level = Math.max(1, Math.min(999, Math.floor(Number(dkd_body.dkd_level ?? 1) || 1)));
      const { data: dkd_job, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_claim_job', { dkd_user_id: dkd_user.id, dkd_level });
      if (dkd_error) throw dkd_error;
      return dkd_json({ dkd_ok: true, dkd_data: dkd_job });
    }

    if (['accept_job','cancel_job','complete_job'].includes(dkd_action)) {
      const dkd_jobId = String(dkd_body.dkd_job_id ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(dkd_jobId)) return dkd_json({ dkd_error: 'invalid_job_id' }, 400);
      if (dkd_action === 'accept_job') {
        const { data: dkd_job, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_accept_job', { dkd_user_id: dkd_user.id, dkd_job_id: dkd_jobId });
        if (dkd_error) throw dkd_error;
        return dkd_json({ dkd_ok: true, dkd_data: dkd_job });
      }
      if (dkd_action === 'cancel_job') {
        const dkd_reason = String(dkd_body.dkd_reason ?? 'user_cancelled').slice(0, 120);
        const { data: dkd_job, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_cancel_job', { dkd_user_id: dkd_user.id, dkd_job_id: dkd_jobId, dkd_reason });
        if (dkd_error) throw dkd_error;
        return dkd_json({ dkd_ok: true, dkd_data: dkd_job });
      }
      const dkd_metrics = (dkd_body.dkd_metrics && typeof dkd_body.dkd_metrics === 'object') ? dkd_body.dkd_metrics : {};
      const { data: dkd_job, error: dkd_error } = await dkd_admin.rpc('dkd_lastmile_complete_job', { dkd_user_id: dkd_user.id, dkd_job_id: dkd_jobId, dkd_metrics });
      if (dkd_error) throw dkd_error;
      return dkd_json({ dkd_ok: true, dkd_data: dkd_job });
    }

    return dkd_json({ dkd_error: 'unknown_action' }, 400);
  } catch (dkd_error) {
    console.error('dkd-last-mile-api', dkd_error);
    return dkd_json({ dkd_error: dkd_error instanceof Error ? dkd_error.message : 'server_error' }, 500);
  }
});