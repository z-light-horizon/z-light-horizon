import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { questions } from "../data/SearchPrompt";
import { Link } from "react-router-dom";

function FloatingEffect() {
  return null;
}

function Model({ lights, emissions }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}Everything7.glb`);
  const { camera, invalidate } = useThree();
  const floatingObjectsRef = useRef([]);
  const timeRef = useRef(0);
  const repelCurrentRef = useRef({ x: 0, y: 0, z: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const allMeshesRef = useRef([]);

  useEffect(() => {
    let foundCamera = null;

    const cameraObj = scene.getObjectByName("Camera");
    if (cameraObj && cameraObj.isCamera) {
      foundCamera = cameraObj;
    }

    if (!foundCamera) {
      scene.traverse((child) => {
        if (child.parent && child.parent.name === "Camera" && child.isCamera) {
          foundCamera = child;
        }
        if (child.name === "Camera" && child.isCamera) {
          foundCamera = child;
        }
      });
    }

    if (foundCamera) {
      camera.position.copy(foundCamera.position);
      camera.rotation.copy(foundCamera.rotation);
      if (foundCamera.fov) camera.fov = foundCamera.fov;
      camera.updateProjectionMatrix();
    }

    const targetNames = [
      "Tears",
      "Pointlight_Orange",
      "Pointlight_Green",
      "Pointlight_Blue",
      "Ring",
    ];

    floatingObjectsRef.current = [];

    targetNames.forEach((name) => {
      let obj = scene.getObjectByName(name);

      if (!obj) {
        scene.traverse((child) => {
          if (
            child.name === name ||
            (child.parent && child.parent.name === name)
          ) {
            obj =
              child.parent && child.parent.name === name ? child.parent : child;
          }
        });
      }

      if (obj) {
        if (!obj.userData.originalPosition) {
          obj.userData.originalPosition = obj.position.clone();
        }
        obj.userData.intensity = 0.2;
        floatingObjectsRef.current.push(obj);
      }
    });

    // Build mesh list once instead of every frame
    allMeshesRef.current = [];
    floatingObjectsRef.current.forEach((obj) => {
      obj.traverse((child) => {
        if (child.isMesh) allMeshesRef.current.push(child);
      });
    });

    scene.traverse((child) => {
      if (child.parent && lights[child.parent.name]) {
        if (child.isLight) {
          const lightState = lights[child.parent.name];
          child.visible = lightState.enabled;
          child.intensity = lightState.intensity;

          if (child.parent.name === "Spotlight") {
            child.castShadow = true;
            if (child.shadow) {
              child.shadow.mapSize.width = 2048;
              child.shadow.mapSize.height = 2048;
              child.shadow.camera.near = 0.5;
              child.shadow.camera.far = 50;
              child.shadow.bias = -0.0001;
            }
          } else {
            child.castShadow = false;
          }
        }
      }

      if (child.isLight && lights[child.name]) {
        const lightState = lights[child.name];
        child.visible = lightState.enabled;
        child.intensity = lightState.intensity;

        if (child.name === "Spotlight") {
          child.castShadow = true;
          if (child.shadow) {
            child.shadow.mapSize.width = 2048;
            child.shadow.mapSize.height = 2048;
            child.shadow.camera.near = 0.5;
            child.shadow.camera.far = 50;
            child.shadow.bias = -0.0001;
          }
        } else {
          child.castShadow = false;
        }
      }
    });

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.parent && child.parent.name === "Tears") {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0.6;
            child.material.metalness = 0.1;
            child.material.roughness = 0.3;
            child.material.envMapIntensity = 1.5;
            child.material.transmission = 1;
            child.material.thickness = 5;
            child.material.ior = 1.5;
            child.material.needsUpdate = true;
          }
        }

        if (child.parent && emissions[child.parent.name]) {
          const emissionState = emissions[child.parent.name];
          if (child.material) {
            child.material.emissiveIntensity = emissionState.enabled
              ? emissionState.strength
              : 0;
            child.material.needsUpdate = true;
          }
        }

        if (emissions[child.name]) {
          const emissionState = emissions[child.name];
          if (child.material) {
            child.material.emissiveIntensity = emissionState.enabled
              ? emissionState.strength
              : 0;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, lights, emissions, camera]);

  useFrame((state, delta) => {
    if (floatingObjectsRef.current.length > 0) {
      timeRef.current += delta;

      const baseFloatY = Math.sin(timeRef.current * 1.5) * 0.04;
      const baseSwayX = Math.sin(timeRef.current * 0.8) * 0.02;
      const baseSwayZ = Math.cos(timeRef.current * 0.6) * 0.02;
      const baseRotationY = Math.sin(timeRef.current * 0.5) * 0.02;

      raycasterRef.current.setFromCamera(state.pointer, state.camera);
      const intersects = raycasterRef.current.intersectObjects(
        allMeshesRef.current,
        false,
      );

      let targetRepelX = 0;
      let targetRepelY = 0;
      let targetRepelZ = 0;

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        const center = new THREE.Vector3();
        floatingObjectsRef.current.forEach((obj) => {
          const pos = new THREE.Vector3();
          obj.getWorldPosition(pos);
          center.add(pos);
        });
        center.divideScalar(floatingObjectsRef.current.length);

        const direction = new THREE.Vector3().subVectors(
          center,
          intersectPoint,
        );
        const distance = direction.length();

        if (distance < 3) {
          direction.normalize();
          const strength = Math.max(0, (3 - distance) / 3) * 0.35;
          targetRepelX = direction.x * strength;
          targetRepelY = direction.y * strength;
          targetRepelZ = direction.z * strength;
        }
      }

      const lerpFactor = 0.03;
      repelCurrentRef.current.x +=
        (targetRepelX - repelCurrentRef.current.x) * lerpFactor;
      repelCurrentRef.current.y +=
        (targetRepelY - repelCurrentRef.current.y) * lerpFactor;
      repelCurrentRef.current.z +=
        (targetRepelZ - repelCurrentRef.current.z) * lerpFactor;

      floatingObjectsRef.current.forEach((obj) => {
        if (obj.userData.originalPosition) {
          const original = obj.userData.originalPosition;
          obj.position.x = original.x + baseSwayX + repelCurrentRef.current.x;
          obj.position.y = original.y + baseFloatY + repelCurrentRef.current.y;
          obj.position.z = original.z + baseSwayZ + repelCurrentRef.current.z;
          obj.rotation.y = baseRotationY;
        }
      });

      // Tell renderer something changed
      invalidate();
    }
  });

  return <primitive object={scene} />;
}

function ThreeDimension() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Pause rendering when scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    setShowResults(val.length > 0);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val);
    }, 150);
  };

  const [lights, setLights] = useState({
    Pointlight_Orange: { enabled: true, intensity: 50 },
    Pointlight_Green: { enabled: true, intensity: 20 },
    Pointlight_Blue: { enabled: true, intensity: 20 },
    Pointlight_Spirit: { enabled: true, intensity: 7 },
    Spotlight: { enabled: true, intensity: 800 },
  });

  const [emissions, setEmissions] = useState({
    Spirit: { enabled: true, strength: 0 },
  });

  const toggleLight = (lightName) => {
    setLights((prev) => ({
      ...prev,
      [lightName]: { ...prev[lightName], enabled: !prev[lightName].enabled },
    }));
  };

  const updateIntensity = (lightName, value) => {
    setLights((prev) => ({
      ...prev,
      [lightName]: { ...prev[lightName], intensity: parseFloat(value) },
    }));
  };

  const toggleEmission = (emissionName) => {
    setEmissions((prev) => ({
      ...prev,
      [emissionName]: {
        ...prev[emissionName],
        enabled: !prev[emissionName].enabled,
      },
    }));
  };

  const updateEmissionStrength = (emissionName, value) => {
    setEmissions((prev) => ({
      ...prev,
      [emissionName]: { ...prev[emissionName], strength: parseFloat(value) },
    }));
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateToGallery = useCallback(
    (term = "") => {
      navigate("/gallery", { state: { searchTerm: term } });
    },
    [navigate],
  );

  const handleBackToHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "#1a1a1a" }}
    >
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 60px",
          zIndex: 10,
        }}
      >
        {/* onClick={handleBackToHome} */}
        <Link
          to="/"
          onClick={handleBackToHome}
          style={{
            color: "#D4A574",
            fontSize: "48px",
            fontFamily: "Georgia, serif",
            textDecoration: "none",
            fontWeight: "500",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Home
        </Link>
        {/* <button
          onClick={handleBackToHome}
          style={{
            color: "#D4A574",
            fontSize: "48px",
            fontFamily: "Georgia, serif",
            textDecoration: "none",
            fontWeight: "500",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Home
        </button> */}

        <a
          href="#contact"
          onClick={handleContactClick}
          style={{
            color: "#D4A574",
            fontSize: "48px",
            fontFamily: "Georgia, serif",
            textDecoration: "none",
            fontWeight: "500",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Contact
        </a>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "8%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        {showResults && (
          <div
            style={{
              position: "absolute",
              top: "30px",
              left: 0,
              right: 0,
              background:
                "linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCC80 100%)",
              borderRadius: "0 0 20px 20px",
              paddingTop: "40px",
              paddingBottom: "20px",
              paddingLeft: "20px",
              paddingRight: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {questions
                .filter((q) =>
                  q.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((question, index) => (
                  <div
                    key={index}
                    onClick={() => navigateToGallery(question)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#666",
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#333",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {question}
                    </span>
                  </div>
                ))}

              <div
                onClick={() => navigate("/gallery")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  padding: "8px",
                  paddingTop: "12px",
                  borderRadius: "8px",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  marginTop: "4px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#D4A574",
                  }}
                ></div>
                <span
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    fontFamily: "Georgia, serif",
                    fontWeight: "bold",
                  }}
                >
                  View entire gallery →
                </span>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(to right, #fde68a, #fcd34d)",
            borderRadius: "30px",
            padding: "12px 20px",
            boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)",
            minWidth: "350px",
            zIndex: 2,
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigateToGallery(searchInput);
            }}
            style={{
              border: "none",
              outline: "none",
              fontSize: "18px",
              flex: 1,
              background: "transparent",
              fontFamily: "Georgia, serif",
              color: "#333",
            }}
          />
          <span
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => navigateToGallery(searchInput)}
          >
            🔍
          </span>
        </div>

        <p
          style={{
            marginTop: "10px",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.45)",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            lineHeight: "1.4",
            maxWidth: "350px",
          }}
        >
          <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
            Disclaimer:
          </span>{" "}
          This is a personal website and is not officially endorsed by or
          connected to the FFWPU.
        </p>
      </div>

      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        frameloop={isVisible ? "always" : "never"}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.5,
          powerPreference: "high-performance",
          antialias: false,
        }}
      >
        <ambientLight intensity={0.05} />
        <Suspense fallback={null}>
          <Model lights={lights} emissions={emissions} />
          <Environment preset="city" />
        </Suspense>
        <FloatingEffect />
      </Canvas>
    </div>
  );
}

export default ThreeDimension;
