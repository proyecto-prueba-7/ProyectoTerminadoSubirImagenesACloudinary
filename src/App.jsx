import { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import UploadToCloudinary from "./components/UploadToCloudinary";
function App() {

  const displaySuccessMessage = (mensaje) => {
    toast.success(mensaje, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }

  const displayFailedMessage = (mensaje) => {
    toast.error(mensaje, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }

  const [image, setImage] = useState([]);


  return (
    <div class="container">
      <h1 class="titleMain">Cargar Imágenes a Cloudinary</h1>
      <div class="content">
        <UploadToCloudinary  image={image} setImage={setImage} displayFailedMessage={displayFailedMessage} displaySuccessMessage={displaySuccessMessage}   />
      </div>
      <ToastContainer/>
    </div>
  )
}

export default App
