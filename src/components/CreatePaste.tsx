import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePastes } from "@/hooks/usePastes";
import { useNavigate } from "react-router-dom";
import { Share, Lock, Clock, Code } from "lucide-react";

const LANGUAGES = [
  { value: 'text', label: 'Texte simple' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'php', label: 'PHP' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

// Correction ici : plus de valeur vide pour "Jamais"
const EXPIRY_OPTIONS = [
  { value: 'never', label: 'Jamais' },
  { value: '1h', label: '1 heure' },
  { value: '1d', label: '1 jour' },
  { value: '1w', label: '1 semaine' },
  { value: '1m', label: '1 mois' }
];

const CreatePaste = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('text');
  const [expiry, setExpiry] = useState('never'); // correspond à la nouvelle valeur par défaut
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  
  const { createPaste, isLoading } = usePastes();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    try {
      let expiresAt = null;
      if (expiry && expiry !== 'never') {
        const now = new Date();
        switch (expiry) {
          case '1h':
            expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
            break;
          case '1d':
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            break;
          case '1w':
            expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            break;
          case '1m':
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
            break;
        }
      }

      const result = await createPaste({
        title: title.trim() || undefined,
        content: content.trim(),
        language,
        expires_at: expiresAt,
        is_private: isPrivate,
        password: password.trim() || undefined
      });

      if (result?.pasteId) {
        navigate(`/paste/${result.pasteId}`);
      }
    } catch (error) {
      console.error('Error creating paste:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Créer un nouveau paste</h1>
          <p className="text-muted-foreground">
            Partagez votre code, texte ou notes de manière sécurisée et professionnelle
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Détails du paste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre (optionnel)
                </Label>
                <Input
                  id="title"
                  placeholder="Donnez un titre à votre paste..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="transition-smooth focus:shadow-card"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Langage</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="transition-smooth focus:shadow-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Contenu *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Collez votre code, texte ou notes ici..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm transition-smooth focus:shadow-card resize-none"
                  required
                />
                <div className="text-xs text-muted-foreground">
                  {content.length} caractères
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary/30 rounded-lg">
                {/* Expiration */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Expiration
                  </Label>
                  <Select value={expiry} onValueChange={setExpiry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPIRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Privacy */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-accent" />
                    Confidentialité
                  </Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isPrivate ? 'Paste privé' : 'Paste public'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password if private */}
              {isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe (optionnel)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Protéger avec un mot de passe..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-smooth focus:shadow-card"
                  />
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isLoading || !content.trim()}
                  className="flex-1 group"
                >
                  {isLoading ? (
                    "Création en cours..."
                  ) : (
                    <>
                      <Share className="w-4 h-4 group-hover:scale-110 transition-smooth" />
                      Créer le paste
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePaste;
