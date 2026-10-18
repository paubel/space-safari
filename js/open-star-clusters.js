import * as THREE from 'three';

// SIMBAD ICRS/J2000 coordinates (degrees) and V magnitudes, retrieved 2026-10-18.
// Only sky positions and brightness are catalogue-derived. Depth and faint
// background membership below are explicitly illustrative; see model notes.
export const CLUSTER_MEMBERS = {
  pleiades: [
    ['Alcyone',56.871152,24.105136,2.87],['Atlas',57.290596,24.053417,3.63],
    ['Electra',56.218905,24.113338,3.70],['Maia',56.456701,24.367744,3.87],
    ['Merope',56.581608,23.948359,4.18],['Taygeta',56.302083,24.467274,4.30],
    ['Pleione',57.296736,24.136710,5.09],['Celaeno',56.200896,24.289468,5.46],
    ['Asterope (21 Tau)',56.476985,24.554510,5.76],['22 Tauri',56.512085,24.527897,6.421]
  ],
  hyades: [
    ['Gamma Tauri',64.948350,15.627642,3.65],['Delta¹ Tauri',65.733730,17.542514,3.76],
    ['Epsilon Tauri',67.154168,19.180434,3.53],['Theta¹ Tauri',67.143741,15.962284,3.84],
    ['Theta² Tauri',67.165590,15.870875,3.41],['Delta² Tauri',66.024006,17.444131,4.80],
    ['Delta³ Tauri',66.372436,17.927907,4.298],['70 Tauri',66.405511,15.941023,6.439]
  ]
};

function skyPosition(ra,dec,distance) {
  const a=THREE.MathUtils.degToRad(ra),d=THREE.MathUtils.degToRad(dec);
  return new THREE.Vector3(distance*Math.cos(d)*Math.cos(a),distance*Math.sin(d),-distance*Math.cos(d)*Math.sin(a));
}

function pointTexture() {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=128;
  const context=canvas.getContext('2d');
  const gradient=context.createRadialGradient(64,64,0,64,64,64);
  [[0,1],[.035,1],[.09,.82],[.18,.22],[.38,.035],[1,0]].forEach(([r,a])=>gradient.addColorStop(r,`rgba(255,255,255,${a})`));
  context.fillStyle=gradient; context.fillRect(0,0,128,128);
  return new THREE.CanvasTexture(canvas);
}

function reflectionCloud(anchors,radius,steps) {
  const uniforms={uCameraLocal:{value:new THREE.Vector3()},uTime:{value:0},uMaxSteps:{value:steps},uAnchors:{value:anchors}};
  const material=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,side:THREE.BackSide,
    vertexShader:`varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`
      precision highp float;
      varying vec3 vPosition;
      uniform vec3 uCameraLocal;
      uniform vec3 uAnchors[4];
      uniform int uMaxSteps;
      float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float noise(vec3 p){
        vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      void main(){
        vec3 direction=normalize(vPosition-uCameraLocal);
        float b=dot(uCameraLocal,direction),root=sqrt(max(0.0,b*b-dot(uCameraLocal,uCameraLocal)+1.0));
        float entry=max(0.0,-b-root),stepSize=max(.0001,(-b+root-entry)/float(uMaxSteps));
        vec3 p=uCameraLocal+direction*(entry+stepSize*.5);
        vec4 result=vec4(0.0);
        for(int i=0;i<58;i++){
          if(i>=uMaxSteps)break;
          float coarse=noise(p*vec3(8,7,6));
          vec3 flow=vec3(p.x*.82+p.y*.57,p.y*.82-p.x*.57,p.z);
          float grain=noise(flow*vec3(27,15,21)+coarse);
          float illumination=0.0;
          for(int j=0;j<4;j++){
            vec3 q=p-uAnchors[j];
            illumination+=exp(-dot(q*vec3(3.1,2.1,2.0),q*vec3(3.1,2.1,2.0)))*(j==0?1.2:.65);
          }
          // Wispy, star-lit reflection dust, with Merope's southward fan.
          vec3 fan=p-uAnchors[0]-vec3(.04,-.16,-.04);
          float meropeFan=exp(-dot(fan*vec3(4.0,1.8,2.5),fan*vec3(4.0,1.8,2.5)));
          float envelope=1.0-smoothstep(.65,1.0,length(p));
          float filaments=smoothstep(.4,.73,coarse*.35+grain*.65);
          float density=envelope*(illumination*.55+meropeFan*.6)*(.055+filaments*.9);
          vec3 colour=mix(vec3(.055,.18,.49),vec3(.38,.61,.95),grain);
          float alpha=(1.0-exp(-density*stepSize*1.65))*(1.0-result.a);
          result.rgb+=colour*alpha;result.a+=alpha;p+=direction*stepSize;
        }
        if(result.a<.002)discard;
        gl_FragColor=vec4(result.rgb/max(result.a,.001),min(result.a,.63));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),material);
  mesh.scale.set(radius,radius,radius*.65);
  return {mesh,uniforms};
}

