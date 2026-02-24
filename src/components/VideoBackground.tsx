export default function VideoBackground() {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: -2, filter: 'contrast(1.2) brightness(1.1) saturate(1.1)' }}
      >
        <source src="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4" type="video/mp4" />
      </video>

      <div
        className="fixed inset-0"
        style={{
          backgroundColor: 'rgba(2, 13, 10, 0.15)',
          zIndex: -1,
        }}
      />
    </>
  );
}
