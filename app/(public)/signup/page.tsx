import SignupScreen from "@/modules/authentication/presentation/screens/SignupScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return <SignupScreen />;
}
