'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/auth/use-login';
import { useVerify } from '@/hooks/auth/use-verify';
import { getBackendErrorMessage } from '@/lib/error/error-util';
import { type LoginFormValues, LoginSchema } from '@/schema/login.schema';
import { type VerifyFormValues, VerifySchema } from '@/schema/verify.schema';

export function LoginForm() {
    const [emailInAction, setEmailInAction] = useState('');

    const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();
    const { mutate: verify, isPending: isVerifying, error: verifyError, reset: resetVerify } = useVerify();

    useTopBar({
        title: 'Login'
    });

    const emailForm = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: '' },
        mode: 'all'
    });

    const verifyForm = useForm<VerifyFormValues>({
        resolver: zodResolver(VerifySchema),
        defaultValues: { code: '' },
        mode: 'all'
    });

    const onLoginSubmit = (data: LoginFormValues) => {
        login(
            { data },
            {
                onSuccess: (res) => {
                    setEmailInAction(res.email);
                }
            }
        );
    };

    const onVerifySubmit = (data: VerifyFormValues) => {
        if (!emailInAction) return;
        resetVerify();
        verifyForm.clearErrors();
        verify({
            data: { email: emailInAction, code: data.code }
        });
    };

    return (
        <main className="h-[calc(100vh-3.5rem)] mx-auto flex items-center gap-3 w-full max-w-[430px] flex-col bg-white px-5 pb-10 pt-24 text-foreground">
            <section className="flex h-fit flex-col items-center py-8 text-center">
                <div className="relative w-40 h-40 overflow-hidden">
                    <Image src="/pwa/logo.svg" alt="KBU Connect" fill className="object-cover" />
                </div>
                <h1 className="-mt-8 text-3xl text-primary font-bold tracking-wide">KBU Connect</h1>
            </section>
            {emailInAction ? (
                <Form {...verifyForm}>
                    <form className="space-y-6" onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
                        <div>
                            {/* <h2 className="font-semibold">We sent a 6-digit OTP to {emailInAction}.</h2> */}
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                We sent a 6-digit OTP to {emailInAction}. <br /> Check your email (including spam folder)
                            </p>
                        </div>
                        {verifyError != null && (
                            <p className="text-sm font-medium text-destructive">{getBackendErrorMessage(verifyError)}</p>
                        )}
                        <div className="space-y-4">
                            <FormField
                                control={verifyForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="000000"
                                                autoComplete="one-time-code"
                                                className="h-11 rounded-xl border-black/10 bg-primary/10 px-4 text-base focus-visible:ring-primary/25"
                                            />
                                        </FormControl>
                                        {/* <pre className="text-xs text-red-500">{JSON.stringify(verifyForm.formState.errors, null, 2)}</pre> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={isVerifying}>
                                {isVerifying ? 'Verifying...' : 'Continue'}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Wrong email?{' '}
                                <button
                                    type="button"
                                    className="font-medium text-primary"
                                    onClick={() => {
                                        resetVerify();
                                        verifyForm.clearErrors();
                                        setEmailInAction('');
                                    }}
                                >
                                    Go back
                                </button>
                            </p>
                        </div>
                    </form>
                </Form>
            ) : (
                <Form {...emailForm}>
                    <form className="space-y-6" onSubmit={emailForm.handleSubmit(onLoginSubmit)}>
                        {loginError != null && <p className="text-sm font-medium text-destructive">{getBackendErrorMessage(loginError)}</p>}
                        <div className="space-y-4">
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground">University Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="uYOURID@ms.kbu.ac.th"
                                                type="text"
                                                inputMode="email"
                                                spellCheck={false}
                                                autoCorrect="off"
                                                autoCapitalize="off"
                                                autoComplete="email"
                                                className="h-11 rounded-xl border-black/10 bg-primary/10 px-4 text-base focus-visible:ring-primary/25"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={isLoggingIn}>
                                {isLoggingIn ? 'Sending...' : 'Continue'}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">OTP will be sent to your email</p>
                        </div>
                    </form>
                </Form>
            )}

            <p className="mt-auto px-4 text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms-and-conditions" className="font-medium text-primary hover:underline">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                    Privacy Policy
                </Link>
            </p>
        </main>
    );
}
