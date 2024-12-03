export const KInputTable = ({
  label,
  value,
  placeholder,
  type,
  reactHookForm,
  customStyle,
  onBlur,
  disabled = false
}: {
  label: string
  value?: string
  type: string
  reactHookForm: any
  customStyle?: string
  placeholder?: string
  onBlur?: () => void
  disabled?: boolean
}) => {
  return (
  <div className='relative h-full flex items-stretch'>
    {/* <div className={`${ disabled ? 'bg-gray-200':'bg-white'} h-2 text-sm ${disabled? 'text-gray-200':'text-white'} w-[${label.length * 25}px] max-w-[600px] px-1 pointer-events-none absolute left-1`}>{label}</div>
    <div className='text-sm bg-none h-2asd absolute bottom-10 left-1 px-1 font-medium pointer-events-none'>{label}</div> */}
    <input
      placeholder={placeholder}
      {...reactHookForm}
      type={type}
      autoComplete="false"
      onFocus={(e) => { e.target.setAttribute('autoComplete', 'none') }}
      autoFocus
      list="autocompleteOff"
      onBlur={onBlur}
      disabled= {disabled}
      className={`text-base ${disabled ? 'bg-gray-200' : 'bg-white'} border-[1.5px] border-transparent px-3 text-black bg-transparent font-medium  flex-grow rounded-[3px] flex-1 h-full  w-full focus:border-white focus:border-[0.5px] ${customStyle}`}
      />
  </div>
  )
}
