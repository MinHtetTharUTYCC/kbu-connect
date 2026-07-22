import type { Metadata } from 'next';
import TopBarClient from '@/components/mobile/top-bar-client';

export const metadata: Metadata = {
    title: 'Terms and Conditions - KBU Connect',
    description: 'Terms and Conditions for KBU Connect, a dating and social discovery platform for Kasem Bundit University students.',
    openGraph: {
        title: 'Terms and Conditions - KBU Connect',
        description: 'Terms and Conditions for KBU Connect, a dating and social discovery platform for Kasem Bundit University students.',
        type: 'website'
    }
};

export default function TermsAndConditionsPage() {
    return (
        <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white px-5 pb-10 text-foreground">
            <TopBarClient title="Terms and Conditions" />

            <section className="my-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Acceptance of Terms</p>
                <p className="text-sm leading-[1.75]">
                    By accessing or using KBU Connect, you agree to be bound by these Terms and Conditions. If you do not agree to these
                    terms, please do not use the platform. KBU Connect is exclusively available to current students of Kasem Bundit
                    University with a valid{' '}
                    <code className="rounded border border-border bg-muted px-1.5 py-px font-mono text-[12px]">@ms.kbu.ac.th</code> email
                    address.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Eligibility</p>
                <p className="text-sm leading-[1.75]">
                    You must be a current student at Kasem Bundit University to use KBU Connect. By creating an account, you represent and
                    warrant that you meet this eligibility requirement and that all information you provide is accurate and truthful.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">User Conduct</p>
                <div className="space-y-3">
                    <p className="text-sm leading-[1.75]">
                        You agree to use KBU Connect only for lawful purposes and in accordance with these Terms. You shall not:
                    </p>
                    <p className="text-sm leading-[1.75]">Impersonate another person or misrepresent your identity or affiliation.</p>
                    <p className="text-sm leading-[1.75]">
                        Post or transmit content that is harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
                    </p>
                    <p className="text-sm leading-[1.75]">
                        Attempt to gain unauthorized access to other user accounts or the platform systems.
                    </p>
                    <p className="text-sm leading-[1.75]">Use automated tools or bots to interact with the platform.</p>
                </div>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Account Responsibility</p>
                <p className="text-sm leading-[1.75]">
                    You are responsible for maintaining the confidentiality of your account and for all activities that occur under your
                    account. You agree to immediately notify us of any unauthorized use of your account.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Intellectual Property</p>
                <p className="text-sm leading-[1.75]">
                    All content, features, and functionality of KBU Connect are owned by us and are protected by international copyright,
                    trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without
                    our express written permission.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Limitation of Liability</p>
                <p className="text-sm leading-[1.75]">
                    KBU Connect is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Termination</p>
                <p className="text-sm leading-[1.75]">
                    We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we
                    believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Changes to Terms</p>
                <p className="text-sm leading-[1.75] ">
                    We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on
                    this page and updating the effective date. Your continued use of the platform after any changes constitutes acceptance
                    of the new Terms.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Contact Us</p>
                <p className="text-sm leading-[1.75]">
                    If you have any questions about these Terms and Conditions, please contact us through the KBU Connect platform.
                </p>
            </section>

            <div className="mt-auto flex flex-col items-center gap-1 py-8">
                <span className="text-xs text-muted-foreground">Last updated: July 22, 2026</span>
                <span className="text-xs text-muted-foreground">KBU Connect</span>
            </div>
        </main>
    );
}
