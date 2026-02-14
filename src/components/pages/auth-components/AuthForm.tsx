import { useState } from "react";
import supabase from "@/lib/supabase-client";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthFormData } from "@/schemas/auth-schema";
import { useNavigate } from "react-router-dom";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Google } from "@mui/icons-material";

export const AuthForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
  };

  const getErrorMessage = (error: Error) => {
    if (error.message.includes("Invalid login credentials")) {
      return t("auth.error_invalid_credentials");
    }
    if (error.message.includes("User already registered")) {
      return t("auth.error_user_exists");
    }
    if (error.message.includes("Email not confirmed")) {
      return t("auth.error_email_not_confirmed");
    }
    return error.message;
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    const { email, password, first_name, last_name } = data;

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name,
              last_name,
            },
          },
        });
        if (error) throw error;
        toast.success(t("auth.signupSuccess"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t("auth.signinSuccess"));
        navigate("/");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? getErrorMessage(error)
          : t("auth.error_generic");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            {isSignUp ? t("auth.createAccount") : t("auth.signin")}
          </CardTitle>
          <CardDescription className="text-center text-base mt-2">
            {isSignUp
              ? t("auth.signupDescription")
              : t("auth.signinDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="first_name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("auth.firstName")}
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      {...register("first_name")}
                      className="flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary"
                    />
                    {errors.first_name && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last_name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("auth.lastName")}
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      {...register("last_name")}
                      className="flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary"
                    />
                    {errors.last_name && (
                      <span className="text-xs text-red-500 font-medium">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary"
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("auth.password")}
                </label>
              </div>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="flex h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary"
              />
              {errors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full shadow-lg shadow-primary/20"
            >
              {isSignUp ? t("auth.signup") : t("auth.signin")}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("auth.or_continue_with", {
                    defaultValue: "Or continue with",
                  })}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/`,
                      queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                      },
                    },
                  });
                  if (error) throw error;
                } catch (error) {
                  console.error("Error logging in with Google:", error);
                  toast.error(
                    t("auth.error_google_login", {
                      defaultValue: "Failed to sign in with Google",
                    }),
                  );
                  setLoading(false);
                }
              }}
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full gap-2"
            >
              <Google fontSize="small" />
              Google
            </button>
          </form>

          <div className="text-center text-sm mt-8">
            <span className="text-muted-foreground">
              {isSignUp ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              {isSignUp ? t("auth.signin") : t("auth.signup")}
            </button>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
};
