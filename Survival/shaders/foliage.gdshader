shader_type spatial;
render_mode cull_disabled;
uniform vec4 tint : source_color = vec4(0.27,0.40,0.20,1.0);
uniform float strength = 0.07;
uniform float camera_clear_radius = 0.0;
varying float variation;
varying vec3 canopy_center;
varying float canopy_scale;
void vertex() {
 canopy_center = (MODEL_MATRIX * vec4(0.0,4.8,0.0,1.0)).xyz;
 canopy_scale = length(MODEL_MATRIX[0].xyz);
 vec3 world = (MODEL_MATRIX * vec4(VERTEX,1.0)).xyz;
 VERTEX.x += sin(TIME*1.4 + world.x*0.25 + world.z*0.31) * strength * max(VERTEX.y,0.0);
 variation = sin(world.x*1.3 + world.z*0.7)*0.045;
}
void fragment() {
 if (camera_clear_radius > 0.0 && distance(INV_VIEW_MATRIX[3].xyz,canopy_center) < camera_clear_radius*canopy_scale) { discard; }
 ALBEDO = tint.rgb + vec3(variation);
 ROUGHNESS = 0.97;
}
