import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { ComponentProps } from "react"

const button = cva(["rounded-lg", "p-1", "drop-shadow-xl", "min-w-fit", "min-h-fit", "text-sm", "lg:text-md"], {
    variants: {
        intent: {
            primary: [
                "bg-app-quaternary",
                "my-1"
            ],
            secondary: [
                "bg-app-tertiary",
                
            ],
            blank: [
                "bg-white"
            ] 
        }, 
        size: {
            small: [
                "w-1/3",
            ],
            medium: [
                "w-9/12",
            ],
            large: [
                "w-9/12",
                "p-4"
            ],
            full: [
                "w-full"
            ]
        },
        border: {
            none: [
                "border-transparent"
            ],
            white: [
                "border-2",
                "border-slate-50",
            ]
        }
    },
    defaultVariants: {
        intent: "primary",
        size: "medium",
        border: "none",
    }
})

type ButtonProps = VariantProps<typeof button> & ComponentProps<"button">

export default function Button({ intent, size, border, className, children, ...props}: ButtonProps ) {
    return(
        <>
            <button className={twMerge(className, button({ intent: intent, size: size, border: border}))} {...props}>{children}</button>
        </>
    )
}