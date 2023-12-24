"use client";

import { Profile } from "@escape-theme-park/cms/types/schema";
import { client } from "@escape-theme-park/cms/utils/client";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import useSWR from "swr";

export default function Page() {
  const params = useParams();
  const slug = params.slug;
  const getProfile = useCallback(async () => {
    const res: Profile[] = await client.fetch(
      `*[_type == 'profile' && slug.current == '${slug}']`,
    );
    return res;
  }, [slug]);

  const { data: profile } = useSWR<Profile[]>("get-profiles", getProfile);

  return <div>{profile && profile[0]?.name}</div>;
}
