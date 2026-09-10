// DraBornGo / Last Mile v0.5 company-sign framing hotfix.
// Loaded last. Keeps the full emblem inside the garage camera and moves the company name
// left inside the sign so the emblem + name read as one compact identity block.

const dkd_v05SignLayoutPrevious = {
  dkd_sign: dkd_Scene.prototype.dkd_sign,
  dkd_buildHub: dkd_Scene.prototype.dkd_buildHub,
  dkd_refreshBrand: dkd_Scene.prototype.dkd_refreshBrand,
};

function dkd_v05SignLayoutIsCompany(dkd_scene, dkd_text) {
  const dkd_company = dkd_scene?.dkd_state?.dkd_profile?.dkd_company;
  if (!dkd_company) return false;
  return dkd_text === dkd_company.toLocaleUpperCase('tr-TR');
}

function dkd_v05SignLayoutDrawLogo(dkd_context, dkd_logo) {
  dkd_context.beginPath();
  if (dkd_logo === 'eagle') {
    dkd_context.moveTo(25, 55);
    dkd_context.lineTo(78, 76);
    dkd_context.lineTo(110, 43);
    dkd_context.lineTo(141, 76);
    dkd_context.lineTo(195, 55);
    dkd_context.lineTo(164, 115);
    dkd_context.lineTo(131, 105);
    dkd_context.lineTo(110, 143);
    dkd_context.lineTo(88, 105);
    dkd_context.lineTo(57, 115);
  } else if (dkd_logo === 'bolt') {
    dkd_context.moveTo(125, 28);
    dkd_context.lineTo(65, 103);
    dkd_context.lineTo(112, 103);
    dkd_context.lineTo(90, 156);
    dkd_context.lineTo(154, 77);
    dkd_context.lineTo(111, 77);
  } else {
    dkd_context.moveTo(110, 27);
    dkd_context.lineTo(166, 88);
    dkd_context.lineTo(110, 152);
    dkd_context.lineTo(53, 88);
  }
  dkd_context.closePath();
  dkd_context.fill();
}

function dkd_v05SignLayoutCompanySign(dkd_scene, dkd_text, dkd_width, dkd_color, dkd_height) {
  const dkd_canvas = document.createElement('canvas');
  dkd_canvas.width = 1024;
  dkd_canvas.height = 180;
  const dkd_context = dkd_canvas.getContext('2d');
  dkd_context.fillStyle = '#17252d';
  dkd_context.fillRect(0, 0, 1024, 180);
  dkd_context.fillStyle = dkd_color;
  dkd_v05SignLayoutDrawLogo(dkd_context, dkd_scene.dkd_state.dkd_brand.dkd_logo);

  // Keep only a small visual gap after the emblem. Left anchoring prevents short company
  // names such as KARTAL 01 LTD from drifting toward the right half of the board.
  dkd_context.font = 'bold 66px sans-serif';
  dkd_context.textAlign = 'left';
  dkd_context.textBaseline = 'middle';
  dkd_context.fillText(dkd_text.slice(0, 32), 228, 93, 760);

  const dkd_texture = new dkd_three.CanvasTexture(dkd_canvas);
  dkd_texture.colorSpace = dkd_three.SRGBColorSpace;
  return new dkd_three.Mesh(
    new dkd_three.PlaneGeometry(dkd_width, dkd_height),
    new dkd_three.MeshBasicMaterial({ map: dkd_texture, side: dkd_three.DoubleSide })
  );
}

dkd_Scene.prototype.dkd_sign = function dkd_v05SignLayoutSign(dkd_text, dkd_width = 6, dkd_color = '#e4ff5e', dkd_height = 1.1) {
  if (dkd_v05SignLayoutIsCompany(this, dkd_text)) {
    return dkd_v05SignLayoutCompanySign(this, dkd_text, dkd_width, dkd_color, dkd_height);
  }
  return dkd_v05SignLayoutPrevious.dkd_sign.call(this, dkd_text, dkd_width, dkd_color, dkd_height);
};

function dkd_v05SignLayoutPinCompanySign(dkd_scene) {
  if (!dkd_scene?.dkd_companySign) return;
  // Palm/road-edge pass used -4.40. Move the complete board another 1.10 world units right
  // so the emblem no longer touches the left camera crop while preserving the left-wall feel.
  dkd_scene.dkd_companySign.position.x = -3.30;
  dkd_scene.dkd_companySign.position.y = 6.72;
  dkd_scene.dkd_companySign.position.z = -6.72;
}

dkd_Scene.prototype.dkd_buildHub = function dkd_v05SignLayoutBuildHub() {
  const dkd_result = dkd_v05SignLayoutPrevious.dkd_buildHub.call(this);
  dkd_v05SignLayoutPinCompanySign(this);
  return dkd_result;
};

dkd_Scene.prototype.dkd_refreshBrand = function dkd_v05SignLayoutRefreshBrand(dkd_kind = this.dkd_bikeKind) {
  const dkd_result = dkd_v05SignLayoutPrevious.dkd_refreshBrand.call(this, dkd_kind);
  dkd_v05SignLayoutPinCompanySign(this);
  return dkd_result;
};
