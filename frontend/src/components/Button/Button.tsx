import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { ComponentProps } from "react"

const button = cva(["rounded-lg", "p-1"], {
    variants: {
        intent: {
            primary: [
                "bg-app-quaternary",
                "m-1"
            ],
            secondary: [
                "bg-app-tertiary",
            ]
        }, 
        size: {
            small: [
                "w-1/3"
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
        }
    },
    defaultVariants: {
        intent: "primary",
        size: "medium",
    }
})

type ButtonProps = VariantProps<typeof button> & ComponentProps<"button">

export default function Button({ intent, size, className, children, ...props}: ButtonProps ) {
    return(
        <>
            <button className={twMerge(className, button({ intent: intent, size: size}))} {...props}>{children}</button>
        </>
    )
}