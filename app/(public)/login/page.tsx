import LoginScreen from "@/modules/authentication/presentation/screens/LoginScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginScreen />;
}
