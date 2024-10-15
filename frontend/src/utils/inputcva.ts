import { cva, VariantProps } from "class-variance-authority"
import { ComponentProps } from "react"

const inputcva= cva(["rounded-lg", "p-1", "drop-shadow-xl"], {
    variants: {
        intent: {
            primary: [
                "bg-app-quaternary",
                "m-1"
            ],
            secondary: [
                "bg-app-tertiary",
            ],
            blank: {
                "bg-white"
            }
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

type InputCVAProps= VariantProps<typeof inputcva> & ComponentProps<"input">
