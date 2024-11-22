export default async function getCroppedImg(imageSrc: any, pixelCrop: any) {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx!.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      // blob.name = 'croppedImage.jpeg';
      const croppedImageUrl = URL.createObjectURL(blob);
      resolve(croppedImageUrl);
    }, 'image/jpeg');
  });
}


export async function getCroppedImgAvatar(imageSrc: any, pixelCrop: any) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      ctx!.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    };

    image.onerror = () => {
      reject(new Error('Image load error'));
    };
  });
}
