export const compressImage = async (file, { maxSizeMB = 0.3, maxWidthOrHeight = 800 } = {}) => {
  return new Promise((resolve) => {
    // Kreiraj canvas i context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Kreiraj Image objekat
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      // Izračunaj nove dimenzije
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidthOrHeight) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        }
      } else {
        if (height > maxWidthOrHeight) {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }
      }
      
      // Postavi dimenzije canvasa
      canvas.width = width;
      canvas.height = height;
      
      // Nacrtaj sliku na canvasu
      ctx.drawImage(img, 0, 0, width, height);
      
      // Konvertuj u Blob sa smanjenim kvalitetom
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        },
        'image/jpeg',
        0.3 // Kvalitet 30%
      );
    };
  });
}; 