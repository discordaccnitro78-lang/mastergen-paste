import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePastes, type Paste } from "@/hooks/usePastes";
import { Copy, Eye, Calendar, Code, Lock, ArrowLeft, Share } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useToast } from "@/hooks/use-toast";

const ViewPaste = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPaste, isLoading } = usePastes();
  const { toast } = useToast();
  
  const [paste, setPaste] = useState<Paste | null>(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadPaste();
    }
  }, [id]);

  const loadPaste = async () => {
    if (!id) return;
    
    try {
      setError('');
      const pasteData = await getPaste(id, password);
      setPaste(pasteData);
      setNeedsPassword(false);
    } catch (err: any) {
      if (err.message === 'Password required') {
        setNeedsPassword(true);
      } else {
        setError(err.message || 'Paste non trouvé');
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPaste();
  };

  const copyToClipboard = async () => {
    if (paste?.content) {
      try {
        await navigator.clipboard.writeText(paste.content);
        toast({
          title: "Copié!",
          description: "Le contenu a été copié dans le presse-papier",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le contenu",
          variant: "destructive",
        });
      }
    }
  };

  const shareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié!",
      description: "L'URL du paste a été copiée",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 text-accent mx-auto mb-2" />
              <h1 className="text-2xl font-bold">Paste protégé</h1>
              <p className="text-muted-foreground">
                Ce paste nécessite un mot de passe pour être consulté
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe..."
                    className="mt-1"
                  />
                </div>
                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" variant="hero" className="flex-1">
                    Accéder
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Paste introuvable</h1>
            <p className="text-muted-foreground mb-6">
              {error || "Ce paste n'existe pas ou a été supprimé."}
            </p>
            <Button onClick={() => navigate('/')} variant="hero">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Nouveau paste
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={shareUrl}>
              <Share className="w-4 h-4" />
              Partager
            </Button>
            <Button variant="hero" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
              Copier
            </Button>
          </div>
        </div>

        {/* Paste Info */}
        <Card className="mb-6 shadow-card border-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {paste.title || `Paste ${paste.id}`}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(paste.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {paste.view_count} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    {paste.language || 'text'}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Paste Content */}
        <Card className="shadow-elegant border-0">
          <CardContent className="p-0">
            <div className="relative">
              {paste.language && paste.language !== 'text' ? (
                <SyntaxHighlighter
                  language={paste.language}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    background: 'hsl(var(--secondary))',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {paste.content}
                </SyntaxHighlighter>
              ) : (
                <pre className="p-6 bg-secondary rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {paste.content}
                </pre>
              )}
              
              {/* Copy button overlay */}
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="absolute top-4 right-4 opacity-80 hover:opacity-100"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        {paste.expires_at && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
            Ce paste expirera le {formatDate(paste.expires_at)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaste;