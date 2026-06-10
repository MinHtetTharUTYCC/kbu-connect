'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/auth/use-login';
import { useVerify } from '@/hooks/auth/use-verify';
import { LoginSchema } from '@/schema/login.schama';
import { VerifySchema } from '@/schema/verify.schema';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

export function LoginForm() {
    const [emailInAction, setEmailInAction] = useState('');

    const login = useLogin((email) => setEmailInAction(email));
    const verify = useVerify();

    const emailForm = useForm({
        defaultValues: { email: '' },
        validators: { onSubmit: LoginSchema },
        onSubmit: async ({ value }) => {
            await login.mutateAsync({ data: value });
        },
    });

    const verifyForm = useForm({
        defaultValues: { code: '' },
        validators: { onSubmit: VerifySchema },
        onSubmit: async ({ value }) => {
            if (!emailInAction) return;

            await verify.mutateAsync({ data: { email: emailInAction, code: value.code } });
        },
    });

    if (emailInAction) {
        return (
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                        We sent a 6-digit code to{' '}
                        <span className="font-medium text-foreground">{emailInAction}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            verifyForm.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <verifyForm.Field name="code">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
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
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </verifyForm.Field>

                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!verifyForm.state.canSubmit || verify.isPending}
                                >
                                    {verify.isPending ? 'Verifying…' : 'Continue'}
                                </Button>

                                <FieldDescription className="text-center">
                                    Wrong email?{' '}
                                    <button
                                        type="button"
                                        className="underline underline-offset-4"
                                        onClick={() => setEmailInAction('')}
                                    >
                                        Go back
                                    </button>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your KBU email to receive a verification code
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        emailForm.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <emailForm.Field name="email">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            placeholder="uYourID@ms.kbu.ac.th"
                                            autoComplete="email"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </emailForm.Field>

                        <Field>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!emailForm.state.canSubmit || login.isPending}
                            >
                                {login.isPending ? 'Sending…' : 'Get code'}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
