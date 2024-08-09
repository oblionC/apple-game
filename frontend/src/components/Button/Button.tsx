export default function Button({ text }: { text: string }) {
    return(
        <button className="w-9/12 rounded-lg p-1 m-1 bg-app-quaternary">{text}</button>
    )
}