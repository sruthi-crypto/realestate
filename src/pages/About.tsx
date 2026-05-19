import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAboutAction, cleargetAboutAction } from "@/store/actions";
import { useNavigate } from "react-router-dom";
// import { GET_ABOUT } from "@/constants";
import {
  // Globe,
  Info,
  Star,
  Image,
  // Phone,
  // Share2,
  // Link2,
  XCircle,
  ArrowLeft,
  Pencil,
  Building2,
  Tag,
  FileText,
  Target,
  Clock,
  // ExternalLink,
} from "lucide-react";
import { GetAboutResponse } from "@/types/responses";

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  icon: Icon,
  gradient,
  iconGradient,
  border,
  children,
  colSpan,
}: {
  title: string;
  icon: any;
  gradient: string;
  iconGradient: string;
  border: string;
  children: React.ReactNode;
  colSpan?: string;
}) => (
  <div className={`bg-background rounded-3xl border border-border p-6 sm:p-8 hover-lift shadow-sm hover:shadow-xl transition-all duration-300 ${colSpan || ""}`}>
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${iconGradient} shadow-inner`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) => (
  <div className="flex items-start gap-4 py-3 border-b border-border/40 last:border-0 group">
    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200">
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex-shrink-0" />
    </div>
    <div className="min-w-0 pt-0.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">{label}</p>
      <p className="text-sm text-foreground font-semibold">{value || "N/A"}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AboutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [about, setAbout] = useState<GetAboutResponse["data"][number] | null>(null);
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const {
    successData: getAboutSuccessData,
    loading: getAboutLoading,
    error: getAboutError,
    errorInfo: getAboutErrorInfo,
  } = useAppSelector((state) => state.getAboutReducer);

  useEffect(() => {
    dispatch(getAboutAction());
  }, [dispatch]);

  useEffect(() => {
    if (getAboutSuccessData) {
      setAbout(
        getAboutSuccessData.data.find((item) => item.key === "aboutUs") ??
        getAboutSuccessData.data[0] ??
        null
      );
      dispatch(cleargetAboutAction());
    }
  }, [dispatch, getAboutSuccessData]);

  useEffect(() => {
    if (getAboutError) {
      setError(getAboutErrorInfo || "An error occurred. Please try again.");
    }
  }, [getAboutError, getAboutErrorInfo]);

  const { aboutUs /*, footer*/ } = about || {};

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-accent pt-28 pb-20 px-4 overflow-hidden border-b border-white/10 shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 text-yellow-300" />
                <p className="text-white/90 text-xs font-bold uppercase tracking-widest">
                  {aboutUs?.eyebrow || "Who We Are"}
                </p>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-sm">
                {aboutUs?.title || "About Us"}
              </h1>
              {aboutUs?.since && (
                <p className="text-white/80 text-lg md:text-xl font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 opacity-70" />
                  Established {aboutUs.since}
                </p>
              )}
            </div>

            {/* Edit button — admin only */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/about/edit", { state: { about } })}
                className="group flex items-center gap-2 px-6 py-3.5 bg-white text-primary rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.7)] transition-all duration-300 self-start md:self-auto hover:-translate-y-1"
              >
                <Pencil className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Edit Content</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Loading State ──────────────────────────────────────────────────────── */}
      {getAboutLoading && (
        <div className="container py-32 text-center flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <span className="mt-4 text-muted-foreground font-semibold text-lg animate-pulse">Loading amazing content...</span>
        </div>
      )}

      {/* ── Error State ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="container py-16">
          <div className="bg-destructive/5 rounded-3xl border border-destructive/20 p-8 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Oops! Something went wrong</h3>
            <p className="text-muted-foreground font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* ── Not Found ──────────────────────────────────────────────────────────── */}
      {!about && !getAboutLoading && !error && (
        <div className="container py-32 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FileText className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Content Not Found</h2>
          <p className="text-muted-foreground max-w-sm">We couldn't find the about page information you're looking for.</p>
        </div>
      )}

      {/* ── Images Gallery ───────────────────────────────────────────────────── */}
      {aboutUs?.images && (aboutUs.images as any[]).length > 0 && (
        <section className="py-24 bg-muted/20 border-b border-border/50">
          <div className="container">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {(aboutUs.images as any[]).map((img: any, i: number) => (
                <div
                  key={i}
                  className="group relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Gallery Image ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3Cpath d='M36.146 36.146a.5.5 0 0 1 .708 0L50 49.293l13.146-13.147a.5.5 0 0 1 .708.708L50.707 50l13.147 13.146a.5.5 0 0 1-.708.708L50 50.707l-13.146 13.147a.5.5 0 0 1-.708-.708L49.293 50 36.146 36.854a.5.5 0 0 1 0-.708z' fill='%2394a3b8'/%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {img.alt && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-medium text-sm line-clamp-2 drop-shadow-md">
                        {img.alt}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Content ────────────────────────────────────────────────────────────── */}
      {about && (
        <>
          {/* ── Description + Mission ─────────────────────────────────────────── */}
          <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle background blob */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="container relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

                {/* Left — Description */}
                <div className="lg:col-span-7 space-y-8 animate-fade-in">
                  <div className="space-y-6">
                    <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
                    <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground leading-[1.2] tracking-tight">
                      We Are Your Trusted <br className="hidden md:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Real Estate Partner</span>
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                    {aboutUs?.description || "No description available."}
                  </p>
                </div>

                {/* Right — Mission */}
                <div className="lg:col-span-5 relative animate-fade-in group">
                  {/* Glowing backdrop */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-[2rem] p-10 space-y-6 overflow-hidden">
                    {/* Watermark Icon */}
                    <Target className="absolute -bottom-10 -right-10 w-48 h-48 text-primary/5 -rotate-12" />

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                      <Target className="w-7 h-7 text-primary" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h3 className="font-display text-2xl font-extrabold text-foreground">Our Mission</h3>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {aboutUs?.mission || "No mission statement available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Highlights / Stats ────────────────────────────────────────────── */}
          {aboutUs?.highlights && (aboutUs.highlights as any[]).length > 0 && (
            <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
              {/* Complex background pattern for visual interest */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full filter blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full filter blur-[80px]" />

              <div className="container relative z-10">
                <div className="text-center mb-6 space-y-4">
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm tracking-tight">
                    Our Achievements
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {(aboutUs.highlights as any[]).map((h: any, i: number) => (
                    <div
                      key={i}
                      className="group relative text-center p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                    >
                      {/* Hover light effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10 space-y-3">
                        <p className="font-display text-5xl md:text-6xl font-black text-white drop-shadow-md">
                          {h.value || "—"}
                        </p>
                        <p className="text-white/80 text-sm font-bold uppercase tracking-[0.2em]">
                          {h.label || "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back button — admin only */}
                {isAdmin && (
                  <div className="mt-16 flex justify-center">
                    <button
                      className="group flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1"
                      onClick={() => navigate(-1)}
                      disabled={getAboutLoading}
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                      {getAboutLoading ? "Please wait..." : "Go Back to Dashboard"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Footer ──────────────────────────────────────────────── */}
          {/* <div className="bg-background/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border overflow-hidden mt-12">
            <div className="border-b border-border/50 px-8 py-6 flex items-center gap-3 bg-muted/30">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-extrabold text-foreground text-lg uppercase tracking-widest">Footer Settings</h2>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <SectionCard
                  title="Brand"
                  icon={Building2}
                  gradient="bg-background"
                  iconGradient="from-blue-500 to-indigo-600"
                  border="border-border"
                >
                  <div className="space-y-1">
                    {footer?.logoUrl && (
                      <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Logo Preview</p>
                        <img
                          src={footer.logoUrl}
                          alt="Logo"
                          className="h-14 object-contain rounded-xl bg-background p-2 shadow-sm border border-border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}
                    <InfoRow icon={Building2} label="Brand Name" value={footer?.brandName} />
                    <InfoRow icon={Tag} label="Tagline" value={footer?.tagline} />
                    <InfoRow icon={FileText} label="Rights Text" value={footer?.rightsText} />
                    <InfoRow icon={FileText} label="Made In Label" value={footer?.madeInLabel} />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Call to Action"
                  icon={ExternalLink}
                  gradient="bg-background"
                  iconGradient="from-green-500 to-emerald-600"
                  border="border-border"
                >
                  <div className="space-y-1">
                    <InfoRow icon={Tag} label="CTA Label" value={footer?.ctaLabel} />
                    <InfoRow icon={Link2} label="CTA Href" value={footer?.ctaHref} />
                  </div>
                </SectionCard>

                {footer?.contacts && (footer.contacts as any[]).length > 0 && (
                  <SectionCard
                    title="Contacts"
                    icon={Phone}
                    gradient="bg-background"
                    iconGradient="from-purple-500 to-violet-600"
                    border="border-border"
                  >
                    <div className="space-y-1">
                      {(footer.contacts as any[]).map((c: any, i: number) => (
                        <InfoRow key={i} icon={Phone} label={c.label || `Contact ${i + 1}`} value={c.value} />
                      ))}
                    </div>
                  </SectionCard>
                )}

                {footer?.socials && (footer.socials as any[]).length > 0 && (
                  <SectionCard
                    title="Social Links"
                    icon={Share2}
                    gradient="bg-background"
                    iconGradient="from-amber-500 to-orange-600"
                    border="border-border"
                  >
                    <div className="space-y-4 pt-2">
                      {(footer.socials as any[]).map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 group p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200 border border-transparent hover:border-border/50">
                          <div className="p-2 bg-background shadow-sm rounded-lg border border-border">
                            <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-foreground font-bold">{s.platform || `Social ${i + 1}`}</p>
                            {s.href ? (
                              <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 hover:underline text-sm truncate block font-medium"
                              >
                                {s.href}
                              </a>
                            ) : (
                              <p className="text-muted-foreground text-sm font-medium">N/A</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {footer?.linkGroups && (footer.linkGroups as any[]).length > 0 && (
                  <SectionCard
                    title="Footer Link Groups"
                    icon={Link2}
                    gradient="bg-background"
                    iconGradient="from-cyan-500 to-sky-600"
                    border="border-border"
                    colSpan="lg:col-span-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-2">
                      {(footer.linkGroups as any[]).map((group: any, gi: number) => (
                        <div key={gi} className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                          <p className="text-base font-extrabold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            {group.title || `Group ${gi + 1}`}
                          </p>
                          <ul className="space-y-3">
                            {(group.links || []).map((link: any, li: number) => (
                              <li key={li} className="flex items-start gap-3 group/link">
                                <Link2 className="w-3.5 h-3.5 text-muted-foreground/50 mt-1 group-hover/link:text-primary transition-colors" />
                                {link.href ? (
                                  <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-primary font-medium hover:underline truncate transition-colors"
                                  >
                                    {link.label || link.href}
                                  </a>
                                ) : (
                                  <span className="text-sm text-muted-foreground font-medium">{link.label || "—"}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>
          </div> */}

        </>
      )}
    </div>
  );
};

export default AboutPage;