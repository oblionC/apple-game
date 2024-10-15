export default function UserInput({ name, error, ...props }: {name: string, error: string | undefined}) {
    return(
        <div className="w-9/12 flex flex-col justify-center items-center mb-4">
            <label className="w-full text-left text-slate-100">
                {name}
            </label>
            <label className="w-full text-left text-slate-100">
                {error}
            </label>
            <input {...props} name={name} className="w-full p-4 rounded-lg" />
        </div>
    )
}