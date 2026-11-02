"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* supabase-js reads the session from the email link's URL on its own; this page just waits for it */
export default function AuthCallback() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const err =
      new URLSearchParams(location.search).get("error_description") ??
      new URLSearchParams(location.hash.slice(1)).get("error_description");
    if (err) return setFailed(true);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.replace("/me");
    });
    supabase.auth.getSession().then(({ data: d }) => d.session && router.replace("/me"));
    const t = setTimeout(() => setFailed(true), 8000);
    return () => {
      data.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, [router]);

  return (
    <div className="py-24 text-center">
      {failed ? (
        <>
          <p className="font-bold">登录链接无效或已过期</p>
          <a href="/login" className="mt-3 inline-block text-grass-ink underline">
            重新发送
          </a>
        </>
      ) : (
        <p className="text-muted">正在登录…</p>
      )}
    </div>
  );
}
