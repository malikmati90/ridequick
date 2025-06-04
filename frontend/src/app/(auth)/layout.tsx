import { MinimalHeader } from "@/components/ui/MinimalHeader";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MinimalHeader />
      <main>{children}</main>
    </>
  );
}
