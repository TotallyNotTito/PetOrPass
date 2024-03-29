import errorImage from "../assets/error_message.svg";
import React from "react";

export type ErrorProps = {
    errorMessage: string
}
export function ErrorMessage(props: ErrorProps) {
    let {errorMessage} = props;

    return (
        <main className="container below-navbar text-center">
            <div className="row">
                <img
                    src={errorImage}
                    alt="404 error message"
                    title="404 error message"
                    className="mx-auto img-fluid col-10 col-sm-8 col-md-7 col-lg-5"
                />
            </div>
            <div className="row justify-content-center">
                <h1 className="display-6 col-12 col-lg-10 mt-5">
                    {errorMessage}
                </h1>
            </div>
        </main>
    );
}
