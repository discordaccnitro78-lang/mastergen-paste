import { Button } from "@/components/ui/button";
import { Code, Plus, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-smooth">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Pasteview
              </h1>
              <p className="text-xs text-muted-foreground">Partage moderne</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/recent" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Clock className="w-4 h-4" />
              Pastes récents
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              À propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/')}
              className="group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-smooth" />
              Nouveau paste
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;