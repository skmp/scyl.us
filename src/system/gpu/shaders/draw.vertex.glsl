#version 300 es
precision mediump float;

uniform vec2 uClipSize;
uniform vec2 uClipPos;
uniform vec2 uDrawPos;

in uint aColor;
in ivec2 aVertex;
in ivec2 aTexture;

out vec4 vColor;
out vec2 vAbsolute;
out vec2 vTexture;

vec4 unpack(uint color) {
	return vec4(
			float(color & 0x1Fu) / 31.0,
			float((color >>  5) & 0x1Fu) / 31.0,
			float((color >> 10) & 0x1Fu) / 31.0,
			float(color >> 15)
		);
}

void main(void) {
	vColor    = unpack(aColor);
	vTexture  = vec2(aTexture);
	vAbsolute = vec2(aVertex) + uDrawPos;

    gl_PointSize = 1.0;
    gl_Position = vec4((vAbsolute - uClipPos) / vec2(uClipSize) * 2.0 - 1.0, 1.0, 1.0);
}
