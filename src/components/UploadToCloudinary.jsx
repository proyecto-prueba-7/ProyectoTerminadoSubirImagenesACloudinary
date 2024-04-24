import { useState } from 'react'
import { Container } from "reactstrap";
import DropZone from "react-dropzone";
import axios from "axios";
import swal from "sweetalert";
import styles from "../assets/styles/UploadToCloudinary.module.css";
import folder from "../assets/img/folder.png";

const {
    VITE_APY_KEY_CLOUDINARY,
    VITE_NAME_CLOUD_CLOUDINARY,
    VITE_PRESET_NAME
} = import.meta.env;

const UploadToCloudinary = ({ image, setImage, displaySuccessMessage, displayFailedMessage }) => {

    const [loading, setLoading] = useState('sinCargar');

    const diplayOption = (event) => {
        event.preventDefault();
        swal({
            title: "Confirmar",
            text: "Estas seguro de eliminar la imagen",
            icon: "warning",
            buttons: ['No', 'Si'],
        }).then((response) => {
            if (response) {
                setImage([]);
                setLoading('sinCargar');
                swal({
                    title: "Eliminado con éxito",
                    text: "Vuelve a cargar una imagen",
                    icon: "success",
                    buttons: 'Aceptar',
                });
            }else{
                swal({
                    title: "Eliminación no ejecutada",
                    text: "",
                    icon: "success",
                    buttons: 'Aceptar',
                });
            }
        })
    }

    const checkingType = (string) => {
        if (string.toLowerCase().includes('png')) return true
        if (string.toLowerCase().includes('jpg')) return true
        if (string.toLowerCase().includes('jpeg')) return true
        if (string.toLowerCase().includes('bpm')) return true
        if (string.toLowerCase().includes('tiff')) return true
        if (string.toLowerCase().includes('webp')) return true
        if (string.toLowerCase().includes('avif')) return true
        return false;
    }

    const verifyTypesImages = (files) => {
        let flag = true;
        files.map((item) => {
            if (!checkingType(item.name)) {
                flag = false;
            }
        })
        return flag;
    }

    const handleDrop = async (files) => {
        if (image.length === 0 && files.length <= 3) {
            if (verifyTypesImages(files)) {
                displaySuccessMessage('Formato de imagen admitido');
                const upLoaders = files.map((file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('tags', `codeinfuse,medium,gist`);
                    formData.append('upload_preset', `${VITE_PRESET_NAME}`);
                    formData.append('api_key', `${VITE_APY_KEY_CLOUDINARY}`);
                    formData.append('timestamp', Date.now() / 1000 || 0);
                    setLoading('cargando');

                    return axios.post(`https://api.cloudinary.com/v1_1/${VITE_NAME_CLOUD_CLOUDINARY}/image/upload`,
                        formData,
                        {
                            headers: { 'X-Requested-With': 'XMLHttpRequest' },
                        },

                    ).then((response) => {
                        const data = response.data;
                        const idPublic = data.public_id;
                        const fileURL = data.secure_url;

                        const newObjectImage = {
                            picture: fileURL,
                            id_picture: idPublic
                        }

                        setImage(prevState => [...prevState, newObjectImage]);

                    })
                });

                axios.all(upLoaders).then(() => {
                    setLoading('cargado');
                })

            } else {
                return displayFailedMessage('Formato de imagen no admitido. Vuelve a cargar');
            }

        } else {
            displayFailedMessage("No puedes cargar mas de tres imagenes")
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {loading === 'sinCargar' && (
                    <div className={styles.unloadedImage}>
                        <h1 className={styles.titleUnloaded}>Image:</h1>
                        <div className={styles.contentBox}>
                            <Container className={styles.contentDropzone}>
                                <DropZone
                                    className={styles.dropZone}
                                    onDrop={handleDrop}
                                    onChange={(event) => setImage(event.target.value)}
                                    value={image}
                                >

                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} />
                                                <div className={styles.contentImageFolder}>
                                                    <img src={folder} alt="" className={styles.folderImage} />
                                                </div>
                                            </div>

                                        </section>
                                    )}





                                </DropZone>



                            </Container>
                        </div>
                        <p className={styles.parrafoFolder}>
                            Arrastra o Selecciona una imagen
                        </p>

                    </div>
                )}

                {loading === 'cargando' && (
                    <div className={styles.loading}>
                        <span className={styles.loader}></span>
                    </div>
                )}

                {loading === 'cargado' && (
                    <div className={styles.uploaded}>
                        <button onClick={diplayOption} className={styles.buttonStyles}>
                            Volver a Cargar
                        </button>
                        <div className={styles.contentImagePreview}>
                            {image.map((item) => {
                                return <img src={item.picture} title={item.id_picture} key={item.id_picture} className={styles.imageUploaded} />
                            })}
                        </div>


                    </div>
                )}





            </div>




        </div>
    )
}

export default UploadToCloudinary