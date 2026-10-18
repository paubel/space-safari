import * as THREE from 'three';

// Original procedural interpretation, not a measured density reconstruction.
// A small signed-distance field describes the recognizable Earth-facing profile;
// a depth-dependent volume turns that profile into a cloud, not a flat billboard.
function createProfileTexture() {
  const profile = [
    [-.31,-.5],[-.23,-.38],[-.16,-.22],[-.12,-.05],[-.15,.07],
    [-.23,.1],[-.38,.08],[-.49,.15],[-.51,.24],[-.44,.31],
    [-.31,.34],[-.22,.4],[-.16,.48],[-.08,.5],[.01,.45],
    [.09,.36],[.15,.24],[.16,.08],[.14,-.07],[.19,-.24],
    [.29,-.39],[.4,-.5]
  ];
  const size = 256;
  const data = new Uint16Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const px = (x + .5) / size * 2 - 1;
    const py = (y + .5) / size * 2 - 1;
    let distance = 10, inside = false;
    for (let i = 0, j = profile.length - 1; i < profile.length; j = i++) {
      const [ax, ay] = profile[j], [bx, by] = profile[i];
      const dx = bx - ax, dy = by - ay;
      const t = THREE.MathUtils.clamp(((px - ax)*dx+(py - ay)*dy)/(dx*dx+dy*dy),0,1);
      distance = Math.min(distance, Math.hypot(px-ax-t*dx,py-ay-t*dy));
      if ((ay > py) !== (by > py) && px < (bx-ax)*(py-ay)/(by-ay)+ax) inside = !inside;
    }
    data[y*size+x] = THREE.DataUtils.toHalfFloat(THREE.MathUtils.clamp(.5+(inside ? -distance : distance),0,1));
  }
  const texture = new THREE.DataTexture(data,size,size,THREE.RedFormat,THREE.HalfFloatType);
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createHorseheadNebula(nebula, volumeSteps) {
  const uniforms = {
    uTime: { value: 0 }, uCameraLocal: { value: new THREE.Vector3() },
    uMaxSteps: { value: volumeSteps }, uProfile: { value: createProfileTexture() }
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.BackSide,
    vertexShader: `
      varying vec3 vPosition;
      void main() { vPosition = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vPosition;
      uniform vec3 uCameraLocal;
      uniform sampler2D uProfile;
      uniform int uMaxSteps;
      float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float noise(vec3 p) {
        vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      void main() {
        vec3 direction=normalize(vPosition-uCameraLocal);
        float b=dot(uCameraLocal,direction);
        float root=sqrt(max(0.0,b*b-dot(uCameraLocal,uCameraLocal)+1.0));
        float entry=max(0.0,-b-root), exitDistance=-b+root;
        float stepSize=max(.0001,(exitDistance-entry)/float(uMaxSteps));
        vec3 p=uCameraLocal+direction*(entry+stepSize*(.2+hash(vec3(gl_FragCoord.xy,1.0))*.6));
        vec4 result=vec4(0.0);
        for (int i=0;i<58;i++) {
          if(i>=uMaxSteps || result.a>.995) break;
          float coarse=noise(p*9.0);
          float fine=noise(p*28.0);
          float turbulence=coarse*.7+fine*.3;
          // IC 434 is an illuminated sheet BEHIND the opaque Orion B cloud.
          float envelope=1.0-smoothstep(.7,1.0,length(p));
          float sheet=exp(-pow((p.z+.38)/.25,2.0))*envelope;
          float emission=sheet*(.45+turbulence*1.15);
          vec2 xy=p.xy+vec2(sin(p.z*6.0)*.035,cos(p.z*7.0)*.02);
          float sd=texture2D(uProfile,xy*.5+.5).r-.5;
          sd+=(turbulence-.5)*.06;
          // Convex depth: the head narrows off-axis, revealing a real thick
          // pillar as the observer orbits away from the familiar silhouette.
          sd+=pow(abs((p.z-.2)/.42),2.0)*.07;
          float head=1.0-smoothstep(-.012,.016,sd);
          float ridgeTop=-.49+sin(p.x*5.2)*.035+(turbulence-.5)*.085;
          float ridge=(1.0-smoothstep(ridgeTop-.025,ridgeTop+.025,p.y))*(1.0-smoothstep(.25,.65,abs(p.z-.16)));
          float dust=max(head,ridge)*envelope;
          vec3 gas=mix(vec3(.62,.045,.11),vec3(1.0,.28,.39),turbulence);
          // Dust is opaque, not a stack of glowing contour shells: keep its
          // source dark and textured rather than lighting every SDF isosurface.
          vec3 dustColour=vec3(.0035,.0025,.004)+vec3(.012,.006,.004)*turbulence;
          float extinction=emission*2.6+dust*38.0;
          vec3 source=(gas*emission*2.6+dustColour*dust*38.0)/max(extinction,.001);
          float alpha=(1.0-exp(-extinction*stepSize))*(1.0-result.a);
          result.rgb+=source*alpha; result.a+=alpha;
          p+=direction*stepSize;
        }
        if(result.a<.008) discard;
        gl_FragColor=vec4(result.rgb/max(result.a,.001),result.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1,40,28),material);
  mesh.scale.fromArray(nebula.displayScale);
  return { mesh, uniforms };
}
