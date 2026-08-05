import { Suspense } from 'eact';
import { SettingsTabs } from './_components/settings-tabs';
import { SettingsFormWrapper } from './_components/settings-form-wrapper';

// Mockowe dane pobierane z Supabase (Server Component)
async function getOrganizationSettings() {
  // const { data } = await supabase.from('organizations').select('*').single();
  // return data;
  return {
    name: "Tindur Org",
    slug: "tindur-org",
    description: "Premium travel experiences",
    contact_email: "admin@tindur.is",
    contact_phone: "+354 123 4567",
    address: "Reykjavík, Iceland",
    primary_color: "#000000",
    secondary_color: "#ffffff",
    font: "Inter",
    default_locale: "en",
    default_currency: "ISK",
    timezone: "Atlantic/Reykjavik",
    notifications: {
      new_booking: true,
      cancellation: true,
      review: false,
      payout: true,
    },
    stripe_connected: false,
    stripe_account_id: null,
  };
}

export default async function SettingsPage() {
  const settings = await getOrganizationSettings();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your business profile, branding, and payments.</p>
      </header>

      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
        <SettingsFormWrapper initialData={settings} />
      </Suspense>
    </div>
  );
}

// --- COMPONENTS (In a real app, these go to separate files) ---

// app/dashboard/settings/_components/settings-tabs.tsx
// (Używamy shadcn/ui Tabs)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsTabs({ settings }: { settings: any }) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
        <TabsTrigger value="stripe">Stripe</TabsTrigger>
        <TabsTrigger value="localization">Localization</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm initialData={settings} />
      </TabsContent>
      <TabsContent value="branding">
        <BrandingForm initialData={settings} />
      </TabsContent>
      <TabsContent value="subdomain">
        <SubdomainForm initialData={settings} />
      </TabsContent>
      <TabsContent value="stripe">
        <StripeConnectForm settings={settings} />
      </TabsContent>
      <TabsContent value="localization">
        <LocalizationForm initialData={settings} />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationForm initialData={settings} />
      </TabsContent>
    </Tabs>
  );
}

// Przykład implementacji jednego z formularzy (ProfileForm)
// app/dashboard/settings/_components/profile-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(3),
  description: z.string().max(200),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  address: z.string(),
});

export function ProfileForm({ initialData }: { initialData: any }) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      // const res = await updateOrgAction(data);
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization Name</label>
          <Input {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input {...form.register("slug")} placeholder="my-org" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea {...form.register("description")} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...form.register("contact_email")} placeholder="Email" />
        <Input {...form.register("contact_phone")} placeholder="Phone" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Input {...form.register("address")} />
      </div>
      <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
    </form>
  );
}

// Pozostałe komponenty (BrandingForm, SubdomainForm, itd.) powinny być zaimplementowane analogicznie...