export function createOpenStarCluster(nebula,steps) {
  const isPleiades=nebula.volumeShape==='cluster';
  const members=CLUSTER_MEMBERS[isPleiades?'pleiades':'hyades'];
  const group=new THREE.Group(),texture=pointTexture();
  const centre=skyPosition(nebula.ra,nebula.dec,nebula.distance);
  const towardSun=centre.clone().normalize().negate();
  const right=new THREE.Vector3(0,1,0).cross(towardSun).normalize();
  const up=towardSun.clone().cross(right).normalize();
  const positions=new Map();
  members.forEach(([name,ra,dec,magnitude],i)=>{
    const offset=skyPosition(ra,dec,nebula.distance).sub(centre);
    const position=new THREE.Vector3(offset.dot(right),offset.dot(up),offset.dot(towardSun)+(Math.sin(i*2.4)* (isPleiades?1.2:3.0)));
    positions.set(name,position);
    const giant=!isPleiades && /Gamma|Epsilon|Theta¹|Delta¹/.test(name);
    const star=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:giant?0xffd2a0:0xc6ddff,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    star.name=name; star.position.copy(position); star.renderOrder=2;
    star.scale.setScalar(.75*Math.pow(10,-.12*(magnitude-3)));
    group.add(star);
  });
  // Deterministic illustrative faint population, not a membership catalogue.
  let seed=isPleiades?45:41;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const points=[],colours=[];
  for(let i=0;i<360;i++){
    const r=(nebula.physicalSizeLy/2)*.92*Math.pow(random(),.7);
    const az=random()*Math.PI*2,z=random()*2-1,s=Math.sqrt(1-z*z);
    points.push(r*s*Math.cos(az),r*s*Math.sin(az),r*z*(isPleiades?.5:.8));
    const c=new THREE.Color().setRGB(.5+random()*.45,.5+random()*.4,.62+random()*.38);
    colours.push(c.r,c.g,c.b);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));
  const faintStars=new THREE.Points(geometry,new THREE.PointsMaterial({map:texture,size:.11,vertexColors:true,transparent:true,opacity:.35,depthWrite:false,blending:THREE.AdditiveBlending}));
  faintStars.renderOrder=2;group.add(faintStars);
  let volume;
  if(isPleiades){
    const r=nebula.physicalSizeLy/2;
    const anchors=['Merope','Alcyone','Maia','Electra'].map(name=>positions.get(name).clone().divide(new THREE.Vector3(r,r,r*.65)));
    volume=reflectionCloud(anchors,r,steps);group.add(volume.mesh);
  }
  const navigationDiameter=Math.max(...nebula.displayScale)*2;
  group.scale.setScalar(navigationDiameter/nebula.physicalSizeLy);
  group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,towardSun));
  group.userData.clusterPoints=faintStars;
  return {group,volume,faintStars,members};
}
