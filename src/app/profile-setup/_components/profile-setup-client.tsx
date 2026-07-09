'use client';

import {
    type NewGalleryImageDto,
    UpdateProfileDtoFaculty,
    UpdateProfileDtoGender,
    UpdateProfileDtoInterestsItem,
    UpdateProfileDtoLookingFor,
    UpdateProfileDtoNationality,
    UpdateProfileDtoPreferredGender
} from '@services/model';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Chip, EmptyState } from '@/components/mobile/app-chrome';
import { FullScreenImageViewer } from '@/components/mobile/full-screen-image-viewer';
import { AvatarUploadStep, GalleryUploadStep } from '@/components/mobile/profile-media-upload';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { Button } from '@/components/ui/button';
import { useUpdateMyProfile } from '@/hooks/profile/use-update-my-profile';
import { formatEnum, formatFaculty } from '@/lib/utils';

const faculties = Object.values(UpdateProfileDtoFaculty);
const interests = Object.values(UpdateProfileDtoInterestsItem);
const nationalities = Object.values(UpdateProfileDtoNationality);
const lookingForOptions = Object.values(UpdateProfileDtoLookingFor);

type SetupStep = 'basic' | 'academic' | 'preferences' | 'avatar' | 'gallery' | 'review';

const steps: Array<{ id: SetupStep; eyebrow: string; title: string }> = [
    { id: 'basic', eyebrow: 'Step 1 of 6', title: 'Start with the essentials' },
    {
        id: 'academic',
        eyebrow: 'Step 2 of 6',
        title: 'Tell us about your campus life'
    },
    {
        id: 'preferences',
        eyebrow: 'Step 3 of 6',
        title: 'Set your matching preferences'
    },
    { id: 'avatar', eyebrow: 'Step 4 of 6', title: 'Add your profile picture' },
    { id: 'gallery', eyebrow: 'Step 5 of 6', title: 'Add your gallery' },
    {
        id: 'review',
        eyebrow: 'Step 6 of 6',
        title: 'Review your profile setup'
    }
];

