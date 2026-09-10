// DraBornGo / Last Mile v0.3 home/garage refinement.
// Loaded after the visual hotfix so these UI, camera and delivery choices are
// authoritative for the current Expo Go development build.

const dkd_v03_homeStyle = document.createElement('style');
dkd_v03_homeStyle.id = 'dkd-v03-home-refine-style';
dkd_v03_homeStyle.textContent = `
  .dkd-player-name{
    position:relative;
    display:flex;
    align-items:baseline;
    flex-wrap:wrap;
    gap:0 8px;
    width:max-content;
    max-width:94%;
    padding:2px 0 4px 14px;
    margin:11px 0 10px!important;
    font-size:clamp(29px,8vw,39px)!important;
    line-height:1.02!important;
    letter-spacing:-1.55px!important;
    text-transform:none!important;
  }
  .dkd-player-name:before{
    content:'';
    position:absolute;
    left:0;
    top:4px;
    bottom:5px;
    width:4px;
    border-radius:5px;
    background:#79c8ff;
  }
  .dkd-player-name:after{
    content:'';
    position:absolute;
    left:14px;
    bottom:0;
    width:46px;
    height:3px;
    border-radius:4px;
    background:#78e1c5;
  }
  .dkd-player-name>span{color:#e5efff;font-weight:900}
  .dkd-player-name>b{color:#8fe3ca;font-weight:900}

  .dkd-location.dkd-location-premium{
    top:8px;
    left:auto;
    right:18px;
    min-width:150px;
    justify-content:flex-start;
    gap:9px;
    padding:8px 11px;
    border:1px solid #6388ad;
    border-radius:13px;
    background:#203a55ee;
    color:#8fd5ff;
    letter-spacing:0;
  }
  .dkd-location-premium>svg{
    width:17px;
    height:17px;
    color:#75dfc5;
  }
  .dkd-location-premium>span{
    display:flex;
    flex-direction:column;
    gap:1px;
    line-height:1.15;
  }
  .dkd-location-premium b{
    color:#d9ebff;
    font-size:11px;
    font-weight:900;
    letter-spacing:1.15px;
  }
  .dkd-location-premium small{
    color:#8fe3ca;
    font-size:8px;
    font-weight:800;
    letter-spacing:.95px;
  }
  .dkd-home .dkd-vehicle-label{top:59px}

  @media(max-width:370px){
    .dkd-player-name{font-size:27px!important;max-width:96%;gap:0 6px}
    .dkd-location.dkd-location-premium{right:15px;min-width:138px;padding:7px 9px}
    .dkd-home .dkd-vehicle-label{top:56px;right:15px}
  }
  @media(max-height:740px){
    .dkd-player-name{font-size:29px!important;margin:8px 0!important}
    .dkd-location.dkd-location-premium{top:5px}
    .dkd-home .dkd-vehicle-label{top:52px}
  }
`;
document.head.appendChild(dkd_v03_homeStyle);

// The large white heading belongs to the courier, not the courier company.
// Keep the first name cool-white and the remaining name mint so the identity is
// immediately readable without using gradients or glow effects.
const dkd_v03_homeBaseView = dkd_Game.prototype.dkd_view_home;
dkd_Game.prototype.dkd_view_home = function(...dkd_args) {
  let dkd_html = dkd_v03_homeBaseView.apply(this, dkd_args);
  const dkd_profile = this.dkd_state?.dkd_profile || {};
  const dkd_fullName = String(dkd_profile.dkd_name || dkd_profile.dkd_username || 'Yeni Kurye').trim();
  const dkd_nameParts = dkd_fullName.split(/\s+/).filter(Boolean);
  const dkd_firstName = dkd_escape(dkd_nameParts.shift() || 'Kurye');
  const dkd_remainingName = dkd_escape(dkd_nameParts.join(' '));
  const dkd_playerHeading = `<h1 class="dkd-player-name" aria-label="${dkd_escape(dkd_fullName)}"><span>${dkd_firstName}</span>${dkd_remainingName ? `<b>${dkd_remainingName}</b>` : ''}</h1>`;
  const dkd_companyHeading = `<h1>${dkd_escape(dkd_profile.dkd_company || '')}</h1>`;
  if (dkd_companyHeading !== '<h1></h1>') dkd_html = dkd_html.replace(dkd_companyHeading, dkd_playerHeading);

  const dkd_oldLocation = `<div class="dkd-location">${dkd_icon('pin',13)} ANKARA · KURYE MERKEZİ</div>`;
  const dkd_newLocation = `<div class="dkd-location dkd-location-premium" aria-label="Ankara Kurye Merkezi">${dkd_icon('pin',15)}<span><b>ANKARA</b><small>KURYE MERKEZİ</small></span></div>`;
  dkd_html = dkd_html.replace(dkd_oldLocation, dkd_newLocation);
  return dkd_html;
};

function dkd_v03_refineCompanySign(dkd_scene) {
  if (!dkd_scene?.dkd_companySign) return;
  // The company sign is the yellow/tinted wall sign, separate from the player's
  // full-name heading in the HTML interface.
  dkd_scene.dkd_companySign.scale.set(1.16, 1.16, 1);
  dkd_scene.dkd_companySign.position.x = -3.15;
}

// Make the company wall sign slightly larger and start the courier-centre camera
// around ten percent closer than the v0.3 wide default. Pinch zoom still works.
const dkd_v03_homeBaseBuildHub = dkd_Scene.prototype.dkd_buildHub;
dkd_Scene.prototype.dkd_buildHub = function(...dkd_args) {
  const dkd_result = dkd_v03_homeBaseBuildHub.apply(this, dkd_args);
  if (this.dkd_v03GarageZoom == null) this.dkd_v03GarageZoom = 1.03;
  dkd_v03_refineCompanySign(this);
  return dkd_result;
};

const dkd_v03_homeBaseRefreshBrand = dkd_Scene.prototype.dkd_refreshBrand;
dkd_Scene.prototype.dkd_refreshBrand = function(...dkd_args) {
  const dkd_result = dkd_v03_homeBaseRefreshBrand.apply(this, dkd_args);
  dkd_v03_refineCompanySign(this);
  return dkd_result;
};

// Restore the original v0.2/v0.101 delivery flow. Arriving near the destination
// no longer force-sets route completion or zero speed. The player must complete
// mandatory story stops, reach the entrance, slow down and press TESLİM ET when
// dkd_canDeliver says the package can be handed over.
dkd_Game.prototype.dkd_updateHud = dkd_v03_baseUpdateHud;
