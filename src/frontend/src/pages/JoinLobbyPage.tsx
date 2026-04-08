import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerAvatar } from "../components/ui/PlayerAvatar";
import { useJoinLobby } from "../hooks/useLobbyActions";
import { AVATAR_EMOJIS } from "../types/game";

export default function JoinLobbyPage() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState(0);

  const joinLobby = useJoinLobby();
  const isLoading = joinLobby.isPending;

  // Read ?code= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    if (urlCode) setCode(urlCode.toUpperCase());
  }, []);

  function handleCodeChange(val: string) {
    // Auto-uppercase, strip non-alphanumeric, max 6 chars
    setCode(
      val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || code.length < 6) return;
    joinLobby.mutate({
      code,
      username: username.trim(),
      avatarId: BigInt(avatarId),
    });
  }

  const canSubmit =
    username.trim().length > 0 && code.length === 6 && !isLoading;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg"
        >
          <div className="bg-card border border-border rounded-3xl shadow-lg p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎯</div>
              <h1 className="text-3xl font-display font-extrabold text-foreground">
                Join a Game
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Enter the 6-character lobby code from your host.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lobby code */}
              <div className="space-y-2">
                <Label
                  htmlFor="lobbyCode"
                  className="font-display font-semibold text-foreground"
                >
                  Lobby Code
                </Label>
                <Input
                  id="lobbyCode"
                  placeholder="e.g. AB12XY"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  maxLength={6}
                  required
                  disabled={isLoading}
                  className="rounded-xl h-14 text-2xl text-center tracking-[0.4em] font-display font-bold border-input focus:ring-accent uppercase"
                  data-ocid="input-lobby-code"
                  autoComplete="off"
                  autoFocus
                />
                {/* Progress dots */}
                <div className="flex gap-1.5 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-smooth ${
                        i < code.length ? "bg-accent" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="font-display font-semibold text-foreground"
                >
                  Your Name
                </Label>
                <Input
                  id="username"
                  placeholder="e.g. Lucky Roller"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  required
                  disabled={isLoading}
                  className="rounded-xl h-12 text-base border-input focus:ring-accent"
                  data-ocid="input-username"
                />
              </div>

              {/* Avatar picker */}
              <div className="space-y-3">
                <Label className="font-display font-semibold text-foreground">
                  Pick Your Token
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_EMOJIS.map((emoji, i) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAvatarId(i)}
                      disabled={isLoading}
                      aria-label={`Select avatar ${emoji}`}
                      data-ocid={`avatar-option-${i}`}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-smooth cursor-pointer ${
                        avatarId === i
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border bg-background hover:border-accent/40 hover:bg-accent/5"
                      }`}
                    >
                      <span className="text-3xl">{emoji}</span>
                      {avatarId === i && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {username && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border"
                >
                  <PlayerAvatar
                    avatarId={BigInt(avatarId)}
                    username={username}
                    playerIndex={1}
                    size="md"
                  />
                  <div>
                    <p className="font-display font-bold text-foreground">
                      {username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Token: {AVATAR_EMOJIS[avatarId]}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-13 rounded-2xl font-display font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:scale-[1.02] transition-smooth"
                data-ocid="btn-join-lobby"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin" />
                    Joining…
                  </span>
                ) : (
                  "🎮 Join Lobby"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              No code yet?{" "}
              <Link
                to="/lobby/create"
                className="text-primary font-semibold hover:underline transition-smooth"
                data-ocid="link-create"
              >
                Create a new game →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
