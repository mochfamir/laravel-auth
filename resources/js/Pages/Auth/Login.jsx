import { useEffect, useState, useRef } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    loadCaptchaEnginge,
    LoadCanvasTemplate,
    LoadCanvasTemplateNoReload,
    validateCaptcha,
} from "react-simple-captcha";

export default function Login({ status, canResetPassword }) {
    const captchaRef = useRef(null);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        email: "",
        password: "",
        remember: false,
        captcha: "",
    });
    const [counter, setCounter] = useState(0);
    const [waitTime, setWaitTime] = useState(0);

    useEffect(() => {
        loadCaptchaEnginge(4);
        return () => {
            reset("password");
        };
    }, []);

    useEffect(() => {
        // localStorage.setItem(counter);
        console.log("Counter", counter);
        console.log("Errors", errors);
        console.log("Wait", waitTime);
    }, [errors, waitTime, counter]);

    const submit = (e) => {
        try {
            if (validateCaptcha(data.captcha) == true) {
                clearErrors("captcha");
                if (counter < 2) {
                    e.preventDefault();

                    post(route("login"), {
                        onError: (e) => {
                            setCounter(counter + 1);
                            console.log(e);
                        },
                        onSuccess: () => {
                            reset("email", "password", "remember");
                            clearErrors();
                            setCounter(0);
                        },
                    });
                }
                // else if (waitTime <= 0 && counter >= 2) {
                // console.log('masuk')
                // setError("email", "counter");
                // const interval = setInterval(() => {
                //     setWaitTime(waitTime <= 30 ? waitTime - 1 : 30);

                //     if (waitTime <= 0) {
                //         clearInterval(interval);
                //     }
                // }, 1000);
                // }
            } else {
                setError("captcha", "Captcha does not match!");
            }
        } catch (error) {
            console.log("error");
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError
                        message={
                            // errors.email === "1"
                            //     ? `To many failed, wait after ${waitTime} seconds`
                            //     :
                            errors.email
                        }
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <br />
                <div>
                    <InputLabel value="captcha" />
                    <div>
                        <LoadCanvasTemplate />
                    </div>

                    <TextInput
                        id="captcha"
                        name="captcha"
                        value={data.captcha}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData("captcha", e.target.value)}
                    />

                    <InputError message={errors.captcha} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center justify-start mt-4">
                        <Link
                            href={route("register")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </Link>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <PrimaryButton className="ml-4" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
