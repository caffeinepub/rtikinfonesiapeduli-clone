import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ValidatorLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Masukkan password validator");
      return;
    }

    setIsLoading(true);
    // Simulate brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (password === "validator2024") {
      sessionStorage.setItem("rtik_validator", "true");
      toast.success("Login berhasil! Selamat datang, Validator.");
      navigate({ to: "/validasi" });
    } else {
      toast.error("Password salah. Silakan coba lagi.");
      setPassword("");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4 shadow-navy-lg">
            <UserCheck className="w-8 h-8 text-gold" strokeWidth={2} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Login Validator
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            RTIK Indonesia Peduli
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg">
              Masuk sebagai Validator
            </CardTitle>
            <CardDescription>
              Halaman ini hanya dapat diakses oleh validator yang berwenang.
              Silakan masuk dengan akun validator terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="validator-password">Password Validator</Label>
                <div className="relative">
                  <Input
                    id="validator-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password validator..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-ocid="validator.password.input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={isLoading}
                data-ocid="validator.login.submit_button"
              >
                {isLoading ? (
                  "Memverifikasi..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk ke Halaman Validasi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Lupa password? Hubungi koordinator validator.
        </p>
      </div>
    </main>
  );
}
