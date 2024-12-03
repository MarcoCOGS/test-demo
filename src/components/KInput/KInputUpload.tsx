import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowUpFromBracket)

interface KInputUploadProps {
  label?: string // Texto que aparece en el botón
  accept?: string // Tipos de archivos permitidos
  onFileChange?: (file: File | null) => void // Callback al seleccionar archivo
  customStyle?: string // Estilos personalizados
  disabled?: boolean // Deshabilitar el botón
}

export const KInputUpload: React.FC<KInputUploadProps> = ({
  label = 'Subir Archivo',
  accept,
  onFileChange,
  customStyle,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleIconClick = () => {
    if (!disabled && (fileInputRef.current != null)) {
      fileInputRef.current.click() // Abrir el selector de archivos
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target.files != null) && event.target.files.length > 0) {
      onFileChange?.(event.target.files[0]) // Pasar el archivo seleccionado al callback
    } else {
      onFileChange?.(null)
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={handleIconClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg text-base font-bold hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${customStyle}`}
      >
        <FontAwesomeIcon icon="arrow-up-from-bracket" size="lg" />
        <span>{label}</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden" // Ocultar el input de archivo real
        onChange={handleFileChange}
      />
    </div>
  )
}
