import { forwardRef } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import cn from 'classnames'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
    showCharCount?: boolean
    maxLength?: number
    register?: UseFormRegisterReturn
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, showCharCount, maxLength, register, className, id, rows = 15, ...props }, ref) => {
        const textareaId = id || register?.name
        const value = props.value as string | undefined
        const charCount = value?.length || 0

        return (
            <div>
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    ref={ref}
                    {...register}
                    {...props}
                    rows={rows}
                    className={cn(
                        'w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent',
                        className
                    )}
                />
                <div className="flex items-center justify-between mt-1">
                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}
                    {showCharCount && maxLength && (
                        <span className="text-xs text-gray-500 ml-auto">
                            {charCount} / {maxLength}
                        </span>
                    )}
                </div>
                {helperText && !error && (
                    <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export default Textarea