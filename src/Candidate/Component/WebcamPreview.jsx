import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamPreview = ({
  webcamRef,
  canvasRef,
  localStream,
  streamRef,
  hasVideoFrame,
  floatingPos,
  setFloatingPos,
  selectedDeviceId,
}) => {
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  return (
    <div
      onMouseDown={(e) => {
        dragRef.current.dragging = true;
        dragRef.current.offsetX = e.clientX - floatingPos.x;
        dragRef.current.offsetY = e.clientY - floatingPos.y;
        try { document.body.style.cursor = 'grabbing'; } catch (e) {}
        const onMouseMove = (ev) => {
          if (!dragRef.current.dragging) return;
          setFloatingPos({ x: ev.clientX - dragRef.current.offsetX, y: ev.clientY - dragRef.current.offsetY });
        };
        const onMouseUp = () => {
          dragRef.current.dragging = false;
          try { document.body.style.cursor = ''; } catch (e) {}
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        dragRef.current.dragging = true;
        dragRef.current.offsetX = touch.clientX - floatingPos.x;
        dragRef.current.offsetY = touch.clientY - floatingPos.y;
      }}
      onTouchMove={(e) => {
        if (!dragRef.current.dragging) return;
        const touch = e.touches[0];
        setFloatingPos({ x: touch.clientX - dragRef.current.offsetX, y: touch.clientY - dragRef.current.offsetY });
      }}
      onTouchEnd={() => { dragRef.current.dragging = false; }}
      style={{
        position: 'fixed',
        left: floatingPos.x,
        top: floatingPos.y,
        width: 300,   //Change the size of webcam from here
        height: 200,
        zIndex: 3000,
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(6px)',
        cursor: 'grab'
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored={true}
        forceScreenshotSourceSize={false}
        videoConstraints={selectedDeviceId ? { deviceId: selectedDeviceId } : { facingMode: 'user' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000', zIndex: 2 }}
      />

      {/* Canvas fallback: show only when stream exists but video has no frames */}
      {(() => {
        const hasStream = !!(localStream || streamRef.current || window.__candidateCameraStream);
        const showCanvas = hasStream && !hasVideoFrame;
        return (
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: showCanvas ? 'block' : 'none', zIndex: 1 }}
          />
        );
      })()}

      <div style={{position:'absolute', left:10, top:8, padding:'4px 8px', background:'rgba(0,0,0,0.45)', color:'#fff', fontSize:12, fontWeight:600, borderRadius:999, display:'flex', alignItems:'center', gap:6}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
        Drag to move
      </div>

      {!(localStream || streamRef.current || window.__candidateCameraStream) ? (
        <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:'100%',height:'100%', background:'#000'}} />
          <div style={{position:'absolute', color:'#fff', fontSize:13}}>No camera stream</div>
        </div>
      ) : null}
    </div>
  );
};

export default WebcamPreview;
