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
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "rtik2024";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("rtik_admin")) {
      navigate({ to: "/admin-panel" });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Masukkan password admin");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("rtik_admin", "true");
      toast.success("Login berhasil! Selamat datang, Admin.");
      navigate({ to: "/admin-panel" });
    } else {
      toast.error("Password salah. Silakan coba lagi.");
      setPassword("");
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4 shadow-navy-lg">
            <Shield className="w-8 h-8 text-gold" strokeWidth={2} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            RTIK Indonesia Peduli
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg">
              Masuk sebagai Administrator
            </CardTitle>
            <CardDescription>
              Halaman ini hanya dapat diakses oleh administrator. Silakan masuk
              dengan akun admin terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password Admin</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password admin..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-ocid="admin.password.input"
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
                className="w-full bg-navy text-white hover:bg-navy-dark"
                data-ocid="admin.login.submit_button"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Masuk ke Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Lupa password? Hubungi administrator sistem.
        </p>
      </div>
    </main>
  );
}
