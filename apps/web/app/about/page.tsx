"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { client } from "@escape-theme-park/cms/utils/client";
import Link from "next/link";
import { Profile } from "@escape-theme-park/cms/types/schema";
export default function Page() {
  const getProfiles = useCallback(async () => {
    const res: Profile[] = await client.fetch("*[_type == 'profile']");
    return res;
  }, []);

  const { data: profiles, isLoading } = useSWR<Profile[]>(
    "get-profiles",
    getProfiles,
  );
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {profiles &&
          profiles.map((profile) => {
            return (
              <Link key={profile._id} href="">
                <h1>{profile.name}</h1>
              </Link>
            );
          })}
      </div>
    );
  }
}
