export type ErrorProps = {
    errorMessage: string,
}
export function ErrorMessage(props: ErrorProps) {
    let {errorMessage} = props;

    return (
        <div className="below-navbar">
            {errorMessage}
        </div>
    );
}
