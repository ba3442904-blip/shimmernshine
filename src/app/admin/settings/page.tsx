import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { getSettings } from "@/lib/siteData";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  async function saveSettings(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();

    const businessInfo = {
      name: String(formData.get("name") || ""),
      tagline: String(formData.get("tagline") || ""),
      phone: String(formData.get("phone") || ""),
      smsPhone: String(formData.get("smsPhone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
    };

    const hours = {
      monday: String(formData.get("monday") || ""),
      tuesday: String(formData.get("tuesday") || ""),
      wednesday: String(formData.get("wednesday") || ""),
      thursday: String(formData.get("thursday") || ""),
      friday: String(formData.get("friday") || ""),
      saturday: String(formData.get("saturday") || ""),
      sunday: String(formData.get("sunday") || ""),
    };

    const serviceArea = {
      center: String(formData.get("center") || ""),
      radiusMiles: Number(formData.get("radiusMiles") || 0),
      towns: String(formData.get("towns") || "")
        .split(",")
        .map((town) => town.trim())
        .filter(Boolean),
      travelFeePolicy: String(formData.get("travelFeePolicy") || ""),
      mapEmbedUrl: String(formData.get("mapEmbedUrl") || ""),
    };

    const booking = {
      mode: String(formData.get("bookingMode") || "form"),
      bookingUrl: String(formData.get("bookingUrl") || ""),
    };

    const seo = {
      title: String(formData.get("seoTitle") || ""),
      description: String(formData.get("seoDescription") || ""),
      ogImage: String(formData.get("ogImage") || ""),
    };

    const socials = {
      instagram: String(formData.get("instagram") || ""),
      facebook: String(formData.get("facebook") || ""),
    };

    const hero = {
      imageUrl: String(formData.get("heroImageUrl") || ""),
    };

    const trustBadges = String(formData.get("trustBadges") || "")
      .split(",")
      .map((badge) => badge.trim())
      .filter(Boolean);

    const entries = [
      ["businessInfo", businessInfo],
      ["hours", hours],
      ["serviceArea", serviceArea],
      ["booking", booking],
      ["seo", seo],
      ["socials", socials],
      ["hero", hero],
      ["trustBadges", trustBadges],
    ] as const;

    for (const [key, value] of entries) {
      await db.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Business info</div>
        <form action={saveSettings} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              defaultValue={settings.businessInfo.name}
              placeholder="Business name"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="tagline"
              defaultValue={settings.businessInfo.tagline}
              placeholder="Tagline"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="phone"
              defaultValue={settings.businessInfo.phone}
              placeholder="Phone"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="smsPhone"
              defaultValue={settings.businessInfo.smsPhone}
              placeholder="SMS Phone"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="email"
              defaultValue={settings.businessInfo.email}
              placeholder="Email"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="address"
              defaultValue={settings.businessInfo.address}
              placeholder="Address"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="text-sm font-semibold">Hours</div>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(settings.hours).map(([day, value]) => (
              <input
                key={day}
                name={day}
                defaultValue={value}
                placeholder={`${day} hours`}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
            ))}
          </div>

          <div className="text-sm font-semibold">Service area</div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="center"
              defaultValue={settings.serviceArea.center}
              placeholder="Center city"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="radiusMiles"
              defaultValue={settings.serviceArea.radiusMiles}
              placeholder="Radius (miles)"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="towns"
              defaultValue={settings.serviceArea.towns.join(", ")}
              placeholder="Towns (comma separated)"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="travelFeePolicy"
              defaultValue={settings.serviceArea.travelFeePolicy}
              placeholder="Travel fee policy"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="mapEmbedUrl"
              defaultValue={settings.serviceArea.mapEmbedUrl}
              placeholder="Map embed URL"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="text-sm font-semibold">Booking settings</div>
          <div className="grid gap-3 md:grid-cols-2">
            <select
              name="bookingMode"
              defaultValue={settings.booking.mode}
              className="input-surface rounded-xl px-3 py-2 text-sm"
            >
              <option value="form">Form</option>
              <option value="external">External</option>
            </select>
            <input
              name="bookingUrl"
              defaultValue={settings.booking.bookingUrl}
              placeholder="External booking URL"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="text-sm font-semibold">SEO</div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="seoTitle"
              defaultValue={settings.seo.title}
              placeholder="SEO title"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="ogImage"
              defaultValue={settings.seo.ogImage}
              placeholder="OG image URL"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              name="seoDescription"
              defaultValue={settings.seo.description}
              placeholder="SEO description"
              className="input-surface rounded-xl px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="text-sm font-semibold">Social links</div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="instagram"
              defaultValue={settings.socials.instagram}
              placeholder="Instagram URL"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="facebook"
              defaultValue={settings.socials.facebook}
              placeholder="Facebook URL"
              className="input-surface rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="text-sm font-semibold">Hero</div>
          <input
            name="heroImageUrl"
            defaultValue={settings.hero.imageUrl}
            placeholder="Hero image URL"
            className="input-surface rounded-xl px-3 py-2 text-sm"
          />

          <div className="text-sm font-semibold">Trust badges</div>
          <input
            name="trustBadges"
            defaultValue={settings.trustBadges.join(", ")}
            placeholder="Badge list (comma separated)"
            className="input-surface rounded-xl px-3 py-2 text-sm"
          />

          <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
            Save settings
          </button>
        </form>
      </Card>
    </div>
  );
}
