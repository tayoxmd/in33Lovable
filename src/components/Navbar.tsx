import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-transparent.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="IN33 Logo" 
              className="h-14 object-contain"
            />
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
