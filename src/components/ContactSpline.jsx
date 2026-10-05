import { lazy, Suspense, useState } from "react";
import { useMediaQuery } from "react-responsive";
import useInView from "../hooks/useInView";
import EarthCanvas from "../canvas/Earth";

const Spline = lazy(() => import("@splinetool/react-spline"));

const ContactSpline = ({
  scene = "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
  className = "",
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { elementRef, isInView } = useInView({
    rootMargin: "250px 0px",
    threshold: 0.05,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // On mobile screens, retain the original ThreeJS EarthCanvas
  if (isMobile) {
    return (
      <div className={`w-full h-full min-h-[350px] ${className}`} style={{ touchAction: "pan-y" }}>
        <EarthCanvas />
      </div>
    );
  }

  // On desktop / tablet screens, display the real Spline earth globe
  return (
    <div
      ref={elementRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] rounded-3xl overflow-hidden bg-black flex items-center justify-center ${className}`}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 transition-opacity duration-500">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {isInView ? (
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={() => {
              setIsLoaded(true);
              window.__CONTACT_3D_READY__ = true;
              window.dispatchEvent(new CustomEvent("contact-3d-ready"));
            }}
            className="w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default ContactSpline;
