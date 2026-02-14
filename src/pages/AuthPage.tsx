import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { useLanguage } from "@/hooks";
import { AuthForm, AuthBanner } from "@/components/pages/auth-components";

export const AuthPage = () => {
  const { isRtl } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} z-20 p-2 rounded-full cursor-pointer hover:bg-surface text-text-primary transition-colors`}
      >
        <ArrowBack className={isRtl ? "rotate-180" : ""} />
      </button>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10 w-full lg:w-1/2 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <AuthForm />
      </div>

      {/* Auth Banner Section */}
      <AuthBanner />
    </div>
  );
};
