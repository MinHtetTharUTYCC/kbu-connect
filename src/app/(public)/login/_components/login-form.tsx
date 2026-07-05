'use client';

import { useForm } from '@tanstack/react-form';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/auth/use-login';
import { useVerify } from '@/hooks/auth/use-verify';
import { LoginSchema } from '@/schema/login.schema';
import { VerifySchema } from '@/schema/verify.schema';

export function LoginForm() {
    const [emailInAction, setEmailInAction] = useState('');

    const { mutateAsync: login, isPending: isLoggingIn } = useLogin((email) =>
        setEmailInAction(email),
    );
    const { mutateAsync: verify, isPending: isVerifying } = useVerify();

    useTopBar({
        title: 'Login',
    });

    const emailForm = useForm({
        defaultValues: { email: '' },
        validators: { onSubmit: LoginSchema },
        onSubmit: async ({ value }) => await login({ data: value }),
    });

    const verifyForm = useForm({
        defaultValues: { code: '' },
        validators: { onSubmit: VerifySchema },
        onSubmit: async ({ value }) => {
            if (!emailInAction) return;
            await verify({
                data: { email: emailInAction, code: value.code },
            });
        },
    });

    return (
        <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white px-5 pb-10 pt-24 text-foreground">
            <section className="mb-16 flex flex-col items-center text-center">
                <div className="mb-6 grid size-20 place-items-center rounded-xl bg-primary text-white shadow-sm">
                    <GraduationCap className="size-10" />
                </div>
                <h1 className="text-2xl font-bold tracking-normal">
                    KBU Connect
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Connect with your campus community
                </p>
            </section>

            {emailInAction ? (
                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        verifyForm.handleSubmit();
                    }}
                >
                    <div>
                        <h2 className="text-xl font-semibold">
                            Check your email
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            We sent a 6-digit OTP to {emailInAction}.
                        </p>
                    </div>
                    <FieldGroup>
                        <verifyForm.Field name="code">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Verification code
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            autoComplete="one-time-code"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={isInvalid}
                                            className="h-11 rounded-xl border-black/10 bg-primary/10 px-4 text-base focus-visible:ring-primary/25"
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </verifyForm.Field>
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl text-base font-semibold"
                            disabled={
                                !verifyForm.state.canSubmit || isVerifying
                            }
                        >
                            {isVerifying ? 'Verifying...' : 'Continue'}
                        </Button>
                        <FieldDescription className="text-center">
                            Wrong email?{' '}
                            <button
                                type="button"
                                className="font-medium text-primary"
                                onClick={() => setEmailInAction('')}
                            >
                                Go back
                            </button>
                        </FieldDescription>
                    </FieldGroup>
                </form>
            ) : (
                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        emailForm.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <emailForm.Field name="email">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            University email
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            placeholder="uYourID@ms.kbu.ac.th"
                                            type="email"
                                            spellCheck={false}
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            autoComplete="email"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={isInvalid}
                                            className="h-11 rounded-xl border-black/10 bg-primary/10 px-4 text-base focus-visible:ring-primary/25"
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </emailForm.Field>
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl text-base font-semibold"
                            disabled={!emailForm.state.canSubmit || isLoggingIn}
                        >
                            {isLoggingIn ? 'Sending...' : 'Continue'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            OTP will be sent to your email
                        </p>
                    </FieldGroup>
                </form>
            )}

            <p className="mt-auto px-4 text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link
                    href="/terms-and-conditions"
                    className="font-medium text-primary hover:underline"
                >
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                    href="/privacy-policy"
                    className="font-medium text-primary hover:underline"
                >
                    Privacy Policy
                </Link>
                .
            </p>
            <p className="mt-3 text-center text-xs text-muted-foreground">
                <Link href="/" className="font-medium text-primary">
                    About KBU Connect
                </Link>
            </p>
        </main>
    );
}
