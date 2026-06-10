type Props = {
    message: string
}

export default function Message({ message }: Props) {
    if (message === '') {
        return null
    }

    return <div className="message">{message}</div>
}