shader_type spatial;
render_mode blend_mix, cull_disabled;
varying vec3 position_world;
void vertex() {
 position_world = (MODEL_MATRIX*vec4(VERTEX,1.0)).xyz;
 VERTEX.y += sin(position_world.x*1.3+TIME)*0.035 + cos(position_world.z+TIME*.7)*0.03;
}
void fragment() {
 float ripple = sin(position_world.x*2.0+position_world.z*1.3+TIME*1.7)*0.025;
 ALBEDO = vec3(0.10,0.30,0.32)+ripple;
 METALLIC = 0.12;
 ROUGHNESS = 0.2;
 ALPHA = 0.78;
}
