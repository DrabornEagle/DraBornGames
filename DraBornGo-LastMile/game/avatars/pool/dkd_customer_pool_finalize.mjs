// Completes the v0.6 customer portrait set with two already-bundled local portraits.
// No new artwork is generated here.
for (const dkd_portrait of [dkd_v06AvatarSelin, dkd_v06AvatarEce]) {
  if (dkd_portrait && !dkd_v06CustomerPortraitPoolPart08.includes(dkd_portrait)) {
    dkd_v06CustomerPortraitPoolPart08.push(dkd_portrait);
  }
}
