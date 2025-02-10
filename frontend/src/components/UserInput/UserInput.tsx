import { ChangeEventHandler } from "react";

export default function UserInput({ name, error, type, value, onChange }: {name: string, error?: string, type?: string, value: string, onChange: ChangeEventHandler<HTMLInputElement>}) {
    return(
        <div className="w-9/12 flex flex-col justify-center items-center mb-4">
            <label className="w-full text-left text-slate-100">
                {name}
            </label>
            <label className="w-full text-left text-slate-100">
                {error}
            </label>
            <input type={type} value={value} onChange={onChange} name={name} className="w-full p-4 rounded-lg" />
        </div>
    )
}