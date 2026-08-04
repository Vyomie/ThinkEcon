import { ContactForm } from "@/components/contact-form";

export default function Contact() {
  return <ContactForm enabled={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)} />;
}
