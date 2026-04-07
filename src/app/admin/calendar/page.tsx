import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { getAuthedClient, registerWatch } from "@/lib/googleCalendar";

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const db = getDb();
  const params = await searchParams;

  const token = await db.googleCalendarToken.findUnique({
    where: { userId: session.user.id },
  });

  const isConnected = !!token;

  async function setupWatch() {
    "use server";
    const session = await requireAdmin();
    const authed = await getAuthedClient(session.user.id);
    if (!authed) return;

    const db = getDb();
    const token = await db.googleCalendarToken.findUnique({
      where: { userId: session.user.id },
    });

    // Stop existing watch
    if (token?.channelId && token?.resourceId) {
      try {
        const { stopWatch } = await import("@/lib/googleCalendar");
        await stopWatch(authed, token.channelId, token.resourceId);
      } catch {
        // May be expired
      }
    }

    const watch = await registerWatch(authed);
    await db.googleCalendarToken.update({
      where: { userId: session.user.id },
      data: {
        channelId: watch.channelId,
        resourceId: watch.resourceId,
        channelExpiry: watch.expiration,
      },
    });
    revalidatePath("/admin/calendar");
  }

  return (
    <div className="grid gap-6">
      {params?.connected === "1" && (
        <div className="rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-600">
          Google Calendar connected successfully.
        </div>
      )}
      {params?.error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">
          Connection failed: {params.error}
        </div>
      )}

      <Card>
        <div className="grid gap-4">
          <div className="text-sm font-semibold">Google Calendar</div>

          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-[var(--muted)]"
              }`}
            />
            <span className="text-sm">
              {isConnected ? "Connected" : "Not connected"}
            </span>
          </div>

          {!isConnected ? (
            <a
              href="/api/admin/calendar/connect"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Connect Google Calendar
            </a>
          ) : (
            <div className="grid gap-3">
              <div className="text-xs text-[var(--muted)]">
                Calendar: {token.calendarId}
              </div>
              {token.channelExpiry && (
                <div className="text-xs text-[var(--muted)]">
                  Webhook expires:{" "}
                  {token.channelExpiry.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <form action={setupWatch}>
                  <button className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold">
                    {token.channelId ? "Renew Webhook" : "Enable Webhook"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await requireAdmin();
                    await fetch(
                      `${process.env.NEXTAUTH_URL}/api/admin/calendar/disconnect`,
                      { method: "POST" }
                    );
                    revalidatePath("/admin/calendar");
                  }}
                >
                  <button className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600">
                    Disconnect
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="grid gap-3">
          <div className="text-sm font-semibold">How it works</div>
          <ul className="grid gap-2 text-xs text-[var(--muted)]">
            <li>
              When a lead is set to <strong>scheduled</strong>, a Google Calendar
              event is automatically created.
            </li>
            <li>
              If the event is changed or cancelled in Google Calendar, the lead
              is updated automatically via webhook.
            </li>
            <li>
              Customers can see your available time slots on the booking page.
            </li>
          </ul>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3">
          <div className="text-sm font-semibold">Calendar View</div>
          <div className="w-full overflow-hidden rounded-lg">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=claudepremium0%40gmail.com&ctz=America%2FNew_York"
              style={{ border: 0 }}
              width="800"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="w-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
