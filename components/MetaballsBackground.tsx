
import React, { useEffect, useRef } from 'react';
import * as THREE from "three";
import { Pane } from "tweakpane";

const MetaballsBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, material: THREE.ShaderMaterial;
    let clock: THREE.Clock;
    let targetMousePosition = new THREE.Vector2(0.5, 0.5);
    let mousePosition = new THREE.Vector2(0.5, 0.5);

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const settings = {
      fixedTopLeftRadius: 0.80,
      fixedBottomRightRadius: 0.90,
      movingCount: 6,
      blendSmoothness: 0.80,
      mouseSmoothness: 0.10,
      cursorRadiusMin: 0.14,
      cursorRadiusMax: 0.15,
      animationSpeed: 0.6,
      sphereColor: new THREE.Color(0x050510),
      lightColor: new THREE.Color(0xccaaff),
      cursorGlowColor: new THREE.Color(0xaa77ff)
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;
      clock = new THREE.Clock();

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      containerRef.current?.appendChild(renderer.domElement);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
          uCursorRadius: { value: settings.cursorRadiusMin },
          uSphereCount: { value: settings.movingCount },
          uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
          uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
          uBlendSmoothness: { value: settings.blendSmoothness },
          uAnimationSpeed: { value: settings.animationSpeed },
          uSphereColor: { value: settings.sphereColor },
          uLightColor: { value: settings.lightColor },
          uCursorGlowColor: { value: settings.cursorGlowColor }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec2 uMousePosition;
          uniform float uCursorRadius;
          uniform int uSphereCount;
          uniform float uFixedTopLeftRadius;
          uniform float uFixedBottomRightRadius;
          uniform float uBlendSmoothness;
          uniform float uAnimationSpeed;
          uniform vec3 uSphereColor;
          uniform vec3 uLightColor;
          uniform vec3 uCursorGlowColor;
          varying vec2 vUv;
          
          const float PI = 3.14159265359;
          const float EPSILON = 0.001;

          float smin(float a, float b, float k) {
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h * h * k * 0.25;
          }
          
          float sdSphere(vec3 p, float r) { return length(p) - r; }
          
          vec3 screenToWorld(vec2 normalizedPos) {
            vec2 uv = normalizedPos * 2.0 - 1.0;
            uv.x *= uResolution.x / uResolution.y;
            return vec3(uv * 2.0, 0.0);
          }
          
          float sceneSDF(vec3 pos) {
            float result = 100.0;
            float t = uTime * uAnimationSpeed;

            vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
            float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
            
            vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
            float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
            
            for (int i = 0; i < 15; i++) {
              if (i >= uSphereCount) break;
              float fi = float(i);
              float speed = 0.3 + fi * 0.1;
              float orbitRadius = 1.2 + mod(fi, 3.0) * 0.4;
              float phase = fi * PI * 0.5;
              
              vec3 offset = vec3(
                sin(t * speed + phase) * orbitRadius * 1.5,
                cos(t * speed * 0.8 + phase) * orbitRadius,
                sin(t * speed * 0.5 + phase) * 0.4
              );
              
              float movingSphere = sdSphere(pos - offset, 0.15 + mod(fi, 3.0) * 0.1);
              result = smin(result, movingSphere, uBlendSmoothness);
            }
            
            vec3 mouseWorld = screenToWorld(uMousePosition);
            float cursorBall = sdSphere(pos - mouseWorld, uCursorRadius);
            float corners = smin(topLeft, bottomRight, 0.6);
            
            result = smin(result, corners, uBlendSmoothness);
            result = smin(result, cursorBall, 0.2); 
            
            return result;
          }

          vec3 calcNormal(vec3 p) {
            vec2 e = vec2(1.0,-1.0)*0.002;
            return normalize(e.xyy*sceneSDF(p+e.xyy) + e.yyx*sceneSDF(p+e.yyx) + e.yxy*sceneSDF(p+e.yxy) + e.xxx*sceneSDF(p+e.xxx));
          }

          void main() {
            vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
            float aspect = uResolution.x / uResolution.y;
            vec2 p_uv = (screenUv * 2.0 - 1.0);
            p_uv.x *= aspect;
            
            vec3 ro = vec3(p_uv * 2.0, -1.5);
            vec3 rd = vec3(0.0, 0.0, 1.0);
            
            float t = 0.0;
            for(int i=0; i<40; i++) {
                float d = sceneSDF(ro + rd*t);
                if(d < EPSILON || t > 6.0) break;
                t += d;
            }
            
            if(t < 6.0) {
                vec3 p = ro + rd*t;
                vec3 n = calcNormal(p);
                vec3 viewDir = -rd;
                vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
                
                float diff = max(dot(n, lightDir), 0.0);
                float spec = pow(max(dot(viewDir, reflect(-lightDir, n)), 0.0), 32.0);
                
                vec3 color = uSphereColor + diff * uLightColor;
                color += uLightColor * spec;
                
                gl_FragColor = vec4(color, 1.0);
            } else {
                float distToMouse = length(screenUv - uMousePosition);
                float glow = pow(1.0 - smoothstep(0.0, 2.0, distToMouse), 2.5);
                gl_FragColor = vec4(uCursorGlowColor * glow, glow * 0.7);
            }
          }
        `,
        transparent: true
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      // Cast as any to avoid strict Tweakpane 4 'addFolder' property check during build
      const pane = new Pane({ title: "Nexus Control Protocol", expanded: false }) as any;
      
      const mbFolder = pane.addFolder({ title: "Metaballs", expanded: true });
      mbFolder.addBinding(settings, "fixedTopLeftRadius", { min: 0.1, max: 1.5 }).on('change', (v: any) => material.uniforms.uFixedTopLeftRadius.value = v.value);
      mbFolder.addBinding(settings, "fixedBottomRightRadius", { min: 0.1, max: 1.5 }).on('change', (v: any) => material.uniforms.uFixedBottomRightRadius.value = v.value);
      mbFolder.addBinding(settings, "movingCount", { min: 0, max: 15, step: 1 }).on('change', (v: any) => material.uniforms.uSphereCount.value = v.value);
      mbFolder.addBinding(settings, "animationSpeed", { min: 0.1, max: 2.0 }).on('change', (v: any) => material.uniforms.uAnimationSpeed.value = v.value);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      mousePosition.lerp(targetMousePosition, settings.mouseSmoothness);
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uMousePosition.value.copy(mousePosition);
      renderer.render(scene, camera);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePosition.set(e.clientX / window.innerWidth, 1.0 - (e.clientY / window.innerHeight));
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    init();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} id="container" className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0a]" />;
};

export default MetaballsBackground;
