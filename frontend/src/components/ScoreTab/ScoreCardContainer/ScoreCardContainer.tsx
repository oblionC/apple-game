import { ReactNode } from "react";

export default function ScoreCardContainer({ children }: { children: ReactNode}) {
    return (
        <table className="table-auto text-center w-9/12 border-separate border-spacing-y-3 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-app-tertiary h-20 rounded-lg overflow-hidden">
                    <th scope="col" className="first:rounded-l-lg overflow-hidden">Position</th>
                    <th scope="col">Username</th>
                    <th scope="col">Score</th>
                    <th scope="col" className="last:rounded-r-lg overflow-hidden">Time</th>
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>

    )
}