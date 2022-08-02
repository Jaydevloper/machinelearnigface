import * as facemash from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs'
import './App.css'
import Webcam from 'react-webcam';
import { useEffect, useRef } from 'react';
import { drawMesh } from './utils';

function App() {
  const webRef = useRef()
  const canvasRef = useRef()
  const runFacemash = async() =>{
    const net = await facemash.load(facemash.SupportedPackages.mediapipeFacemesh)
    setInterval(() =>{
      detect(net)
    },10)
    
  }

  const detect = async(net) => {
    if (typeof webRef.current !== 'undefined' && webRef.current !== null && webRef.current.video.readyState ===4){
      const video = webRef.current.video
      const videoWidth = webRef.current.video.videoWidth
      const videoHeight = webRef.current.video.videoHeight

      webRef.current.video.widht = videoWidth
      webRef.current.video.height = videoHeight

      canvasRef.current.widht = videoWidth
      canvasRef.current.height = videoHeight

      const face = await net.estimateFaces({input: video})
      console.log(face);

      const ctx = canvasRef.current.getContext('2d')
      requestAnimationFrame(() => {
        drawMesh(face,ctx)
      })
    }
  }
  useEffect(()=>{
      runFacemash()
  },[])
  return (
    <div className='App'>
    <header className='App-header'>
      <Webcam ref={webRef} className='webcam' />
      <canvas ref={canvasRef} className='canvas' />
    </header>
  </div>
  );
}

export default App;
