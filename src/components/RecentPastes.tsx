import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePastes } from "@/hooks/usePastes";
import { Clock, Eye, Code, ArrowRight } from "lucide-react";

const RecentPastes = () => {
  const { getRecentPastes } = usePastes();
  const [pastes, setPastes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentPastes();
  }, []);

  const loadRecentPastes = async () => {
    try {
      const recentPastes = await getRecentPastes();
      setPastes(recentPastes);
    } catch (error) {
      console.error('Error loading recent pastes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Pastes récents</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pastes récents</h1>
          <p className="text-muted-foreground">
            Découvrez les derniers pastes publics partagés par la communauté
          </p>
        </div>

        {pastes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun paste récent</h3>
              <p className="text-muted-foreground">
                Soyez le premier à créer un paste public !
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastes.map((paste) => (
              <Link key={paste.id} to={`/paste/${paste.id}`}>
                <Card className="hover:shadow-elegant transition-smooth cursor-pointer group border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth truncate">
                            {paste.title || `Paste ${paste.id}`}
                          </h3>
                          <Badge variant="secondary" className="shrink-0">
                            {paste.language || 'text'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(paste.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {paste.view_count} vues
                          </span>
                          <span className="text-muted-foreground/70">
                            ID: {paste.id}
                          </span>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPastes;