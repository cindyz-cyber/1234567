import{c as y,r as a,j as o,G as S}from"./index-CjTV2LxW.js";import{C as R}from"./chevron-left-xqiut3l-.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=y("MicOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",key:"80xlxr"}],["path",{d:"M5 10v2a7 7 0 0 0 12 5",key:"p2k8kg"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=y("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);function W({emotions:N=[],bodyStates:C=[],onBack:b,onNext:u,content:c={}}){const[i,x]=a.useState(""),[t,g]=a.useState(!1),[p,h]=a.useState(!1),[f,m]=a.useState(0),r=a.useRef(null),v=a.useRef(null);a.useEffect(()=>{if(console.group("🎤 [InnerWhisperJournal] 语音识别初始化"),console.log("🔍 检测浏览器支持..."),console.log("  - webkitSpeechRecognition:","webkitSpeechRecognition"in window),console.log("  - SpeechRecognition:","SpeechRecognition"in window),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){console.log("✅ 浏览器支持语音识别 API");const n=window.webkitSpeechRecognition||window.SpeechRecognition;try{r.current=new n,r.current.continuous=!0,r.current.interimResults=!0,r.current.lang="zh-CN",console.log("✅ 语音识别对象创建成功"),console.log("📊 配置:"),console.log("  - continuous:",r.current.continuous),console.log("  - interimResults:",r.current.interimResults),console.log("  - lang:",r.current.lang),r.current.onstart=()=>{console.log("🎙️ [Speech] 语音识别已启动")},r.current.onresult=e=>{console.log("📝 [Speech] 收到识别结果");let s="",d="";for(let l=e.resultIndex;l<e.results.length;l++){const w=e.results[l][0].transcript;e.results[l].isFinal?d+=w:s+=w}console.log("  - 临时结果:",s),console.log("  - 最终结果:",d),d&&(console.log("✅ 将最终结果添加到文本框:",d),x(l=>l+d))},r.current.onerror=e=>{if(console.error("❌ [Speech] 语音识别错误:",e.error),console.error("❌ 错误详情:",e),e.error==="no-speech"){console.log("💡 未检测到语音，继续监听...");return}e.error==="not-allowed"&&(console.error("❌ 麦克风权限被拒绝"),alert(`麦克风权限被拒绝

请在浏览器设置中允许麦克风权限，然后刷新页面重试。`)),g(!1)},r.current.onend=()=>{var e;if(console.log("🛑 [Speech] 语音识别已结束"),console.log("  - isListening 状态:",t),t){console.log("🔄 [Speech] 自动重启语音识别...");try{(e=r.current)==null||e.start(),console.log("✅ [Speech] 重启成功")}catch(s){console.error("❌ [Speech] 重启失败:",s),g(!1)}}},console.log("✅ 所有事件监听器已设置")}catch(e){console.error("❌ 创建语音识别对象失败:",e)}}else console.warn("⚠️ 浏览器不支持语音识别 API"),console.warn("💡 建议使用 Chrome、Edge 或 Safari 浏览器");return console.groupEnd(),()=>{if(r.current){console.log("🧹 [InnerWhisperJournal] 清理语音识别对象");try{r.current.stop(),console.log("✅ 语音识别已停止")}catch(n){console.error("❌ 停止语音识别失败:",n)}}}},[t]),a.useEffect(()=>{let n;return t?n=setInterval(()=>{m(Math.random()*.5+.5)},100):m(0),()=>clearInterval(n)},[t]);const j=async()=>{if(console.group("🎤 [InnerWhisperJournal] 喇叭按钮点击"),console.log("📍 当前状态 isListening:",t),console.log("📍 recognitionRef.current:",r.current?"已初始化":"null"),console.log("📍 浏览器支持检测:"),console.log("  - webkitSpeechRecognition:","webkitSpeechRecognition"in window),console.log("  - SpeechRecognition:","SpeechRecognition"in window),console.groupEnd(),!r.current){console.error("❌ 语音识别未初始化"),alert(`您的浏览器不支持语音输入功能

建议使用:
- Chrome 浏览器
- Edge 浏览器
- Safari 浏览器`);return}if(t){console.log("🛑 停止语音识别...");try{r.current.stop(),g(!1),console.log("✅ 语音识别已停止")}catch(n){console.error("❌ 停止语音识别失败:",n),g(!1)}}else{console.log("🎙️ 启动语音识别...");try{await r.current.start(),g(!0),console.log("✅ 语音识别已启动"),console.log("💡 请开始说话，识别结果会自动填入文本框")}catch(n){console.error("❌ 启动语音识别失败:",n),console.error("❌ 错误类型:",n instanceof Error?n.message:String(n));let e=`无法启动语音识别

`;n instanceof Error&&n.message.includes("not-allowed")?(e+=`原因：麦克风权限被拒绝

`,e+=`解决方法：
`,e+=`1. 点击地址栏左侧的锁图标
`,e+=`2. 找到"麦克风"权限
`,e+='3. 选择"允许"并刷新页面'):n instanceof Error&&n.message.includes("already-started")?(e+=`原因：语音识别已经在运行

`,e+="解决方法：请刷新页面重试"):(e+="原因："+(n instanceof Error?n.message:String(n))+`

`,e+=`建议：
`,e+=`1. 检查麦克风权限
`,e+=`2. 确保使用 Chrome/Edge/Safari 浏览器
`,e+="3. 刷新页面重试"),alert(e)}}},k=async()=>{if(i.trim()){h(!0);try{console.log("📝 [InnerWhisperJournal] 日记内容已完成，长度:",i.length),u&&u(i)}catch(n){console.error("Error saving journal:",n),u&&u(i)}finally{h(!1)}}};return o.jsxs("div",{className:"min-h-screen relative overflow-hidden",children:[o.jsxs("div",{className:"fixed inset-0 w-full h-full",style:{zIndex:1,backgroundColor:"rgba(2, 13, 10, 0.5)",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)"},children:[o.jsx("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,preload:"metadata",crossOrigin:"anonymous",poster:"/assets/79757b3cae9165b1c14088a60f3c4d94.jpg",className:"absolute inset-0 w-full h-full object-cover",style:{filter:"contrast(1.2) brightness(1.1) saturate(1.1)",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)",willChange:"transform",backgroundColor:"rgba(2, 13, 10, 0.5)"},onLoadedMetadata:n=>{n.currentTarget.play().catch(s=>console.log("Video autoplay failed:",s))},children:o.jsx("source",{src:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/fe2rqfs27y-1772615676760.mp4",type:"video/mp4"})}),o.jsx("div",{className:"absolute inset-0 w-full h-full",style:{backgroundColor:"rgba(2, 13, 10, 0.15)"}})]}),o.jsx("div",{className:"absolute top-6 left-6 z-50",children:b&&o.jsxs("button",{onClick:b,className:"flex items-center gap-2 text-amber-200/80 hover:text-amber-100 transition-colors",style:{textShadow:"0 0 10px rgba(251, 191, 36, 0.5)"},children:[o.jsx(R,{size:24}),o.jsx("span",{style:{letterSpacing:"0.2em"},children:"返回"})]})}),o.jsxs("div",{className:"relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20",children:[o.jsx("h1",{className:"journal-title mb-4",style:{color:"#F7E7CE",fontSize:"28px",fontWeight:300,letterSpacing:"0.5em",textAlign:"center",textShadow:"0 0 20px rgba(247, 231, 206, 0.6), 0 0 40px rgba(235, 200, 98, 0.3)",marginBottom:"48px"},children:c.title||"内在的低语"}),o.jsxs("div",{className:"journal-container max-w-3xl w-full relative",children:[o.jsxs("div",{className:"jade-tablet",children:[o.jsx("textarea",{ref:v,value:i,onChange:n=>x(n.target.value),placeholder:c.placeholder||"在此记录你内心深处的声音...",className:"journal-textarea",rows:12}),o.jsx("div",{className:"inner-glow"})]}),o.jsxs("div",{className:"flex justify-center mt-8 gap-4 flex-col items-center",children:[o.jsxs("button",{onClick:j,className:`voice-button ${t?"listening":""}`,disabled:p,title:t?"点击停止语音输入":"点击开始语音输入",children:[o.jsx("div",{className:"voice-button-ring",style:{opacity:f,transform:`scale(${1+f*.3})`}}),o.jsx("div",{className:"voice-button-inner",children:t?o.jsx(E,{size:24}):o.jsx(I,{size:24})}),t&&o.jsx("div",{className:"listening-indicator",children:[...Array(3)].map((n,e)=>o.jsx("div",{className:"sound-wave",style:{animationDelay:`${e*.15}s`}},e))})]}),o.jsx("div",{style:{textAlign:"center",color:"rgba(247, 231, 206, 0.7)",fontSize:"14px",letterSpacing:"0.1em",marginTop:"8px",textShadow:"0 0 10px rgba(247, 231, 206, 0.3)"},children:t?c.voice_listening||"🎤 正在聆听...":c.voice_hint||"点击喇叭开始语音输入"})]}),o.jsx("div",{className:"mt-8 max-w-md mx-auto",children:o.jsx(S,{onClick:k,disabled:!i.trim()||p,className:"w-full",children:p?"保存中...":c.submit_button||"完成书写"})})]})]}),o.jsx("style",{children:`
        .journal-title {
          animation: titleGlow 4s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(247, 231, 206, 0.6),
              0 0 40px rgba(235, 200, 98, 0.3);
          }
          50% {
            text-shadow:
              0 0 30px rgba(247, 231, 206, 0.8),
              0 0 60px rgba(235, 200, 98, 0.5),
              0 0 90px rgba(235, 200, 98, 0.2);
          }
        }

        .journal-container {
          animation: containerFloat 6s ease-in-out infinite;
        }

        @keyframes containerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .jade-tablet {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(240, 240, 235, 0.12) 0%,
            rgba(230, 235, 230, 0.15) 50%,
            rgba(235, 235, 230, 0.12) 100%
          );
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(247, 231, 206, 0.15);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 0 60px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 80px rgba(247, 231, 206, 0.1);
          overflow: hidden;
        }

        .inner-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          background: radial-gradient(
            circle at center,
            rgba(247, 231, 206, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: innerPulse 5s ease-in-out infinite;
        }

        @keyframes innerPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .journal-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          line-height: 1.8;
          letter-spacing: 0.02em;
          resize: none;
          font-weight: 300;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .journal-textarea::placeholder {
          color: rgba(247, 231, 206, 0.4);
          font-style: italic;
        }

        .journal-textarea::-webkit-scrollbar {
          width: 6px;
        }

        .journal-textarea::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb {
          background: rgba(247, 231, 206, 0.3);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 231, 206, 0.5);
        }

        .voice-button {
          position: relative;
          width: 80px;
          height: 80px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-button-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(247, 231, 206, 0.6);
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.5),
            0 0 40px rgba(235, 200, 98, 0.3),
            inset 0 0 20px rgba(247, 231, 206, 0.2);
          transition: all 0.15s ease;
        }

        .voice-button.listening .voice-button-ring {
          animation: pulseRing 1.5s ease-in-out infinite;
        }

        @keyframes pulseRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .voice-button-inner {
          position: relative;
          z-index: 2;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.25) 0%,
            rgba(235, 200, 98, 0.15) 100%
          );
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F7E7CE;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .voice-button:hover .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.35) 0%,
            rgba(235, 200, 98, 0.25) 100%
          );
          box-shadow:
            0 6px 25px rgba(247, 231, 206, 0.3),
            inset 0 0 25px rgba(255, 255, 255, 0.15);
        }

        .voice-button.listening .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.45) 0%,
            rgba(235, 200, 98, 0.35) 100%
          );
          animation: innerGlow 2s ease-in-out infinite;
        }

        @keyframes innerGlow {
          0%, 100% {
            box-shadow:
              0 4px 20px rgba(247, 231, 206, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 6px 30px rgba(247, 231, 206, 0.6),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
        }

        .listening-indicator {
          position: absolute;
          bottom: -30px;
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .sound-wave {
          width: 3px;
          height: 16px;
          background: linear-gradient(
            to top,
            rgba(247, 231, 206, 0.8),
            rgba(235, 200, 98, 0.4)
          );
          border-radius: 2px;
          animation: soundWave 0.8s ease-in-out infinite;
        }

        @keyframes soundWave {
          0%, 100% {
            height: 8px;
            opacity: 0.5;
          }
          50% {
            height: 20px;
            opacity: 1;
          }
        }
      `})]})}export{W as default};
