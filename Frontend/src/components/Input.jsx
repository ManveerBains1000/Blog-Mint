import React, { useId } from 'react'

const Input = React.forwardRef(function ({
    label,
    type = 'text',
    className = '',
    ...props
},ref){
    const id = useId();
    return (
        <div className='w-full'>
            {
                label && <label
                className='inline-block mb-1 pl-1 text-[var(--theme-muted)]'
                htmlFor={id}>
                    {label}
                </label>
            }
            <input 
            type={type}
            className={`${className} px-3 py-2 rounded-lg bg-[var(--theme-surface)] text-[var(--theme-text)] outline-none focus:bg-[var(--theme-bg)]
            duration-200 border border-[var(--theme-border)] w-full`}
            ref={ref}
            {...props}
            id={id}
             />
        </div>
    )
})

export default Input
