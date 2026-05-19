import {
  clearGetAllUsersAction,
  getAllUsersAction,
  registerAction,
  resetAction,
  setupAction,
  verifySetupAction,
  clearRegisterAction,
  clearSetupAction,
  clearVerifySetupAction,
  clearResetAction
} from '@/store/actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { UserData } from '@/types/responses';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus, Users, ShieldCheck, ShieldOff, Calendar, Mail, User,
  X, ChevronRight, KeyRound, CheckCircle, Copy, Check
} from 'lucide-react';
// resetAction, clearResetAction, resetReducer

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Register", "Scan QR", "Verify"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: done
                    ? "hsl(152,55%,32%)"
                    : active
                      ? "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))"
                      : "hsl(152,55%,32%,0.1)",
                  color: done || active ? "white" : "hsl(152,55%,32%)",
                  boxShadow: active ? "0 0 0 4px hsl(152,55%,32%,0.15)" : "none",
                }}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : num}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: active ? "hsl(152,55%,32%)" : "hsl(0,0%,60%)" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-10 h-0.5 mb-5 mx-1 rounded-full transition-all duration-300"
                style={{ background: done ? "hsl(152,55%,32%)" : "hsl(152,55%,32%,0.15)" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Add Admin Modal ───────────────────────────────────────────────────────────
function AddAdminModal({
  open,
  step,
  form,
  setForm,
  qrData,
  token,
  setToken,
  onRegister,
  onContinue,
  onVerify,
  onClose,
  registerLoading,
  verifySetupLoading,
}: {
  open: boolean;
  step: 1 | 2 | 3;
  form: { username: string; email: string };
  setForm: (f: { username: string; email: string }) => void;
  qrData: { qrCode: string; secret: string } | null;
  token: string;
  setToken: (t: string) => void;
  onRegister: () => void;
  onContinue: () => void;
  onVerify: () => void;
  onClose: () => void;
  registerLoading: boolean;
  verifySetupLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copySecret = () => {
    if (qrData?.secret) {
      navigator.clipboard.writeText(qrData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background border border-border shadow-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{ color: "hsl(152,55%,32%)" }}
            >
              {step === 1 ? "New Admin" : step === 2 ? "Two-Factor Auth" : "Verification"}
            </p>
            <h2 className="font-display text-xl font-bold text-foreground">
              {step === 1 ? "Register Admin" : step === 2 ? "Scan QR Code" : "Enter Token"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <StepIndicator step={step} />

        {/* STEP 1 — Register */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Username
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(152,55%,32%,0.1)" }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
                </div>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "hsl(152,55%,32%)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px hsl(152,55%,32%,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Email
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(152,55%,32%,0.1)" }}
                >
                  <Mail className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "hsl(152,55%,32%)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px hsl(152,55%,32%,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              onClick={onRegister}
              disabled={registerLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              {registerLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Registering…
                </>
              ) : (
                <>Register Admin <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {/* STEP 2 — QR */}
        {step === 2 && qrData && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Scan this QR code with your Authenticator app (Google Authenticator, Authy, etc.)
            </p>

            {/* QR image */}
            <div
              className="mx-auto w-fit p-3 rounded-2xl border"
              style={{ background: "white", borderColor: "hsl(152,55%,32%,0.2)" }}
            >
              {/* <img src={qrData.qrCode} alt="QR Code" className="w-44 h-44 object-contain" /> */}
              <div
                className="w-34 h-34"
                dangerouslySetInnerHTML={{ __html: qrData.qrCode }}
              />
            </div>

            {/* Secret key */}
            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.15)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Manual Secret Key
                </p>
                <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                  {qrData.secret}
                </p>
              </div>
              <button
                onClick={copySecret}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "hsl(152,55%,32%)" }}
                title="Copy secret"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              I've scanned it <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3 — Verify */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Enter the 6-digit code from your Authenticator app to complete setup.
            </p>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Verification Token
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(152,55%,32%,0.1)" }}
                >
                  <KeyRound className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
                </div>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 tracking-[0.3em] font-mono"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "hsl(152,55%,32%)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px hsl(152,55%,32%,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              onClick={onVerify}
              disabled={verifySetupLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              {verifySetupLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Complete Setup
                </>
              )}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export const AdminUsers = () => {
  const dispatch = useAppDispatch();

  const {
    loading: getUsersLoading,
    successData: getUsersSuccess,
    error: getUsersError,
    errorInfo: getUsersErrorInfo,
  } = useAppSelector((s) => s.getAllUsersReducer);

  const {
    loading: registerLoading,
    successData: registerSuccess,
    error: registerError,
    errorInfo: registerErrorInfo,
  } = useAppSelector((s) => s.registerReducer);

  const {
    loading: setupLoading,
    successData: setupSuccess,
    error: setupError,
    errorInfo: setupErrorInfo,
  } = useAppSelector((s) => s.setupReducer);

  const {
    loading: verifySetupLoading,
    successData: verifySetupSuccess,
    error: verifySetupError,
    errorInfo: verifySetupErrorInfo,
  } = useAppSelector((s) => s.verifySetupReducer);

  const {
    loading: resetLoading,
    successData: resetSuccess,
    error: resetError,
    errorInfo: resetErrorInfo,
  } = useAppSelector((s) => s.resetReducer);

  const [users, setUsers] = useState<UserData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ username: "", email: "" });
  const [qrData, setQrData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => { dispatch(getAllUsersAction()); }, [dispatch]);

  useEffect(() => {
    if (getUsersSuccess) {
      setUsers(getUsersSuccess.data);
      dispatch(clearGetAllUsersAction());
    }
  }, [getUsersSuccess, dispatch]);

  useEffect(() => {
    if (getUsersError) toast.error(getUsersErrorInfo || "Failed to fetch users");
  }, [getUsersError, getUsersErrorInfo]);

  useEffect(() => {
    if (registerSuccess) {
      toast.success("Admin registered");
      dispatch(setupAction({ email: form.email }));
      setStep(2);

      dispatch(clearRegisterAction());
    }
  }, [registerSuccess]);

  useEffect(() => {
    if (setupSuccess) {
      setQrData({ qrCode: setupSuccess.data.qrCode, secret: setupSuccess.data.secret });
      toast.success("Scan QR with Authenticator");

      dispatch(clearSetupAction());
    }
  }, [setupSuccess]);

  useEffect(() => {
    if (verifySetupSuccess) {
      toast.success("Admin setup completed");
      setIsModalOpen(false);
      setStep(1);
      setForm({ username: "", email: "" });
      setToken("");

      dispatch(getAllUsersAction());
      dispatch(clearVerifySetupAction());
    }
  }, [verifySetupSuccess]);

  useEffect(() => {
    if (resetSuccess) {
      toast.success("2FA reset — scan the new QR code to complete setup");
      setQrData({
        qrCode: resetSuccess.data.qrCode,
        secret: resetSuccess.data.secret,
      });
      setStep(2);
      setIsModalOpen(true);

      dispatch(clearResetAction());
    }
  }, [resetSuccess]);

  useEffect(() => { if (registerError) toast.error(registerErrorInfo); }, [registerError]);
  useEffect(() => { if (setupError) toast.error(setupErrorInfo); }, [setupError]);
  useEffect(() => { if (verifySetupError) toast.error(verifySetupErrorInfo); }, [verifySetupError]);
  useEffect(() => { if (resetError) toast.error(resetErrorInfo); }, [resetError]);

  const handleRegister = () => {
    if (!form.username || !form.email) return toast.error("Fill all fields");
    dispatch(registerAction({ username: form.username, email: form.email, role: "admin" }));
  };

  const handleVerify = () => {
    if (!token) return toast.error("Enter token");
    dispatch(verifySetupAction({ email: form.email, token }));
  };

  const handleReset = (user: UserData) => {
    setForm((prev) => ({ ...prev, email: user.email, username: user.username }));
    dispatch(resetAction({ email: user.email }));
  };

  // Stats
  const twoFAEnabled = users.filter(u => u.twoFactorEnabled).length;

  return (
    <div className="min-h-screen py-8" style={{ background: "hsl(40,33%,98%)" }}>
      <AddAdminModal
        open={isModalOpen}
        step={step}
        form={form}
        setForm={setForm}
        qrData={qrData}
        token={token}
        setToken={setToken}
        onRegister={handleRegister}
        onContinue={() => setStep(3)}
        onVerify={handleVerify}
        onClose={() => setIsModalOpen(false)}
        registerLoading={registerLoading}
        verifySetupLoading={verifySetupLoading}
      />

      <div className="container max-w-7xl mx-auto px-4">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "hsl(152,55%,32%)" }}>
              User Management
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Manage Admins
            </h1>
            <div className="h-1 w-16 rounded-full mt-2" style={{ background: "linear-gradient(90deg, hsl(152,55%,32%), hsl(145,47%,45%))" }} />
          </div>
          <button
            onClick={() => { setIsModalOpen(true); setStep(1); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          >
            <Plus className="w-4 h-4" /> Add Admin
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total Admins", value: users.length },
            { label: "2FA Enabled", value: twoFAEnabled },
            { label: "2FA Disabled", value: users.length - twoFAEnabled },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center border"
              style={{ background: "white", borderColor: "hsl(152,55%,32%,0.15)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
              <p className="font-display text-2xl font-bold" style={{ color: "hsl(152,55%,32%)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Loading */}
        {getUsersLoading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(152,55%,32%)", borderTopColor: "transparent" }} />
            <p className="text-sm text-muted-foreground mt-3">Loading admins...</p>
          </div>
        )}

        {/* Empty */}
        {!getUsersLoading && users.length === 0 && (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-muted/30">
            <div className="text-5xl mb-4">👤</div>
            <p className="font-display text-xl font-bold text-foreground mb-1">No admins yet</p>
            <p className="text-sm text-muted-foreground mb-5">Add your first admin to get started</p>
            <button
              onClick={() => { setIsModalOpen(true); setStep(1); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              <Plus className="w-4 h-4" /> Add First Admin
            </button>
          </div>
        )}

        {/* Table */}
        {!getUsersLoading && users.length > 0 && (
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            {/* Table header */}
            <div
              className="grid grid-cols-6 px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "hsl(152,55%,32%,0.06)", borderBottom: "1px solid hsl(152,55%,32%,0.15)", color: "hsl(152,55%,32%)" }}
            >
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>2FA</span>
              <span>Created</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {users.map((user, idx) => (
              <div
                key={user.id}
                className="grid grid-cols-6 px-5 py-4 items-center text-sm transition-colors hover:bg-muted/30 animate-scale-in"
                style={{
                  borderTop: idx > 0 ? "1px solid hsl(0,0%,92%)" : "none",
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                {/* Username */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
                  >
                    {user.username?.[0]?.toUpperCase() ?? "A"}
                  </div>
                  <span className="font-semibold text-foreground truncate">{user.username}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate text-xs">{user.email}</span>
                </div>

                {/* Role */}
                <div>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white capitalize"
                    style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
                  >
                    {user.role}
                  </span>
                </div>

                {/* 2FA */}
                <div>
                  {user.twoFactorEnabled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-200">
                      <ShieldCheck className="w-3 h-3" /> Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200">
                      <ShieldOff className="w-3 h-3" /> Disabled
                    </span>
                  )}
                </div>

                {/* Created */}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs">{formatDate(user.created_at)}</span>
                </div>

                {/* Reset Action */}
                <div>
                  <button
                    onClick={() => handleReset(user)}
                    disabled={resetLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                    style={{
                      background: "hsl(0,72%,51%,0.08)",
                      color: "hsl(0,72%,51%)",
                      border: "1px solid hsl(0,72%,51%,0.2)",
                    }}
                  >
                    {resetLoading ? (
                      <span className="w-3 h-3 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                    ) : (
                      <KeyRound className="w-3 h-3" />
                    )}
                    Reset 2FA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};