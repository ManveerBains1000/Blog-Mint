import React,{useId} from 'react'

const Select = ({
    label,
    options,
    className = "",
    ...props
},ref) => {
    const id = useId();

  return (
    <div className='w-full'>
        {label && <label htmlFor={id}></label>}
        <select
        {...props}
        id = {id}
        className={`${className} px-3 py-2 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text)] outline-none focus:bg-[var(--theme-bg)] 
        duration-200 border border-[var(--theme-border)] w-full`}
        ref = {ref}
        >
            {options?.map((option)=>(
                <option key={option} value={option}>{option}</option>
            ))}
        </select>  
    </div>
  )
}

export default React.forwardRef(Select);
