import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Truck className="w-7 h-7" />
            <span>in33.in</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link to="#services" className="text-foreground hover:text-primary transition-colors">
              الخدمات
            </Link>
            <Link to="#about" className="text-foreground hover:text-primary transition-colors">
              من نحن
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline">تسجيل الدخول</Button>
            </Link>
            <Link to="/auth">
              <Button>ابدأ الآن</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
