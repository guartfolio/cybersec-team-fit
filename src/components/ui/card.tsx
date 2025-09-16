import * as React from "react"

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"rounded-2xl border border-slate-200 bg-white " + (props.className ?? "")} />
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"p-4 " + (props.className ?? "")} />
}
