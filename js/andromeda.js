import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// A deliberately independent, removable first-draft layer. Coordinates are
// equatorial J2000, dimensions in light-years. Synthetic stars, not a catalogue.
export const M31 = Object.freeze({
  name: 'Andromeda Galaxy (M31)', ra: 10.6847083, dec: 41.26875,
  distance: 2500000, radiusLy: 110000, inclination: 77, positionAngle: 38,
  source: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/'
});

export function createAndromeda({ scene, onSelect }) {
  const group = new THREE.Group();
  group.name = 'Andromeda M31 · illustrative 3D model';
  const ra = THREE.MathUtils.degToRad(M31.ra), dec = THREE.MathUtils.degToRad(M31.dec);
  const direction = new THREE.Vector3(Math.cos(dec)*Math.cos(ra), Math.sin(dec), -Math.cos(dec)*Math.sin(ra));
  const north = new THREE.Vector3(-Math.sin(dec)*Math.cos(ra), Math.cos(dec), Math.sin(dec)*Math.sin(ra));
  const east = new THREE.Vector3(-Math.sin(ra), 0, -Math.cos(ra));
  const pa = THREE.MathUtils.degToRad(M31.positionAngle), inc = THREE.MathUtils.degToRad(M31.inclination);
  const major = north.clone().multiplyScalar(Math.cos(pa)).addScaledVector(east, Math.sin(pa));
  const minor = north.clone().multiplyScalar(-Math.sin(pa)).addScaledVector(east, Math.cos(pa))
    .multiplyScalar(Math.cos(inc)).addScaledVector(direction, Math.sin(inc));
  const normal = new THREE.Vector3().crossVectors(major, minor).normalize();
  const body = new THREE.Group();
  // Geometry is mapped vertex-by-vertex into scene axes below. Do not rotate
  // or scale this group afterwards: logarithmic mapping is not affine.
  group.add(body);

  // Continuous surface remains smooth even when the point layer is reduced.
  const disk = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 80, 80), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: `varying vec2 p; void main(){p=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 p;
      float hash(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
      void main(){
        float r=length(p); if(r>1.)discard;
        float a=atan(p.y,p.x);
        float cloud=noise(p*18.)*.52+noise(p*43.)*.28+noise(p*103.)*.20;
        float fine=noise(p*230.);
        // M31 is not a pristine two-armed pinwheel. A diffuse old stellar
        // disk dominates, crossed by broken dusty rings and faint arm arcs.
        vec2 offset=p-vec2(.014,-.018);
        float rr=length(offset)+.009*sin(a*3.)+.008*sin(a*7.);
        float ring10=exp(-pow((rr-.296)/(.015+cloud*.022),2.));
        float ring15=exp(-pow((rr-.445)/(.019+cloud*.023),2.));
        float inner=exp(-pow((rr-.166)/.015,2.));
        float arc=pow(.5+.5*cos(2.*a-5.5*log(max(r,.08))+.8*cloud),5.);
        arc*=smoothstep(.19,.32,r)*(1.-smoothstep(.55,.85,r));
        float patches=smoothstep(.24,.70,cloud);
        float dust=(ring10*.78+ring15*.47+inner*.26+arc*.18)*patches;
        float diskLight=exp(-r*3.6)*(.86+cloud*.24);
        float core=exp(-length(p*vec2(.85,1.1))*20.);
        float young=(ring10*.075+ring15*.035+arc*.025)*patches;
        vec3 oldStars=mix(vec3(.70,.70,.67),vec3(1.,.85,.63),exp(-r*7.));
        vec3 c=oldStars*(.72+diskLight*.24)+vec3(.29,.42,.65)*young;
        c*=1.-dust*.76;
        c*=.94+fine*.12;
        c+=vec3(1.,.86,.66)*core*.35;
        float fade=1.-smoothstep(.58,.98,r);
        gl_FragColor=vec4(c,clamp((diskLight*1.15+core*.45+young)*fade,0.,.96));
      }`
  }));
  body.add(disk);

  // A smooth, genuinely 3D old stellar bulge survives at Low quality too.
  const bulgeGeometry=new THREE.SphereGeometry(1,32,20);
  bulgeGeometry.scale(.145,.11,.075);
  const bulge=new THREE.Mesh(bulgeGeometry,new THREE.ShaderMaterial({
    transparent:true, depthWrite:false,
    vertexShader:`varying vec3 n; varying vec3 v; void main(){vec4 q=modelViewMatrix*vec4(position,1.);
      n=normalize(normalMatrix*normal);v=-q.xyz;gl_Position=projectionMatrix*q;}`,
    fragmentShader:`varying vec3 n; varying vec3 v; void main(){float f=pow(abs(dot(normalize(n),normalize(v))),2.);
      gl_FragColor=vec4(vec3(.96,.80,.58),f*.32);}`
  }));
  body.add(bulge);

  let seed = 310031;
  const random = () => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
  const gaussian = () => Math.sqrt(-2*Math.log(Math.max(1e-9,random())))*Math.cos(2*Math.PI*random());
  const positions=[], colours=[];
  // Interleaved populations ensure every quality prefix contains disk and bulge.
  const count=18000;
  for(let i=0;i<count;i++) {
    let x,y,z,colour;
    if(random()<.32) {
      const spread=.022+Math.pow(random(),2)*.17;
      x=gaussian()*spread; y=gaussian()*spread*.72; z=gaussian()*spread*.55;
      colour=new THREE.Color(1,.77+random()*.14,.50+random()*.20);
    } else {
      // Broad disk population, not particles lined up on two equations.
      let r;
      if(random()<.25) r=Math.max(.06,Math.min(.85,(random()<.72?.296:.445)+gaussian()*.026));
      else { do {r=-.17*Math.log(Math.max(1e-9,random()*random()));} while(r>.96); }
      const a=random()*Math.PI*2;
      x=Math.cos(a)*r; y=Math.sin(a)*r; z=gaussian()*(.005+r*.007);
      colour=random()<.16 ? new THREE.Color(.63,.76,1) : new THREE.Color(.85,.82,.73);
    }
    positions.push(x,y,z); colours.push(colour.r,colour.g,colour.b);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));
  const uniforms={radius:{value:1}, viewport:{value:800}};
  const points=new THREE.Points(geometry,new THREE.ShaderMaterial({
    uniforms, vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`uniform float radius; uniform float viewport; varying vec3 c;
      void main(){c=color;vec4 v=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*v;
      gl_PointSize=clamp(radius*.0018*viewport/max(.001,-v.z),1.,4.);}`,
    fragmentShader:`varying vec3 c; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
      gl_FragColor=vec4(c,exp(-r*r*5.)*.40);}`
  }));
  body.add(points);
  // Retain physical local coordinates; all quality levels use the same map.
  const mappedGeometries=[disk.geometry,bulge.geometry,geometry].map(geometry=>({
    geometry, physical:geometry.getAttribute('position').array.slice()
  }));
  const labelElement=document.createElement('button');
  labelElement.className='universe-nebula-label';
  labelElement.textContent='Andromeda · M31';
  labelElement.title='Select Andromeda Galaxy';
  labelElement.addEventListener('click',onSelect);
  const label=new CSS2DObject(labelElement);
  group.add(label);
  scene.add(group);
  let radius=1, quality='medium', mappingKey='';
  return {
    group, direction, normal, major, minor,
    setScaleMode(mode, maximum) {
      const key=mode==='linear' ? `linear:${maximum}` : 'compressed';
      if(key===mappingKey) return;
      mappingKey=key;
      const distance=mode==='linear' ? M31.distance*80/maximum : 30*Math.log10(1+M31.distance);
      group.position.copy(direction).multiplyScalar(distance);
      const centre=direction.clone().multiplyScalar(M31.distance);
      radius=0;
      const mapLocal=(x,y,z,target)=>{
        target.copy(centre).addScaledVector(major,x*M31.radiusLy)
          .addScaledVector(minor,y*M31.radiusLy).addScaledVector(normal,z*M31.radiusLy);
        const d=target.length();
        const mapped=mode==='linear' ? d*80/maximum : 30*Math.log10(1+d);
        return target.multiplyScalar(mapped/d).sub(group.position);
      };
      const point=new THREE.Vector3();
      for(const {geometry:buffer,physical} of mappedGeometries) {
        const attribute=buffer.getAttribute('position');
        for(let i=0;i<physical.length;i+=3){
          mapLocal(physical[i],physical[i+1],physical[i+2],point);
          attribute.setXYZ(i/3,point.x,point.y,point.z);
          radius=Math.max(radius,point.length());
        }
        attribute.needsUpdate=true;
        buffer.computeBoundingSphere();
      }
      // Needed for the deformed 3D bulge, not the unlit textured disk.
      bulge.geometry.computeVertexNormals();
      uniforms.radius.value=radius;
      mapLocal(1.08,0,0,label.position);
    },
    setVisible(visible) { group.visible=visible; },
    setQuality(value) { quality=value; geometry.setDrawRange(0,value==='low'?3000:value==='high'?18000:8000); },
    update(camera,height) {
      uniforms.viewport.value=height;
      // Resolve individual stars only near the galaxy: no per-particle CPU work.
      points.visible=camera.position.distanceTo(group.position)<radius*(quality==='low'?5:9);
      label.visible=camera.position.distanceTo(group.position)>radius*.8;
    },
    getRadius() { return radius; },
    dispose() {
      group.removeFromParent(); labelElement.remove();
      body.traverse(child=>{child.geometry?.dispose();child.material?.dispose();});
    }
  };
}
