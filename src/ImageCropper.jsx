import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

function ImageCropper({ imageSrc, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 500);
    onSave(croppedImage);
  };

  return (
    <div>
      <div style={{ position: 'relative', height: 400, width: 400 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <button onClick={handleSave} style={{ marginTop: '10px' }}>Save Cropped Image</button>
    </div>
  );
}

export default ImageCropper;