export function ProfileSetupClient() {
    const { user, isLoading } = useAuthContext();
    const current = user?.user;

    const isEditMode = Boolean(user?.isComplete);

    const { mutate: updateProfile, isPending: isProfileUpdating } = useUpdateMyProfile(isEditMode ? '/profile/me' : '/discover');

    const [stepIndex, setStepIndex] = useState(0);
    const [name, setName] = useState(current?.name ?? '');
    const [bio, setBio] = useState(current?.bio ?? '');
    const [birthYear, setBirthYear] = useState(current?.birthYear ? Number(current.birthYear) : 2003);
    const [avatarUrl, setAvatarUrl] = useState(current?.avatarUrl ?? '');
    const [gallery, setGallery] = useState<NewGalleryImageDto[]>(() =>
        (current?.gallery ?? []).map((item, index) => ({
            key: item.id,
            imageUrl: item.imageUrl,
            order: item.order ?? index
        }))
    );
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [faculty, setFaculty] = useState<UpdateProfileDtoFaculty>(current?.faculty ?? UpdateProfileDtoFaculty.CIVIL);
    const [gender, setGender] = useState<UpdateProfileDtoGender>(current?.gender ?? UpdateProfileDtoGender.OTHER);
    const [preferredGender, setPreferredGender] = useState<UpdateProfileDtoPreferredGender>(
        current?.preferredGender ?? UpdateProfileDtoPreferredGender.ALL
    );
    const [nationality, setNationality] = useState<UpdateProfileDtoNationality>(current?.nationality ?? UpdateProfileDtoNationality.THAI);
    const [minPreferredAge, setMinPreferredAge] = useState(current?.minPreferredAge ?? 18);
    const [maxPreferredAge, setMaxPreferredAge] = useState(current?.maxPreferredAge ?? 30);
    const [selectedInterests, setSelectedInterests] = useState<UpdateProfileDtoInterestsItem[]>(() =>
        current?.interests?.length
            ? (current.interests as UpdateProfileDtoInterestsItem[])
            : [UpdateProfileDtoInterestsItem.MUSIC, UpdateProfileDtoInterestsItem.SPORTS]
    );
    const [lookingFor, setLookingFor] = useState<UpdateProfileDtoLookingFor>(
        current?.lookingFor ?? UpdateProfileDtoLookingFor.OPEN_TO_ANYTHING
    );

    useTopBar({
        title: isEditMode ? 'Edit Profile' : 'UniMatch',
        action: isEditMode ? (
            <a
                href="/profile/me"
                className="grid size-10 place-items-center rounded-full text-muted-foreground transition active:scale-95"
                aria-label="Cancel editing"
            >
                <X className="size-5" />
            </a>
        ) : (
            <div className="w-10" />
        )
    });

    const activeStep = steps[stepIndex];
    const isLastStep = stepIndex === steps.length - 1;
    const canGoNext = useMemo(() => {
        if (activeStep.id === 'basic') return Boolean(name.trim()) && birthYear >= 1900;
        if (activeStep.id === 'academic') return selectedInterests.length > 0;
        if (activeStep.id === 'preferences') return minPreferredAge <= maxPreferredAge;
        if (activeStep.id === 'avatar') return Boolean(avatarUrl);
        if (activeStep.id === 'gallery') return gallery.length > 0;
        return true;
    }, [activeStep.id, avatarUrl, birthYear, gallery.length, maxPreferredAge, minPreferredAge, name, selectedInterests.length]);

    if (isLoading) {
        return <EmptyState title="Loading profile" body="Setting up your account." icon={'loader'} />;
    }
    if (!current) {
        return <EmptyState title="Loading profile" body="Setting up your account." icon={'loader'} />;
    }

    function toggleInterest(value: UpdateProfileDtoInterestsItem) {
        setSelectedInterests((items) => (items.includes(value) ? items.filter((item) => item !== value) : [...items, value]));
    }

    function handleNext() {
        if (!canGoNext) return;
        setStepIndex((value) => Math.min(value + 1, steps.length - 1));
    }

    function handlePrevious() {
        setStepIndex((value) => Math.max(value - 1, 0));
    }

    function handleFinish() {
        if (!canGoNext) return;
        updateProfile({
            data: {
                name: name.trim() || current?.name || 'KBU Student',
                avatarUrl,
                bio: bio.trim() || 'KBU student looking to meet people on campus.',
                faculty,
                interests: selectedInterests,
                gender,
                birthYear,
                minPreferredAge,
                maxPreferredAge,
                preferredGender,
                nationality,
                lookingFor,
                preferredFaculties: [faculty],
                preferredNationalities: [nationality],
                gallery: gallery.map((item, order) => ({ ...item, order }))
            }
        });
    }

    return (
        <>
            <div className="h-1 bg-muted">
                <div
                    className="h-full bg-primary transition-all"
                    style={{
                        width: `${((stepIndex + 1) / steps.length) * 100}%`
                    }}
                />
            </div>
            <main className="flex flex-1 flex-col overflow-y-auto px-5 pb-28 pt-8">
                <section className="mb-8">
                    <p className="mb-1 text-xs font-semibold text-primary">{activeStep.eyebrow}</p>
                    <h1 className="text-xl font-medium leading-7">{activeStep.title}</h1>
                </section>

                {activeStep.id === 'basic' && (
                    <section className="grid gap-5">
                        <Field label="Display name" htmlFor="name">
                            <input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Your name"
                                className="h-11 w-full rounded-xl border border-black/10 bg-muted px-4 outline-none focus:border-primary"
                            />
                        </Field>
                        <Field label="Birth year" htmlFor="birthYear">
                            <select
                                id="birthYear"
                                value={birthYear}
                                onChange={(event) => setBirthYear(Number(event.target.value))}
                                className="h-11 w-full rounded-xl border border-black/10 bg-muted px-4 outline-none focus:border-primary"
                            >
                                {Array.from({ length: 23 }, (_, i) => 2008 - i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Short bio" htmlFor="bio">
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                placeholder="Coffee enthusiast, design lover, and always up for campus events."
                                className="min-h-28 w-full resize-none rounded-xl border border-black/10 bg-muted px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                            <span className={`mt-1 block text-sm ${bio.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                {bio.length} / 500
                            </span>
                        </Field>
                    </section>
                )}

                {activeStep.id === 'academic' && (
                    <section className="grid gap-8">
                        <div>
                            <div className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground">Select faculty</div>
                            <div className="grid grid-cols-3 gap-2">
                                {faculties.map((item) => (
                                    // <button
                                    //     key={item}
                                    //     type="button"
                                    //     onClick={() => setFaculty(item)}
                                    //     className={
                                    //         faculty === item
                                    //             ? 'h-8 rounded-full border border-primary bg-primary px-2 text-sm font-semibold text-white'
                                    //             : 'h-8 rounded-full border border-black/10 bg-white px-2 text-sm font-semibold text-muted-foreground'
                                    //     }
                                    // >
                                    //     {formatEnum(item)}
                                    // </button>
                                    <button type="button" key={item} onClick={() => setFaculty(item)}>
                                        <Chip active={faculty === item} wfull>
                                            {formatFaculty(item)}
                                        </Chip>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">Interests</div>
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest) => (
                                    <button type="button" key={interest} onClick={() => toggleInterest(interest)}>
                                        <Chip active={selectedInterests.includes(interest)}>{formatEnum(interest)}</Chip>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeStep.id === 'preferences' && (
                    <section className="grid gap-5">
                        <Select
                            label="Your Identity"
                            value={gender}
                            onChange={(value) => setGender(value as UpdateProfileDtoGender)}
                            options={Object.values(UpdateProfileDtoGender)}
                        />
                        <Select
                            label="Interested In"
                            value={preferredGender}
                            onChange={(value) => setPreferredGender(value as UpdateProfileDtoPreferredGender)}
                            options={Object.values(UpdateProfileDtoPreferredGender)}
                        />
                        <Select
                            label="Looking For"
                            value={lookingFor}
                            onChange={(value) => setLookingFor(value as UpdateProfileDtoLookingFor)}
                            options={lookingForOptions}
                        />
                        <Select
                            label="Nationality"
                            value={nationality}
                            onChange={(value) => setNationality(value as UpdateProfileDtoNationality)}
                            options={nationalities}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Minimum Age"
                                value={String(minPreferredAge)}
                                onChange={(value) => setMinPreferredAge(Number(value))}
                                options={Array.from({ length: 23 }, (_, i) => String(18 + i))}
                            />
                            <Select
                                label="Maximum Age"
                                value={String(maxPreferredAge)}
                                onChange={(value) => setMaxPreferredAge(Number(value))}
                                options={Array.from({ length: 23 }, (_, i) => String(18 + i))}
                            />
                        </div>
                    </section>
                )}

                {activeStep.id === 'avatar' && (
                    <AvatarUploadStep name={name || 'KBU Student'} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
                )}

                {activeStep.id === 'gallery' && (
                    <GalleryUploadStep gallery={gallery} onGalleryChange={setGallery} onImageClick={(index) => setViewerIndex(index)} />
                )}

                {activeStep.id === 'review' && (
                    <section className="space-y-4">
                        <ReviewRow label="Name" value={name || 'KBU Student'} />
                        <ReviewRow label="Faculty" value={faculty} />
                        <ReviewRow label="Identity" value={gender} />
                        <ReviewRow label="Interested in" value={preferredGender} />
                        <ReviewRow label="Looking for" value={lookingFor} />
                        <ReviewRow label="Age range" value={`${minPreferredAge} - ${maxPreferredAge}`} />
                        <ReviewRow label="Avatar" value={avatarUrl ? 'Uploaded' : 'Missing'} />
                        <ReviewRow label="Gallery" value={`${gallery.length} photo${gallery.length === 1 ? '' : 's'}`} />
                        <div className="rounded-xl border border-black/10 bg-muted p-4">
                            <div className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">Interests</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedInterests.map((interest) => (
                                    <Chip key={interest} active>
                                        {formatEnum(interest)}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="fixed bottom-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 gap-3 bg-linear-to-t from-white via-white to-white/0 px-5 py-6">
                <Button
                    type="button"
                    variant="outline"
                    className="h-12 flex-1 rounded-full text-base font-semibold"
                    onClick={handlePrevious}
                    disabled={stepIndex === 0 || isProfileUpdating}
                >
                    <ArrowLeft className="size-5" /> Prev
                </Button>
                <Button
                    type="button"
                    className="h-12 flex-1 rounded-full text-base font-semibold"
                    onClick={isLastStep ? handleFinish : handleNext}
                    disabled={!canGoNext || isProfileUpdating}
                >
                    {isLastStep ? (isProfileUpdating ? 'Saving...' : isEditMode ? 'Save' : 'Finish') : 'Next'}
                    {isLastStep ? <Check className="size-5" /> : <ArrowRight className="size-5" />}
                </Button>
            </footer>

            {viewerIndex !== null && (
                <FullScreenImageViewer
                    images={gallery.map((item) => item.imageUrl)}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
        </>
    );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground">
                {label}
            </label>
            {children}
        </div>
    );
}

function Select({
    label,
    value,
    options,
    onChange
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <label>
            <span className="mb-2 block text-sm font-semibold tracking-wide text-muted-foreground">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-black/10 bg-muted px-4 outline-none focus:border-primary"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {formatEnum(option)}
                    </option>
                ))}
            </select>
        </label>
    );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-muted p-4">
            <span className="text-sm font-semibold tracking-wide text-muted-foreground">{label}</span>
            <span className="truncate text-sm font-semibold">{label === 'Name' ? value : formatEnum(value)}</span>
        </div>
    );
}
