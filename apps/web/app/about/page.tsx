"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { client } from "@escape-theme-park/cms/utils/client";
import Link from "next/link";
export default function Page() {
  const getProfiles = useCallback(async () => {
    const res = await client.fetch("*[_type == 'profile']");
    return res;
  }, []);
  const { data: profiles, isLoading } = useSWR("get-profiles", getProfiles);
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {profiles.map((profile) => {
          return (
            <Link key={profile.id} href="">
              <h1>{profile.name}</h1>
            </Link>
          );
        })}
      </div>
    );
  }
}
