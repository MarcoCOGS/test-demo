import React from 'react'

interface KInputAreaProps {
  label: string
  value?: string
  placeholder?: string
  type: string
  reactHookForm: any
  customStyle?: string
  onBlur?: () => void
  disabled?: boolean
  multiline?: boolean // Nueva propiedad para habilitar el modo multilinea
  rows?: number // Define el número de filas cuando es multilinea
}

export const KInputArea: React.FC<KInputAreaProps> = ({
  placeholder,
  reactHookForm,
  customStyle,
  onBlur,
  disabled = false,
  rows = 5
}) => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <textarea
        placeholder={placeholder}
        {...reactHookForm}
        rows={rows}
        onBlur={onBlur}
        disabled={disabled}
        className={`text-base ${
          disabled ? 'bg-gray-200' : 'bg-white'
        } border-[1.5px] border-black px-3 py-2 text-black bg-transparent font-medium rounded-[3px] w-full max-h-40 focus:border-white focus:border-[0.5px] ${customStyle}`}
      />
    </div>
  )
}
