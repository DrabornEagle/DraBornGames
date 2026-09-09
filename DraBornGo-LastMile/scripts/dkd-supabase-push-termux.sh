#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

dkd_project_ref="${DKD_SUPABASE_PROJECT_REF:-dpcwciapowxqocvswxce}"
dkd_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dkd_migration="${1:-$dkd_root/supabase/migrations/20260909212000_dkd_lastmile_v06_customer_content.sql}"
dkd_endpoint="https://api.supabase.com/v1/projects/${dkd_project_ref}/database/query"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "HATA: SUPABASE_ACCESS_TOKEN tanımlı değil."
  echo "Supabase hesabından database_write yetkili bir Personal Access Token oluşturup şu şekilde tanımla:"
  echo "  export SUPABASE_ACCESS_TOKEN='sbp_...'"
  exit 2
fi

if [[ ! -f "$dkd_migration" ]]; then
  echo "HATA: Migration bulunamadı: $dkd_migration"
  exit 3
fi

command -v node >/dev/null 2>&1 || { echo "HATA: node bulunamadı."; exit 4; }
command -v curl >/dev/null 2>&1 || { echo "HATA: curl bulunamadı."; exit 5; }

echo "DKD Last Mile migration uygulanıyor: $(basename "$dkd_migration")"
node - "$dkd_migration" <<'DKD_NODE' | curl --fail-with-body --silent --show-error \
  --request POST "$dkd_endpoint" \
  --header "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data-binary @-
const dkd_fs = require('node:fs');
const dkd_file = process.argv[2];
const dkd_query = dkd_fs.readFileSync(dkd_file, 'utf8');
process.stdout.write(JSON.stringify({ query: dkd_query, read_only: false }));
DKD_NODE

echo
echo "Migration tamamlandı. 47 müşteri ve görev havuzu doğrulanıyor..."
node <<'DKD_NODE' | curl --fail-with-body --silent --show-error \
  --request POST "$dkd_endpoint" \
  --header "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data-binary @-
const dkd_query = `
select
  (select count(*)::int
     from "Last-Mile".dkd_lastmile_content_customers
    where dkd_id ~ '^dkd_customer_(0[1-9]|[1-3][0-9]|4[0-7])$'
      and dkd_is_demo = false
      and dkd_is_active = true) as dkd_v06_customer_count,
  (select count(*)::int
     from "Last-Mile".dkd_lastmile_mission_templates
    where dkd_id in (
      'dkd_mission_breakfast_rush','dkd_mission_lunch_tower','dkd_mission_clinic_priority','dkd_mission_pharmacy_storm',
      'dkd_mission_gallery_fragile','dkd_mission_studio_glass','dkd_mission_phone_rain','dkd_mission_server_part',
      'dkd_mission_cold_market','dkd_mission_heat_ice','dkd_mission_vet_food','dkd_mission_shelter_rain',
      'dkd_mission_boutique_evening','dkd_mission_retail_fog','dkd_mission_court_file','dkd_mission_contract_night',
      'dkd_mission_board_docs','dkd_mission_finance_close','dkd_mission_weekend_grocery','dkd_mission_heavy_grocery',
      'dkd_mission_bakery_dawn','dkd_mission_cake_fragile','dkd_mission_wedding_flowers','dkd_mission_florist_storm',
      'dkd_mission_fashion_prova','dkd_mission_laundry_storm','dkd_mission_lab_midnight','dkd_mission_lab_storm',
      'dkd_mission_workshop_closing','dkd_mission_parts_wind','dkd_mission_catering_wedding','dkd_mission_catering_storm'
    )
      and dkd_is_demo = false
      and dkd_is_active = true) as dkd_v06_mission_count;
`;
process.stdout.write(JSON.stringify({ query: dkd_query, read_only: true }));
DKD_NODE

echo
echo "Beklenen doğrulama: dkd_v06_customer_count=47, dkd_v06_mission_count=32"
