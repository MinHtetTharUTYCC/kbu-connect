"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { Chip, MobileScreen, TopBar } from "@/components/mobile/app-chrome";
import {
  AvatarUploadStep,
  GalleryUploadStep,
} from "@/components/mobile/profile-media-upload";
import { Button } from "@/components/ui/button";
import { useUpdateMyProfile } from "@/hooks/profile/use-update-my-profile";
import type { NewGalleryImageDto } from "../../../../../services/model";
import {
  UpdateProfileDtoFaculty,
  UpdateProfileDtoGender,
  UpdateProfileDtoInterestsItem,
  UpdateProfileDtoNationality,
  UpdateProfileDtoPreferredGender,
} from "../../../../../services/model";

const faculties = Object.values(UpdateProfileDtoFaculty);
const interests = Object.values(UpdateProfileDtoInterestsItem);
const nationalities = [
  UpdateProfileDtoNationality.THAI,
  UpdateProfileDtoNationality.BURMESE,
  UpdateProfileDtoNationality.CHINESE,
  UpdateProfileDtoNationality.JAPANESE,
  UpdateProfileDtoNationality.KOREAN,
  UpdateProfileDtoNationality.OTHER,
];

type SetupStep =
  | "basic"
  | "academic"
  | "preferences"
  | "avatar"
  | "gallery"
  | "review";

const steps: Array<{ id: SetupStep; eyebrow: string; title: string }> = [
  { id: "basic", eyebrow: "STEP 1 OF 6", title: "Start with the essentials" },
  {
    id: "academic",
    eyebrow: "STEP 2 OF 6",
    title: "Tell us about your campus life",
  },
  {
    id: "preferences",
    eyebrow: "STEP 3 OF 6",
    title: "Set your matching preferences",
  },
  { id: "avatar", eyebrow: "STEP 4 OF 6", title: "Add your avatar" },
  { id: "gallery", eyebrow: "STEP 5 OF 6", title: "Add your gallery" },
  { id: "review", eyebrow: "STEP 6 OF 6", title: "Review your profile setup" },
];

