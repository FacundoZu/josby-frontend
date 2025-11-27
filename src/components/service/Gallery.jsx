import { useState } from "react";

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={selectedImage} 
          alt="Service Preview" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setSelectedImage(img)}
            className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Gallery