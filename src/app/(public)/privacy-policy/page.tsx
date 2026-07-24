import type { Metadata } from 'next';
import TopBarClient from '@/components/mobile/top-bar-client';

export const metadata: Metadata = {
    title: 'Privacy Policy - KBU Connect',
    description: 'Privacy Policy for KBU Connect, a dating and social discovery platform for Kasem Bundit University students.',
    openGraph: {
        title: 'Privacy Policy - KBU Connect',
        description: 'Privacy Policy for KBU Connect, a dating and social discovery platform for Kasem Bundit University students.',
        type: 'website'
    }
};

export default function PrivacyPolicyPage() {
    return (
        <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white px-5 pb-10 text-foreground">
            <TopBarClient title="Privacy Policy" />

            <section className="my-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Introduction</p>
                <p className="text-sm leading-[1.75]">
                    Welcome to KBU Connect. We are committed to protecting your personal information and your right to privacy. This Privacy
                    Policy explains how we collect, use, disclose, and safeguard your information when you use our platform exclusively for
                    Kasem Bundit University students.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Information We Collect</p>
                <div className="space-y-3">
                    <p className="text-sm leading-[1.75]">
                        <span className="font-medium text-foreground">Personal Information:</span> We collect your university email address,
                        name, profile photos, date of birth, gender, and any other information you choose to provide in your profile.
                    </p>
                    <p className="text-sm leading-[1.75]">
                        <span className="font-medium text-foreground">Usage Data:</span> We automatically collect information about your
                        interactions with the platform, including swipes, matches, messages, and browsing patterns.
                    </p>
                    <p className="text-sm leading-[1.75] ">
                        <span className="font-medium text-foreground">Device Information:</span> We collect information about the device you
                        use to access KBU Connect, including your operating system, browser type, and device identifiers.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    How We Use Your Information
                </p>
                <div className="space-y-3">
                    <p className="text-sm leading-[1.75]">To provide, operate, and maintain the KBU Connect platform.</p>
                    <p className="text-sm leading-[1.75]">
                        To personalize your experience and deliver content and profile suggestions relevant to your interests.
                    </p>
                    <p className="text-sm leading-[1.75]">To facilitate matches and enable communication between users.</p>
                    <p className="text-sm leading-[1.75]">To send you technical notices, updates, and support messages.</p>
                    <p className="text-sm leading-[1.75]">To detect, prevent, and address fraud, abuse, and technical issues.</p>
                </div>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Sharing Your Information</p>
                <p className="text-sm leading-[1.75]">
                    We do not sell your personal information. We may share your information only in the following situations: with your
                    explicit consent, to comply with legal obligations, to protect our rights and safety, and with service providers who
                    assist us in operating the platform under strict confidentiality agreements.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Data Security</p>
                <p className="text-sm leading-[1.75]">
                    We implement appropriate technical and organizational security measures to protect your personal information. However,
                    no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
                    security.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Your Rights</p>
                <p className="text-sm leading-[1.75]">
                    You have the right to access, correct, or delete your personal information at any time. You can update your profile
                    information directly through the app. To request deletion of your account and data, please contact us through the
                    provided channels.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Changes to This Policy</p>
                <p className="text-sm leading-[1.75]">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
                    on this page and updating the effective date.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Contact Us</p>
                <p className="text-sm leading-[1.75]">
                    If you have any questions about this Privacy Policy, please contact us through the KBU Connect platform.
                </p>
            </section>

            <div className="mt-auto flex flex-col items-center gap-1 py-8">
                <span className="text-xs text-muted-foreground">Last updated: July 22, 2026</span>
                <span className="text-xs text-muted-foreground">KBU Connect</span>
            </div>
        </main>
    );
}
