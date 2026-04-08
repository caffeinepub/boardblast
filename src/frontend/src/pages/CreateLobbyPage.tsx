import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { PlayerAvatar } from "../components/ui/PlayerAvatar";
import { useCreateLobby } from "../hooks/useLobbyActions";
import { AVATAR_EMOJIS } from "../types/game";

const MAX_PLAYERS_OPTIONS = [2, 3, 4, 5, 6, 7, 8];

export default function CreateLobbyPage() {
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(4);

  const createLobby = useCreateLobby();
  const isLoading = createLobby.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    createLobby.mutate({
      username: username.trim(),
      avatarId: BigInt(avatarId),
      maxPlayers: BigInt(maxPlayers),
    });
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg"
        >
          {/* Card */}
          <div className="bg-card border border-border rounded-3xl shadow-lg p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎮</div>
              <h1 className="text-3xl font-display font-extrabold text-foreground">
                Create a Game
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Set up your lobby and invite friends to join.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g. BoardBlast Champion"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  required
                  disabled={isLoading}
                  className="rounded-xl h-12 text-base border-input focus:ring-primary"
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
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-3xl">{emoji}</span>
                      {avatarId === i && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
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
                    playerIndex={0}
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

              {/* Max players */}
              <div className="space-y-3">
                <Label className="font-display font-semibold text-foreground">
                  Max Players
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {MAX_PLAYERS_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setMaxPlayers(n)}
                      disabled={isLoading}
                      data-ocid={`max-players-${n}`}
                      className={`w-11 h-11 rounded-xl font-display font-bold text-base border-2 transition-smooth ${
                        maxPlayers === n
                          ? "border-accent bg-accent/10 text-accent shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-accent"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {maxPlayers} players max · at least 2 needed to start
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!username.trim() || isLoading}
                className="w-full h-13 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-[1.02] transition-smooth"
                data-ocid="btn-create-lobby"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Creating…
                  </span>
                ) : (
                  "🚀 Create Lobby"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Have a code?{" "}
              <Link
                to="/lobby/join"
                className="text-accent font-semibold hover:underline transition-smooth"
                data-ocid="link-join"
              >
                Join a game instead →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
