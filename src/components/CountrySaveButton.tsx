"use client";

import { SaveButton } from "@/components/SaveButton";

interface CountrySaveButtonProps {
  code: string;
  name: string;
  region: string;
}

/**
 * Client wrapper for SaveButton to use in Server Components.
 */
export function CountrySaveButton({ code, name, region }: CountrySaveButtonProps) {
  return (
    <SaveButton
      country={{ code, name, region }}
      compact={false}
    />
  );
}