export function ProfileSetupClient() {
  const { user } = useAuthContext();
  const current = user?.user;
  const updateProfile = useUpdateMyProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState(current?.name ?? "");
  const [bio, setBio] = useState(current?.bio ? String(current.bio) : "");
  const [birthYear, setBirthYear] = useState(
    current?.birthYear ? Number(current.birthYear) : 2003,
  );
  const [avatarUrl, setAvatarUrl] = useState(
    (current?.avatarUrl as string | null) ?? "",
  );
  const [gallery, setGallery] = useState<NewGalleryImageDto[]>(() =>
    (current?.gallery ?? []).map((item, index) => ({
      key: item.id,
      imageUrl: item.imageUrl,
      order: item.order ?? index,
    })),
  );
  const [faculty, setFaculty] = useState<UpdateProfileDtoFaculty>(
    (current?.faculty as UpdateProfileDtoFaculty) ??
      UpdateProfileDtoFaculty.CIVIL,
  );
  const [gender, setGender] = useState<UpdateProfileDtoGender>(
    UpdateProfileDtoGender.OTHER,
  );
  const [preferredGender, setPreferredGender] =
    useState<UpdateProfileDtoPreferredGender>(
      UpdateProfileDtoPreferredGender.ALL,
    );
  const [nationality, setNationality] = useState<UpdateProfileDtoNationality>(
    UpdateProfileDtoNationality.THAI,
  );
  const [minPreferredAge, setMinPreferredAge] = useState(18);
  const [maxPreferredAge, setMaxPreferredAge] = useState(28);
  const [selectedInterests, setSelectedInterests] = useState<
    UpdateProfileDtoInterestsItem[]
  >([
    UpdateProfileDtoInterestsItem.MUSIC,
    UpdateProfileDtoInterestsItem.SPORTS,
  ]);
  const activeStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const canGoNext = useMemo(() => {
    if (activeStep.id === "basic")
      return Boolean(name.trim()) && birthYear >= 1900;
    if (activeStep.id === "academic") return selectedInterests.length > 0;
    if (activeStep.id === "preferences")
      return minPreferredAge <= maxPreferredAge;
    if (activeStep.id === "avatar") return Boolean(avatarUrl);
    if (activeStep.id === "gallery") return gallery.length > 0;
    return true;
  }, [
    activeStep.id,
    avatarUrl,
    birthYear,
    gallery.length,
    maxPreferredAge,
    minPreferredAge,
    name,
    selectedInterests.length,
  ]);

  function toggleInterest(value: UpdateProfileDtoInterestsItem) {
    setSelectedInterests((items) =>
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
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
    updateProfile.mutate({
      data: {
        name: name.trim() || current?.name || "KBU Student",
        avatarUrl,
        bio: bio.trim() || "KBU student looking to meet people on campus.",
        faculty,
        interests: selectedInterests,
        gender,
        birthYear,
        minPreferredAge,
        maxPreferredAge,
        preferredGender,
        nationality,
        preferredFaculties: [faculty],
        preferredNationalities: [nationality],
        gallery: gallery.map((item, order) => ({ ...item, order })),
      },
    });
  }

  return (
    <MobileScreen>
      <TopBar
        title="UniMatch"
        backHref="/login"
        action={<div className="w-10" />}
      />
      <div className="h-1 bg-[#f6f3f2]">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      <main className="flex flex-1 flex-col overflow-y-auto px-5 pb-28 pt-8">
        <section className="mb-8">
          <p className="mb-1 text-xs font-semibold text-primary">
            {activeStep.eyebrow}
          </p>
          <h1 className="text-xl font-medium leading-7">{activeStep.title}</h1>
        </section>

        {activeStep.id === "basic" && (
          <section className="grid gap-5">
            <Field label="Display name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f9f8] px-4 outline-none focus:border-primary"
              />
            </Field>
            <Field label="Birth year">
              <input
                value={birthYear}
                onChange={(event) => setBirthYear(Number(event.target.value))}
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f9f8] px-4 outline-none focus:border-primary"
              />
            </Field>
            <Field label="Short bio">
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Coffee enthusiast, design lover, and always up for campus events."
                className="min-h-28 w-full resize-none rounded-xl border border-black/10 bg-[#f9f9f8] px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </Field>
          </section>
        )}

        {activeStep.id === "academic" && (
          <section className="grid gap-8">
            <div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
                Select faculty
              </div>
              <div className="grid grid-cols-3 gap-2">
                {faculties.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFaculty(item)}
                    className={
                      faculty === item
                        ? "h-8 rounded-full border border-primary bg-primary px-2 text-[10px] font-semibold text-white"
                        : "h-8 rounded-full border border-black/10 bg-white px-2 text-[10px] font-semibold text-[#6b6b6b]"
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                  >
                    <Chip active={selectedInterests.includes(interest)}>
                      {interest}
                    </Chip>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeStep.id === "preferences" && (
          <section className="grid gap-5">
            <Select
              label="Your identity"
              value={gender}
              onChange={(value) => setGender(value as UpdateProfileDtoGender)}
              options={Object.values(UpdateProfileDtoGender)}
            />
            <Select
              label="Interested in"
              value={preferredGender}
              onChange={(value) =>
                setPreferredGender(value as UpdateProfileDtoPreferredGender)
              }
              options={Object.values(UpdateProfileDtoPreferredGender)}
            />
            <Select
              label="Nationality"
              value={nationality}
              onChange={(value) =>
                setNationality(value as UpdateProfileDtoNationality)
              }
              options={nationalities}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min age">
                <input
                  value={minPreferredAge}
                  onChange={(event) =>
                    setMinPreferredAge(Number(event.target.value))
                  }
                  type="number"
                  min={18}
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f9f8] px-4 outline-none focus:border-primary"
                />
              </Field>
              <Field label="Max age">
                <input
                  value={maxPreferredAge}
                  onChange={(event) =>
                    setMaxPreferredAge(Number(event.target.value))
                  }
                  type="number"
                  min={18}
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f9f8] px-4 outline-none focus:border-primary"
                />
              </Field>
            </div>
          </section>
        )}

        {activeStep.id === "avatar" && (
          <AvatarUploadStep
            name={name || "KBU Student"}
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
          />
        )}

        {activeStep.id === "gallery" && (
          <GalleryUploadStep gallery={gallery} onGalleryChange={setGallery} />
        )}

        {activeStep.id === "review" && (
          <section className="space-y-4">
            <ReviewRow label="Name" value={name || "KBU Student"} />
            <ReviewRow label="Faculty" value={faculty} />
            <ReviewRow label="Identity" value={gender} />
            <ReviewRow label="Interested in" value={preferredGender} />
            <ReviewRow
              label="Age range"
              value={`${minPreferredAge} - ${maxPreferredAge}`}
            />
            <ReviewRow
              label="Avatar"
              value={avatarUrl ? "Uploaded" : "Missing"}
            />
            <ReviewRow
              label="Gallery"
              value={`${gallery.length} photo${gallery.length === 1 ? "" : "s"}`}
            />
            <div className="rounded-xl border border-black/10 bg-[#f9f9f8] p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <Chip key={interest} active>
                    {interest}
                  </Chip>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 gap-3 bg-gradient-to-t from-white via-white to-white/0 px-5 py-6">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-xl text-base font-semibold"
          onClick={handlePrevious}
          disabled={stepIndex === 0 || updateProfile.isPending}
        >
          <ArrowLeft className="size-5" /> Prev
        </Button>
        <Button
          type="button"
          className="h-12 flex-1 rounded-xl text-base font-semibold"
          onClick={isLastStep ? handleFinish : handleNext}
          disabled={!canGoNext || updateProfile.isPending}
        >
          {isLastStep
            ? updateProfile.isPending
              ? "Saving..."
              : "Finish"
            : "Next"}
          {isLastStep ? (
            <Check className="size-5" />
          ) : (
            <ArrowRight className="size-5" />
          )}
        </Button>
      </footer>
    </MobileScreen>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
        {label}
      </div>
      {children}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-black/10 bg-[#f9f9f8] px-4 outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#f9f9f8] p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
        {label}
      </span>
      <span className="truncate text-sm font-semibold">{value}</span>
    </div>
  );
}
