import React from 'react';

interface LoaderProps {
  primaryColor?: string;
  primaryLight?: string;
  maskBg?: string;
}

const Loader: React.FC<LoaderProps> = ({ primaryColor = "#ffffff", primaryLight = "#d9ecff", maskBg = "#000000" }) => {
  const loaderCss = `
    .loader-3d {
      --duration: 3s;
      --primary: ${primaryColor};
      --primary-light: ${primaryLight};
      --primary-rgba: rgba(255, 255, 255, 0);
      width: 200px;
      height: 320px;
      position: relative;
      transform-style: preserve-3d;
    }
    @media (max-width: 480px) {
      .loader-3d {
        zoom: 0.44;
      }
    }
    .loader-3d:before, .loader-3d:after {
      --r: 20.5deg;
      content: "";
      width: 320px;
      height: 140px;
      position: absolute;
      right: 32%;
      bottom: -11px;
      background: ${maskBg}; 
      transform: translateZ(200px) rotate(var(--r));
      animation: mask var(--duration) linear forwards infinite;
    }
    .loader-3d:after {
      --r: -20.5deg;
      right: auto;
      left: 32%;
    }
    .loader-3d .ground {
      position: absolute;
      left: -50px;
      bottom: -120px;
      transform-style: preserve-3d;
      transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
    }
    .loader-3d .ground div {
      transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
      width: 200px;
      height: 200px;
      background: var(--primary);
      background: linear-gradient(45deg, var(--primary) 0%, var(--primary) 50%, var(--primary-light) 50%, var(--primary-light) 100%);
      transform-style: preserve-3d;
      animation: ground var(--duration) linear forwards infinite;
    }
    .loader-3d .ground div:before, .loader-3d .ground div:after {
      --rx: 90deg;
      --ry: 0deg;
      --x: 44px;
      --y: 162px;
      --z: -50px;
      content: "";
      width: 156px;
      height: 300px;
      opacity: 0;
      background: linear-gradient(var(--primary), var(--primary-rgba));
      position: absolute;
      transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
      animation: ground-shine var(--duration) linear forwards infinite;
    }
    .loader-3d .ground div:after {
      --rx: 90deg;
      --ry: 90deg;
      --x: 0;
      --y: 177px;
      --z: 150px;
    }
    .loader-3d .box {
      --x: 0;
      --y: 0;
      position: absolute;
      animation: var(--duration) linear forwards infinite;
      transform: translate(var(--x), var(--y));
    }
    .loader-3d .box div {
      background-color: var(--primary);
      width: 48px;
      height: 48px;
      position: relative;
      transform-style: preserve-3d;
      animation: var(--duration) ease forwards infinite;
      transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
    }
    .loader-3d .box div:before, .loader-3d .box div:after {
      --rx: 90deg;
      --ry: 0deg;
      --z: 24px;
      --y: -24px;
      --x: 0;
      content: "";
      position: absolute;
      background-color: inherit;
      width: inherit;
      height: inherit;
      transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
      filter: brightness(var(--b, 1.2));
    }
    .loader-3d .box div:after {
      --rx: 0deg;
      --ry: 90deg;
      --x: 24px;
      --y: 0;
      --b: 1.4;
    }
    .loader-3d .box.box0 { --x: -220px; --y: -120px; left: 58px; top: 108px; animation-name: box-move0; }
    .loader-3d .box.box0 div { animation-name: box-scale0; }
    .loader-3d .box.box1 { --x: -260px; --y: 120px; left: 25px; top: 120px; animation-name: box-move1; }
    .loader-3d .box.box1 div { animation-name: box-scale1; }
    .loader-3d .box.box2 { --x: 120px; --y: -190px; left: 58px; top: 64px; animation-name: box-move2; }
    .loader-3d .box.box2 div { animation-name: box-scale2; }
    .loader-3d .box.box3 { --x: 280px; --y: -40px; left: 91px; top: 120px; animation-name: box-move3; }
    .loader-3d .box.box3 div { animation-name: box-scale3; }
    .loader-3d .box.box4 { --x: 60px; --y: 200px; left: 58px; top: 132px; animation-name: box-move4; }
    .loader-3d .box.box4 div { animation-name: box-scale4; }
    .loader-3d .box.box5 { --x: -220px; --y: -120px; left: 25px; top: 76px; animation-name: box-move5; }
    .loader-3d .box.box5 div { animation-name: box-scale5; }
    .loader-3d .box.box6 { --x: -260px; --y: 120px; left: 91px; top: 76px; animation-name: box-move6; }
    .loader-3d .box.box6 div { animation-name: box-scale6; }
    .loader-3d .box.box7 { --x: -240px; --y: 200px; left: 58px; top: 87px; animation-name: box-move7; }
    .loader-3d .box.box7 div { animation-name: box-scale7; }

    @keyframes box-move0 { 12% { transform: translate(var(--x), var(--y)); } 25%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale0 { 6% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 14%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move1 { 16% { transform: translate(var(--x), var(--y)); } 29%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale1 { 10% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 18%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move2 { 20% { transform: translate(var(--x), var(--y)); } 33%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale2 { 14% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 22%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move3 { 24% { transform: translate(var(--x), var(--y)); } 37%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale3 { 18% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 26%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move4 { 28% { transform: translate(var(--x), var(--y)); } 41%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale4 { 22% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 30%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move5 { 32% { transform: translate(var(--x), var(--y)); } 45%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale5 { 26% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 34%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move6 { 36% { transform: translate(var(--x), var(--y)); } 49%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale6 { 30% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 38%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    @keyframes box-move7 { 40% { transform: translate(var(--x), var(--y)); } 53%, 52% { transform: translate(0, 0); } 80% { transform: translate(0, -32px); } 90%, 100% { transform: translate(0, 188px); } }
    @keyframes box-scale7 { 34% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0); } 42%, 100% { transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1); } }
    
    @keyframes ground { 0%, 65% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); } 75%, 90% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(1); } 100% { transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0); } }
    @keyframes ground-shine { 0%, 70% { opacity: 0; } 75%, 87% { opacity: 0.2; } 100% { opacity: 0; } }
    @keyframes mask { 0%, 65% { opacity: 0; } 66%, 100% { opacity: 1; } }
  `;

  const boxes = [...Array(8).keys()];

  return (
    <>
      <style>{loaderCss}</style>
      <div className="loader-3d">
        {boxes.map(i => (
          <div key={i} className={`box box${i}`}>
            <div></div>
          </div>
        ))}
        <div className="ground">
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
