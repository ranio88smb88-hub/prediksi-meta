
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
    let currentMovementScale = 1.0;

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const settings = {
      fixedTopLeftRadius: 0.80,
      fixedBottomRightRadius: 0.90,
      smallTopLeftRadius: 0.30,
      smallBottomRightRadius: 0.35,
      movingCount: 6,
      blendSmoothness: 0.80,
      mouseProximityEffect: true,
      minMovementScale: 0.30,
      maxMovementScale: 1.00,
      mouseSmoothness: 0.10,
      cursorRadiusMin: 0.14,
      cursorRadiusMax: 0.15,
      animationSpeed: 0.6,
      movementScale: 1.2,
      ambientIntensity: 0.12,
      diffuseIntensity: 1.20,
      specularIntensity: 2.50,
      specularPower: 3.0,
      fresnelPower: 0.8,
      contrast: 1.6,
      cursorGlowIntensity: 1.2,
      cursorGlowRadius: 2.2,
      fogDensity: 0.06,
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
          uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
          uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
          uBlendSmoothness: { value: settings.blendSmoothness },
          uAmbientIntensity: { value: settings.ambientIntensity },
          uDiffuseIntensity: { value: settings.diffuseIntensity },
          uSpecularIntensity: { value: settings.specularIntensity },
          uSpecularPower: { value: settings.specularPower },
          uFresnelPower: { value: settings.fresnelPower },
          uContrast: { value: settings.contrast },
          uFogDensity: { value: settings.fogDensity },
          uAnimationSpeed: { value: settings.animationSpeed },
          uMovementScale: { value: settings.movementScale },
          uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
          uCursorGlowRadius: { value: settings.cursorGlowRadius },
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
          uniform float uSmallTopLeftRadius;
          uniform float uSmallBottomRightRadius;
          uniform float uBlendSmoothness;
          uniform float uDiffuseIntensity;
          uniform float uSpecularIntensity;
          uniform float uSpecularPower;
          uniform float uFresnelPower;
          uniform float uContrast;
          uniform float uAnimationSpeed;
          uniform float uMovementScale;
          uniform float uCursorGlowIntensity;
          uniform float uCursorGlowRadius;
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

            vec3 topLeftPos = screenToWorld(vec2(0.08 + sin(t*0.2)*0.05, 0.92 + cos(t*0.3)*0.05));
            float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
            
            vec3 smallTopLeftPos = screenToWorld(vec2(0.25 + cos(t*0.4)*0.1, 0.72 + sin(t*0.2)*0.1));
            float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
            
            vec3 bottomRightPos = screenToWorld(vec2(0.92 + sin(t*0.25)*0.05, 0.08 + cos(t*0.35)*0.05));
            float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
            
            vec3 smallBottomRightPos = screenToWorld(vec2(0.72 + cos(t*0.3)*0.1, 0.25 + sin(t*0.4)*0.1));
            float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
            
            for (int i = 0; i < 15; i++) {
              if (i >= uSphereCount) break;
              float fi = float(i);
              float speed = 0.3 + fi * 0.1;
              float orbitRadius = (1.0 + mod(fi, 3.0) * 0.4) * uMovementScale;
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
            float corners = smin(smin(topLeft, smallTopLeft, 0.6), smin(bottomRight, smallBottomRight, 0.6), 0.6);
            
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
            
            vec3 finalColor = vec3(0.0);
            float distToMouse = length(screenUv - uMousePosition);
            float glow = pow(1.0 - smoothstep(0.0, uCursorGlowRadius, distToMouse), 2.5) * uCursorGlowIntensity;
            
            if(t < 6.0) {
                vec3 p = ro + rd*t;
                vec3 n = calcNormal(p);
                vec3 viewDir = -rd;
                vec3 lightPos = vec3(1.0, 1.0, 2.0);
                vec3 lightDir = normalize(lightPos);
                
                float diff = max(dot(n, lightDir), 0.0);
                float spec = pow(max(dot(viewDir, reflect(-lightDir, n)), 0.0), uSpecularPower);
                float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), uFresnelPower);
                
                vec3 color = uSphereColor + diff * uLightColor * uDiffuseIntensity;
                color += uLightColor * spec * uSpecularIntensity * fresnel;
                color += uLightColor * fresnel * 0.4;
                
                gl_FragColor = vec4(color * uContrast, 1.0);
            } else {
                finalColor = uCursorGlowColor * glow;
                gl_FragColor = vec4(finalColor, glow * 0.7);
            }
          }
        `,
        transparent: true
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const pane = new Pane({ title: "Nexus Control Protocol", expanded: false });
      
      const mbFolder = pane.addFolder({ title: "Metaballs", expanded: true });
      mbFolder.addBinding(settings, "fixedTopLeftRadius", { min: 0.1, max: 1.5, label: "Top Left Size" }).on('change', v => material.uniforms.uFixedTopLeftRadius.value = v.value);
      mbFolder.addBinding(settings, "fixedBottomRightRadius", { min: 0.1, max: 1.5, label: "Bottom Right Size" }).on('change', v => material.uniforms.uFixedBottomRightRadius.value = v.value);
      mbFolder.addBinding(settings, "smallTopLeftRadius", { min: 0.1, max: 1.0, label: "Small Top Left" }).on('change', v => material.uniforms.uSmallTopLeftRadius.value = v.value);
      mbFolder.addBinding(settings, "smallBottomRightRadius", { min: 0.1, max: 1.0, label: "Small Bottom Right" }).on('change', v => material.uniforms.uSmallBottomRightRadius.value = v.value);
      mbFolder.addBinding(settings, "movingCount", { min: 0, max: 15, step: 1, label: "Moving Count" }).on('change', v => material.uniforms.uSphereCount.value = v.value);
      mbFolder.addBinding(settings, "blendSmoothness", { min: 0.1, max: 2.0, label: "Blend Smoothness" }).on('change', v => material.uniforms.uBlendSmoothness.value = v.value);

      const mouseFolder = pane.addFolder({ title: "Mouse Interaction" });
      mouseFolder.addBinding(settings, "mouseProximityEffect", { label: "Proximity Effect" });
      mouseFolder.addBinding(settings, "minMovementScale", { min: 0.0, max: 2.0, label: "Min Scale" });
      mouseFolder.addBinding(settings, "maxMovementScale", { min: 0.0, max: 2.0, label: "Max Scale" });
      mouseFolder.addBinding(settings, "mouseSmoothness", { min: 0.01, max: 0.5, label: "Smoothness" });

      const cursorFolder = pane.addFolder({ title: "Cursor" });
      cursorFolder.addBinding(settings, "cursorRadiusMin", { min: 0.01, max: 0.5, label: "Min Radius" });
      cursorFolder.addBinding(settings, "cursorRadiusMax", { min: 0.01, max: 0.5, label: "Max Radius" });

      const animFolder = pane.addFolder({ title: "Animation" });
      animFolder.addBinding(settings, "animationSpeed", { min: 0.1, max: 2.0, label: "Speed" }).on('change', v => material.uniforms.uAnimationSpeed.value = v.value);
      animFolder.addBinding(settings, "movementScale", { min: 0.1, max: 3.0, label: "Movement Scale" }).on('change', v => material.uniforms.uMovementScale.value = v.value);

      const lightFolder = pane.addFolder({ title: "Lighting" });
      lightFolder.addBinding(settings, "ambientIntensity", { min: 0.0, max: 1.0, label: "Ambient" });
      lightFolder.addBinding(settings, "diffuseIntensity", { min: 0.0, max: 3.0, label: "Diffuse" }).on('change', v => material.uniforms.uDiffuseIntensity.value = v.value);
      lightFolder.addBinding(settings, "specularIntensity", { min: 0.0, max: 5.0, label: "Specular" }).on('change', v => material.uniforms.uSpecularIntensity.value = v.value);
      lightFolder.addBinding(settings, "specularPower", { min: 1, max: 50, label: "Spec Power" }).on('change', v => material.uniforms.uSpecularPower.value = v.value);
      lightFolder.addBinding(settings, "fresnelPower", { min: 0.1, max: 5.0, label: "Fresnel" }).on('change', v => material.uniforms.uFresnelPower.value = v.value);
      lightFolder.addBinding(settings, "contrast", { min: 0.5, max: 3.0, label: "Contrast" }).on('change', v => material.uniforms.uContrast.value = v.value);

      const glowFolder = pane.addFolder({ title: "Cursor Glow" });
      glowFolder.addBinding(settings, "cursorGlowIntensity", { min: 0.0, max: 3.0, label: "Intensity" }).on('change', v => material.uniforms.uCursorGlowIntensity.value = v.value);
      glowFolder.addBinding(settings, "cursorGlowRadius", { min: 0.1, max: 5.0, label: "Radius" }).on('change', v => material.uniforms.uCursorGlowRadius.value = v.value);
      glowFolder.addBinding(settings, "fogDensity", { min: 0.0, max: 0.2, label: "Fog" }).on('change', v => material.uniforms.uFogDensity.value = v.value);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      mousePosition.lerp(targetMousePosition, settings.mouseSmoothness);
      
      if (settings.mouseProximityEffect) {
        const mouseVel = targetMousePosition.distanceTo(mousePosition);
        const targetScale = THREE.MathUtils.lerp(settings.minMovementScale, settings.maxMovementScale, THREE.MathUtils.clamp(mouseVel * 10, 0, 1));
        currentMovementScale = THREE.MathUtils.lerp(currentMovementScale, targetScale, 0.05);
        material.uniforms.uMovementScale.value = settings.movementScale * currentMovementScale;
      }

      material.uniforms.uCursorRadius.value = settings.cursorRadiusMin + (settings.cursorRadiusMax - settings.cursorRadiusMin) * (settings.mouseProximityEffect ? 0.5 : 0);
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
