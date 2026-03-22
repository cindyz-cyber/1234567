import{d as ne,u as se,b as oe,r as n,j as t,P as ie,p as le,G as W,f as be}from"./index-CdQv9ECx.js";import{C as Z}from"./chevron-left-cKJ7tbYs.js";const xe=async g=>{const m=Date.now(),f=await g,u=Date.now()-m;return u<3e3&&await new Promise(h=>setTimeout(h,3e3-u)),f},X=[{label:"喜悦",hue:45,angle:0},{label:"平和",hue:120,angle:45},{label:"焦虑",hue:210,angle:90},{label:"迷茫",hue:270,angle:135},{label:"愤怒",hue:0,angle:180},{label:"悲伤",hue:200,angle:225},{label:"丰盛",hue:50,angle:270},{label:"其他",hue:180,angle:315}],ce=[{label:"紧绷",angle:0},{label:"松弛",angle:60},{label:"温热",angle:120},{label:"空洞",angle:180},{label:"沉重",angle:240},{label:"其他",angle:300}],_=(g,x,m,f)=>{const u=g*Math.PI/180,h=f*.123,y=x+Math.sin(h*100)*m;return{x:50+y*Math.cos(u),y:50+y*Math.sin(u)}};function me({onNext:g,onBack:x}){const m=ne(),{flowBase:f}=se(),h=oe().state,y=(e,r,a)=>{g?g(e,r):m(be(f,"/journal"),{state:{...h,emotions:e,bodyStates:r,journalContentFromWriting:a}})},[c,F]=n.useState([]),[b,j]=n.useState([]),[w,K]=n.useState(""),[N,pe]=n.useState("emotion"),[T,I]=n.useState(0),[z,Y]=n.useState(!1),[p,C]=n.useState(""),[d,B]=n.useState(""),[L,E]=n.useState(!1),[q,$]=n.useState(!1),[P,M]=n.useState([]),[D,k]=n.useState(new Set),[G,de]=n.useState(!1);n.useState(.25),n.useEffect(()=>{console.log("🎭 EmotionScan mounted");const e=new Image;return e.src="/assets/79757b3cae9165b1c14088a60f3c4d94.jpg",()=>console.log("🎭 EmotionScan unmounted")},[]);const J=n.useMemo(()=>X.map((e,r)=>({...e,position:_(e.angle,28,4,r)})),[]),Q=n.useMemo(()=>ce.map((e,r)=>({...e,position:_(e.angle,22,3,r)})),[]);c.length>0||b.length>0,n.useEffect(()=>{if(P.length===0)return;const e=setInterval(()=>{M(r=>r.filter(a=>a.life>0).map(a=>({...a,x:a.x+a.vx,y:a.y+a.vy,vy:a.vy+.2,vx:a.vx*.98,life:a.life-.016})))},16);return()=>clearInterval(e)},[P.length]);const R=(e,r)=>{const a=[];for(let l=0;l<15;l++){const v=Math.PI*2*l/15+(Math.random()-.5)*.4,i=3+Math.random()*2;a.push({id:`${Date.now()}-${l}`,x:e,y:r,vx:Math.cos(v)*i,vy:Math.sin(v)*i-1.5,life:1})}M(l=>[...l,...a])},H=()=>{"vibrate"in navigator&&navigator.vibrate(10)},V=(e,r,a)=>{const s=a.currentTarget.getBoundingClientRect(),l=s.left+s.width/2,v=s.top+s.height/2;if(e==="其他"){E(!0);return}c.includes(e)?(F(o=>o.filter(S=>S!==e)),k(o=>{const S=new Set(o);return S.delete(e),S}),I(0)):(H(),R(l,v),k(o=>new Set([...o,e])),setTimeout(()=>{F(o=>[...o,e]),I(r)},150))},ee=(e,r)=>{const a=r.currentTarget.getBoundingClientRect(),s=a.left+a.width/2,l=a.top+a.height/2;if(e==="其他"){$(!0);return}b.includes(e)?(j(i=>i.filter(o=>o!==e)),k(i=>{const o=new Set(i);return o.delete(e),o})):(H(),R(s,l),k(i=>new Set([...i,e])),setTimeout(()=>{j(i=>[...i,e])},150))},O=()=>{p.trim()&&(F(e=>[...e,p.trim()]),C(""),E(!1))},U=()=>{d.trim()&&(j(e=>[...e,d.trim()]),B(""),$(!1))},te=()=>{c.length>0&&b.length>0&&(Y(!0),setTimeout(()=>{y(c,b)},800))},ae=()=>{w.trim()&&(Y(!0),setTimeout(()=>{y(c,b,w.trim())},1200))},re=b.length>0?"身体的反馈是？":"此刻，你的情绪是？",A=()=>{};return console.log("🎨 EmotionScan rendering, step:",N),t.jsxs(t.Fragment,{children:[t.jsx(ie,{videoSrc:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/mf2l1xwzmq-1773037528059.mp4",posterImg:le,overlayGradient:"linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(2, 13, 10, 0.25) 50%, rgba(0, 0, 0, 0.22) 100%)"}),t.jsxs("div",{className:"min-h-screen flex flex-col px-6 py-8 breathing-fade relative",style:{position:"relative",zIndex:1},children:[P.map(e=>t.jsx("div",{className:"particle",style:{left:e.x,top:e.y,opacity:e.life,transform:`translate(-50%, -50%) scale(${e.life})`}},e.id)),x&&t.jsx("button",{onClick:x,className:"absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110",style:{backgroundColor:"rgba(235, 200, 98, 0.1)",border:"1px solid rgba(235, 200, 98, 0.3)",backdropFilter:"blur(10px)"},children:t.jsx(Z,{size:24,color:"#EBC862"})}),N==="emotion"?t.jsxs("div",{className:"flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto w-full relative",style:{paddingTop:"28px",paddingBottom:"28px"},children:[t.jsx("div",{className:"mb-8 text-center transition-all duration-500",children:t.jsx("p",{className:"text-sm title-text",style:{color:"#FFFFFF",fontWeight:500,letterSpacing:"0.25em",textShadow:"0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 12px rgba(0, 0, 0, 0.8)",position:"relative",zIndex:100},children:re})}),t.jsx("div",{className:"mandala-container relative w-full",style:{height:"330px",marginBottom:"28px"},children:J.map((e,r)=>t.jsxs("button",{onClick:a=>V(e.label,e.hue,a),onTouchStart:A,className:`glass-bubble emotion-bubble mandala-bubble ${e.label==="其他"?"other-bubble":""} ${D.has(e.label)?"popping":""} ${c.includes(e.label)?"selected":""}`,style:{position:"absolute",left:`${e.position.x}%`,top:`${e.position.y}%`,transform:"translate(-50%, -50%)",animationDelay:`${r*.1}s`,backgroundColor:"transparent"},children:[[...Array(6)].map((a,s)=>t.jsx("div",{className:`golden-particle-inner ${e.label==="其他"?"silver-particle":""}`,style:{animationDelay:`${s*1.3}s`,animationDuration:`${7+s%3}s`}},s)),t.jsx("div",{className:"bubble-content",children:e.label})]},e.label))}),L&&t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center",style:{backgroundColor:"rgba(0, 0, 0, 0.7)",backdropFilter:"blur(10px)"},children:t.jsxs("div",{className:"relative w-full max-w-md mx-6 p-8 rounded-3xl",style:{background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(20px)",border:"1px solid rgba(247, 231, 206, 0.3)",boxShadow:"0 0 30px rgba(247, 231, 206, 0.5), 0 0 60px rgba(247, 231, 206, 0.2)"},children:[t.jsx("p",{className:"text-center mb-6",style:{color:"#FFF9E5",fontWeight:400,letterSpacing:"0.25em",fontSize:"16px",textShadow:"0 0 10px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(255, 255, 255, 0.6)"},children:"请输入你的情绪"}),t.jsx("input",{type:"text",value:p,onChange:e=>C(e.target.value),onKeyPress:e=>e.key==="Enter"&&O(),placeholder:"例如: 期待、感恩...",autoFocus:!0,className:"w-full mb-6 px-6 py-4 rounded-2xl text-center",style:{background:"rgba(255, 255, 255, 0.15)",border:"1px solid rgba(247, 231, 206, 0.4)",outline:"none",color:"#EBC862",fontSize:"18px",letterSpacing:"0.15em",fontFamily:"Georgia, Times New Roman, serif"}}),t.jsxs("div",{className:"flex gap-4",children:[t.jsx("button",{onClick:()=>{E(!1),C("")},className:"flex-1 py-3 rounded-xl transition-all",style:{background:"rgba(255, 255, 255, 0.1)",border:"1px solid rgba(247, 231, 206, 0.3)",color:"#FFFFFF",letterSpacing:"0.2em"},children:"取消"}),t.jsx("button",{onClick:O,disabled:!p.trim(),className:"flex-1 py-3 rounded-xl transition-all",style:{background:p.trim()?"rgba(247, 231, 206, 0.2)":"rgba(255, 255, 255, 0.05)",border:"1px solid rgba(247, 231, 206, 0.5)",color:p.trim()?"#EBC862":"rgba(255, 255, 255, 0.3)",letterSpacing:"0.2em",cursor:p.trim()?"pointer":"not-allowed"},children:"确定"})]})]})}),t.jsx("div",{className:"w-full text-center mb-2",children:t.jsx("p",{className:"text-xs body-states-title",style:{color:"rgba(255, 255, 255, 0.9)",fontWeight:500,letterSpacing:"0.2em",textShadow:"0 2px 4px rgba(0, 0, 0, 0.9)"},children:"身体的反馈是？"})}),t.jsx("div",{className:"mandala-container relative w-full",style:{height:"290px",marginBottom:"20px"},children:Q.map((e,r)=>t.jsxs("button",{onClick:a=>ee(e.label,a),onTouchStart:A,className:`glass-bubble body-bubble mandala-bubble ${e.label==="其他"?"other-bubble":""} ${D.has(e.label)?"popping":""} ${b.includes(e.label)?"selected":""}`,style:{position:"absolute",left:`${e.position.x}%`,top:`${e.position.y}%`,transform:"translate(-50%, -50%)",animationDelay:`${(r+X.length)*.1}s`},children:[[...Array(5)].map((a,s)=>t.jsx("div",{className:`golden-particle-inner ${e.label==="其他"?"silver-particle":""}`,style:{animationDelay:`${s*1.5}s`,animationDuration:`${6.5+s%3}s`}},s)),t.jsx("div",{className:"bubble-content",children:e.label})]},e.label))}),q&&t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center",style:{backgroundColor:"rgba(0, 0, 0, 0.7)",backdropFilter:"blur(10px)"},children:t.jsxs("div",{className:"relative w-full max-w-md mx-6 p-8 rounded-3xl",style:{background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(20px)",border:"1px solid rgba(247, 231, 206, 0.3)",boxShadow:"0 0 30px rgba(247, 231, 206, 0.5), 0 0 60px rgba(247, 231, 206, 0.2)"},children:[t.jsx("p",{className:"text-center mb-6",style:{color:"#FFF9E5",fontWeight:400,letterSpacing:"0.25em",fontSize:"16px",textShadow:"0 0 10px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(255, 255, 255, 0.6)"},children:"请输入你的身体感受"}),t.jsx("input",{type:"text",value:d,onChange:e=>B(e.target.value),onKeyPress:e=>e.key==="Enter"&&U(),placeholder:"例如: 麻木、刺痛...",autoFocus:!0,className:"w-full mb-6 px-6 py-4 rounded-2xl text-center",style:{background:"rgba(255, 255, 255, 0.15)",border:"1px solid rgba(247, 231, 206, 0.4)",outline:"none",color:"#EBC862",fontSize:"18px",letterSpacing:"0.15em",fontFamily:"Georgia, Times New Roman, serif"}}),t.jsxs("div",{className:"flex gap-4",children:[t.jsx("button",{onClick:()=>{$(!1),B("")},className:"flex-1 py-3 rounded-xl transition-all",style:{background:"rgba(255, 255, 255, 0.1)",border:"1px solid rgba(247, 231, 206, 0.3)",color:"#FFFFFF",letterSpacing:"0.2em"},children:"取消"}),t.jsx("button",{onClick:U,disabled:!d.trim(),className:"flex-1 py-3 rounded-xl transition-all",style:{background:d.trim()?"rgba(247, 231, 206, 0.2)":"rgba(255, 255, 255, 0.05)",border:"1px solid rgba(247, 231, 206, 0.5)",color:d.trim()?"#EBC862":"rgba(255, 255, 255, 0.3)",letterSpacing:"0.2em",cursor:d.trim()?"pointer":"not-allowed"},children:"确定"})]})]})}),t.jsx("div",{className:`w-full max-w-md mx-auto continue-button-wrapper transition-all duration-700 ${c.length>0&&b.length>0?"opacity-100 translate-y-0":"opacity-0 translate-y-4 pointer-events-none"}`,children:t.jsx(W,{onClick:te,disabled:c.length===0||b.length===0||z,className:"w-full golden-breath",children:z?"正在继续...":"继续"})}),t.jsx("div",{className:"scroll-hint","aria-hidden":"true",children:t.jsx(Z,{size:22,color:"rgba(247, 231, 206, 0.7)"})})]}):t.jsxs("div",{className:`flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full ${G?"transitioning":"active"}`,children:[t.jsxs("div",{className:"w-full mb-8 relative",children:[t.jsx("div",{className:`consciousness-line ${N==="writing"&&!G?"line-grow":""}`}),t.jsx("textarea",{value:w,onChange:e=>K(e.target.value),placeholder:"在此书写你的感受...",className:`conscious-writing ${z?"submitting":""}`,rows:1,autoFocus:!0}),t.jsx("div",{className:"text-reflection","aria-hidden":"true",children:w})]}),t.jsx("div",{className:"w-full",children:t.jsx(W,{onClick:ae,disabled:!w.trim(),className:"w-full",children:"完成"})})]}),t.jsx("style",{children:`
        .particle {
          position: fixed;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 231, 206, 1) 0%, rgba(235, 200, 98, 0.9) 40%, transparent 100%);
          pointer-events: none;
          z-index: 1000;
          box-shadow: 0 0 6px rgba(247, 231, 206, 0.9), 0 0 10px rgba(235, 200, 98, 0.7);
          will-change: transform, opacity;
        }

        .forest-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: radial-gradient(circle at center, #001a0d 0%, #000000 100%);
          z-index: 1;
          pointer-events: none;
          -webkit-overflow-scrolling: touch;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
        }

        .forest-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.15) brightness(0.95) saturate(1.05);
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          animation: cameraBreath 20s ease-in-out infinite;
          will-change: transform;
          background-color: transparent !important;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          opacity: 0;
          transition: opacity 0.8s ease-in;
        }

        .forest-background-video[data-loaded="true"] {
          opacity: 1;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0);
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cameraBreath {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.05) translate(-1%, -0.5%);
          }
          66% {
            transform: scale(1.03) translate(0.5%, 1%);
          }
        }

        .mandala-container {
          position: relative;
          z-index: 10;
        }

        .glass-bubble {
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.98) 10%,
              rgba(255, 245, 200, 0.5) 18%,
              rgba(255, 225, 120, 0.35) 35%,
              rgba(250, 210, 100, 0.2) 55%,
              rgba(240, 195, 80, 0.1) 75%,
              transparent 100%
            ) !important;
          backdrop-filter: blur(0.5px);
          background-color: rgba(0,0,0,0) !important;
          border: 2px solid rgba(255, 230, 120, 0.6);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          box-shadow:
            0 0 15px rgba(255, 240, 150, 0.5),
            0 0 30px rgba(255, 220, 100, 0.3),
            0 0 45px rgba(255, 200, 80, 0.15),
            inset 0 0 30px rgba(255, 245, 200, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4);
          transition: all 0.5s ease;
          overflow: visible;
          will-change: transform, opacity;
        }

        .glass-bubble::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(255, 230, 120, 0.15) 65%,
            rgba(255, 215, 100, 0.25) 75%,
            rgba(255, 200, 85, 0.2) 85%,
            rgba(255, 185, 70, 0.12) 92%,
            transparent 100%
          );
          animation: innerGlow 4s ease-in-out infinite;
        }

        .glass-bubble::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow:
            0 0 10px rgba(255, 235, 140, 1),
            0 0 20px rgba(255, 215, 100, 0.7),
            0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translate(20px, -15px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) translate(-18px, 22px);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50%, -50%) translate(25px, 18px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) translate(-20px, -20px);
            opacity: 0;
          }
        }

        @keyframes crystalBreathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 0 15px rgba(255, 240, 150, 0.5),
              0 0 30px rgba(255, 220, 100, 0.3),
              0 0 45px rgba(255, 200, 80, 0.15),
              inset 0 0 30px rgba(255, 245, 200, 0.3),
              inset 0 0 15px rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            box-shadow:
              0 0 20px rgba(255, 245, 180, 0.6),
              0 0 40px rgba(255, 230, 120, 0.4),
              0 0 60px rgba(255, 210, 95, 0.2),
              inset 0 0 35px rgba(255, 250, 220, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1.05);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .emotion-bubble {
          width: 100px;
          height: 100px;
        }

        .body-bubble {
          width: 80px;
          height: 80px;
        }

        .mandala-bubble {
          animation: bubbleFloat 1.2s ease-out forwards;
        }

        .mandala-bubble:nth-child(1) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 6s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(2) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.5s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(3) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat3 7s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(4) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 6.8s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(5) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.2s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(6) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat3 6.6s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(7) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat1 7.2s ease-in-out infinite;
        }

        .mandala-bubble:nth-child(8) {
          animation: bubbleFloat 1.2s ease-out forwards, waveFloat2 6.4s ease-in-out infinite;
        }

        @keyframes waveFloat1 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }

        @keyframes waveFloat2 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }

        @keyframes waveFloat3 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-6px);
          }
        }

        .glass-bubble.dimmed {
          opacity: 0.3 !important;
          transform: translate(-50%, -50%) scale(0.9) !important;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-bubble.popping {
          animation: popExpand 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
          pointer-events: none;
        }

        @keyframes popExpand {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          40% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
        }

        .glass-bubble:hover {
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow:
            0 0 20px rgba(255, 245, 180, 0.7),
            0 0 35px rgba(255, 225, 110, 0.4),
            0 0 50px rgba(255, 205, 90, 0.2),
            inset 0 0 35px rgba(255, 250, 220, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 235, 130, 0.8);
        }

        .glass-bubble.selected {
          transform: translate(-50%, -50%) scale(1.12) !important;
          animation: bubbleFloat 1.2s ease-out forwards, crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite, selectedPulse 1s ease-in-out infinite !important;
        }

        @keyframes selectedPulse {
          0%, 100% {
            box-shadow:
              0 0 18px rgba(255, 245, 180, 0.6),
              0 0 35px rgba(255, 230, 120, 0.4),
              0 0 55px rgba(255, 210, 95, 0.25),
              inset 0 0 35px rgba(255, 250, 220, 0.4),
              inset 0 0 18px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow:
              0 0 25px rgba(255, 245, 180, 0.7),
              0 0 45px rgba(255, 230, 120, 0.5),
              0 0 70px rgba(255, 210, 95, 0.3),
              inset 0 0 40px rgba(255, 250, 220, 0.45),
              inset 0 0 22px rgba(255, 255, 255, 0.55);
          }
        }

        .bubble-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #1a1a1a;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          position: relative;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: none !important;
        }

        .emotion-bubble .bubble-content {
          font-size: 14px;
        }

        .body-bubble .bubble-content {
          font-size: 12px;
          font-weight: 400;
        }

        .golden-particle-inner {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 0.9);
          box-shadow:
            0 0 8px rgba(255, 235, 140, 0.8),
            0 0 15px rgba(255, 215, 100, 0.5);
          animation: particleFloatInner 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
          pointer-events: none;
        }

        @keyframes particleFloatInner {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          25% {
            transform: translate(-50%, -50%) translate(18px, -12px);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) translate(-15px, 20px);
            opacity: 0.6;
          }
          75% {
            transform: translate(-50%, -50%) translate(22px, 15px);
            opacity: 0.4;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) translate(-18px, -18px);
            opacity: 0;
          }
        }

        .golden-breath {
          animation: goldenBreathPulse 2s ease-in-out infinite;
        }

        @keyframes goldenBreathPulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(247, 231, 206, 0.5),
              0 0 40px rgba(247, 231, 206, 0.3),
              0 0 60px rgba(235, 200, 98, 0.2);
          }
          50% {
            box-shadow:
              0 0 30px rgba(247, 231, 206, 0.7),
              0 0 60px rgba(247, 231, 206, 0.5),
              0 0 90px rgba(235, 200, 98, 0.3);
          }
        }

        .consciousness-line {
          position: absolute;
          left: 50%;
          right: 50%;
          top: 50%;
          height: 0.5px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(235, 200, 98, 0.3) 20%,
            rgba(235, 200, 98, 0.6) 50%,
            rgba(235, 200, 98, 0.3) 80%,
            transparent 100%
          );
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 1;
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, right 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .consciousness-line.line-grow {
          left: 0;
          right: 0;
        }

        .transitioning {
          opacity: 0;
          pointer-events: none;
        }

        .active {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .conscious-writing {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: #EBC862;
          text-align: center;
          padding: 40px 20px;
          resize: none;
          overflow: hidden;
          position: relative;
          z-index: 2;
          text-shadow: 0 2px 12px rgba(235, 200, 98, 0.4);
          line-height: 1.8;
          min-height: 120px;
        }

        .conscious-writing::placeholder {
          color: rgba(235, 200, 98, 0.35);
          letter-spacing: 0.2em;
        }

        .conscious-writing.submitting {
          animation: fadeOutUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                     particleDispersal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .text-reflection {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          width: 100%;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(235, 200, 98, 0.15);
          text-align: center;
          padding: 40px 20px;
          pointer-events: none;
          z-index: 0;
          transform: scaleY(-1) translateY(50%);
          opacity: 0.3;
          filter: blur(1px);
          line-height: 1.8;
        }

        @keyframes bubbleFloat {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
        }

        @keyframes hueShift {
          0% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(${T}deg);
          }
          100% {
            filter: hue-rotate(0deg);
          }
        }

        @keyframes fadeOutUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        @keyframes particleDispersal {
          0% {
            text-shadow:
              0 2px 12px rgba(235, 200, 98, 0.4);
          }
          100% {
            text-shadow:
              0 -20px 40px rgba(235, 200, 98, 0.8),
              10px -25px 45px rgba(235, 200, 98, 0.6),
              -10px -30px 50px rgba(235, 200, 98, 0.6),
              15px -35px 55px rgba(235, 200, 98, 0.4),
              -15px -40px 60px rgba(235, 200, 98, 0.4);
          }
        }

        video {
          transition: filter 2s ease-in-out;
        }

        video.hue-shifted {
          filter: hue-rotate(${T}deg) contrast(1.2) brightness(1.1) saturate(1.1);
        }

        .title-text {
          position: relative;
          z-index: 100;
        }

        .continue-button-wrapper {
          position: relative;
          z-index: 100;
        }

        .scroll-hint {
          position: fixed;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%) rotate(-90deg);
          z-index: 120;
          opacity: 0.45;
          animation: scrollHintPulse 1.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes scrollHintPulse {
          0%, 100% {
            opacity: 0.25;
            transform: translateX(-50%) rotate(-90deg) translateY(0);
          }
          50% {
            opacity: 0.65;
            transform: translateX(-50%) rotate(-90deg) translateY(6px);
          }
        }

        .other-bubble .golden-particle-inner,
        .silver-particle {
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(230, 245, 255, 0.7) 30%,
            rgba(200, 220, 240, 0.5) 60%,
            transparent 100%
          ) !important;
          box-shadow:
            0 0 8px rgba(200, 220, 255, 0.6),
            0 0 15px rgba(180, 200, 230, 0.4),
            0 0 25px rgba(160, 180, 210, 0.2) !important;
        }

        .other-bubble {
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(250, 252, 255, 0.98) 10%,
              rgba(230, 240, 250, 0.5) 18%,
              rgba(210, 230, 245, 0.35) 35%,
              rgba(190, 215, 235, 0.2) 55%,
              rgba(170, 200, 225, 0.1) 75%,
              transparent 100%
            ) !important;
          border: 2px solid rgba(200, 220, 255, 0.6) !important;
          box-shadow:
            0 0 15px rgba(220, 235, 255, 0.5),
            0 0 30px rgba(200, 220, 240, 0.3),
            0 0 45px rgba(180, 205, 225, 0.15),
            inset 0 0 30px rgba(240, 248, 255, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4) !important;
        }

        .other-bubble::before {
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(210, 230, 255, 0.15) 65%,
            rgba(190, 215, 240, 0.25) 75%,
            rgba(170, 200, 225, 0.2) 85%,
            rgba(150, 185, 210, 0.12) 92%,
            transparent 100%
          ) !important;
        }

        .other-bubble::after {
          background: rgba(240, 248, 255, 1) !important;
          box-shadow:
            0 0 10px rgba(220, 235, 255, 1),
            0 0 20px rgba(200, 220, 240, 0.7),
            0 0 30px rgba(180, 205, 225, 0.4) !important;
        }

        .other-bubble:hover {
          box-shadow:
            0 0 20px rgba(225, 240, 255, 0.7),
            0 0 35px rgba(205, 225, 245, 0.4),
            0 0 50px rgba(185, 210, 235, 0.2),
            inset 0 0 35px rgba(245, 250, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5) !important;
          border-color: rgba(210, 230, 255, 0.8) !important;
        }

        .other-bubble.selected {
          box-shadow:
            0 0 25px rgba(230, 245, 255, 0.9),
            0 0 45px rgba(210, 230, 250, 0.6),
            0 0 65px rgba(190, 215, 240, 0.3),
            inset 0 0 40px rgba(245, 250, 255, 0.5),
            inset 0 0 25px rgba(255, 255, 255, 0.6) !important;
        }
      `})]})]})}export{me as default,xe as waitForGoldenTransitionMinimum};
