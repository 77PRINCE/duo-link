import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/?error=supabase_not_configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0b1020] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
        {user.user_metadata?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.user_metadata.avatar_url as string}
            alt="Avatar"
            className="mx-auto mb-4 h-16 w-16 rounded-full border border-white/20"
          />
        ) : null}
        <h1 className="text-xl font-semibold">Signed in</h1>
        <p className="mt-2 text-sm text-white/70">{user.email}</p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
