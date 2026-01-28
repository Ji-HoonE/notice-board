import { forwardRef } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import cn from 'classnames'
import { AiOutlineDown } from 'react-icons/ai'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    register?: UseFormRegisterReturn
    options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, register, className, id, options, ...props }, ref) => {
        const selectId = id || register?.name
        return (
            <div>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        {...register}
                        {...props}
                        className={cn(
                            'w-full appearance-none',
                            'px-4 py-2.5 pr-10 text-sm',
                            'border rounded-lg bg-white cursor-pointer',
                            'transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            'hover:border-gray-400',
                            error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300',
                            className
                        )}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <AiOutlineDown className="w-4 h-4" />
                    </div>
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-xs text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select