import { b as createLucideIcon, h as useInternetIdentity, u as useNavigate, a as useLanguage, r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence, X, d as useQueryClient, e as ue } from "./index-CinqF2FC.js";
import { B as Button } from "./button-CFWNxzA7.js";
import { I as Input } from "./input-Bc61c2Ky.js";
import { L as Label } from "./label-B7_gM1lJ.js";
import { T as Textarea } from "./textarea-CPs-WpsV.js";
import { u as useCurrentUser } from "./index-DXe1TNIQ.js";
import { S as Shield } from "./shield-CM06-u3E.js";
import { L as Lock } from "./lock-CzUPLmOL.js";
import { E as Eye } from "./eye-D60ezOH4.js";
import { C as Check } from "./check-DftDiFuj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
const Key = createLucideIcon("key", __iconNode);
const II_EXPLAINER = {
  ar: "هوية الإنترنت (Internet Identity) هي نظام تسجيل دخول آمن وخاص يعمل مباشرةً على جهازك دون بريد إلكتروني. يمكنك أيضًا إنشاء كلمة مرور لتأمين حسابك.",
  fr: "Internet Identity est un système de connexion sécurisé et privé. Créez également un mot de passe pour sécuriser votre compte Zaren Veto.",
  en: "Internet Identity is a secure, private login system. You can also create a password to further secure your Zaren Veto account."
};
function checkPassword(pw) {
  return {
    minLength: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw)
  };
}
function isPasswordValid(pw) {
  const r = checkPassword(pw);
  return r.minLength && r.uppercase && r.lowercase && r.digit;
}
function RuleRow({ label, met }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center gap-2 text-xs transition-colors duration-200 ${met ? "text-green-500" : "text-muted-foreground"}`,
      children: [
        met ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    }
  );
}
function PasswordLoginForm({ onShowRegister }) {
  const { loginWithPassword, isLoggingInWithPassword } = useCurrentUser();
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const { t, isRTL } = useLanguage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) return;
    try {
      await loginWithPassword({ username: username.trim(), password });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg || t.passwordLoginWrongCredentials);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.3 },
      dir: isRTL ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl font-semibold text-foreground mb-1", children: t.passwordLoginTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: t.passwordLoginSubtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => void handleSubmit(e),
            className: "space-y-4",
            "data-ocid": "password-login.form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-username", className: "text-sm font-medium", children: t.passwordLoginUsernameLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "login-username",
                    placeholder: t.passwordLoginUsernamePlaceholder,
                    value: username,
                    onChange: (e) => {
                      setUsername(e.target.value);
                      setError("");
                    },
                    disabled: isLoggingInWithPassword,
                    maxLength: 32,
                    required: true,
                    autoComplete: "username",
                    "data-ocid": "password-login.username_input",
                    className: "bg-secondary border-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-password", className: "text-sm font-medium", children: t.passwordLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "login-password",
                      type: showPassword ? "text" : "password",
                      placeholder: "••••••••",
                      value: password,
                      onChange: (e) => {
                        setPassword(e.target.value);
                        setError("");
                      },
                      disabled: isLoggingInWithPassword,
                      maxLength: 128,
                      required: true,
                      autoComplete: "current-password",
                      "data-ocid": "password-login.password_input",
                      className: "bg-secondary border-input pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword((v) => !v),
                      className: "absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      "data-ocid": "password-login.password_toggle",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs text-destructive flex items-center gap-1.5 p-2 rounded-lg bg-destructive/10 border border-destructive/20",
                  "data-ocid": "password-login.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 shrink-0" }),
                    error
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isLoggingInWithPassword || !username.trim() || !password,
                  className: "w-full h-11",
                  "data-ocid": "password-login.submit_button",
                  children: isLoggingInWithPassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                    t.passwordLoginLoading
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4" }),
                    t.passwordLoginButton
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            t.notRegisteredYet,
            " "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onShowRegister,
              className: "text-sm text-primary font-medium hover:underline transition-colors",
              "data-ocid": "password-login.register_link",
              children: t.registerLink
            }
          )
        ] })
      ]
    }
  );
}
function PasswordOnlyRegistrationForm({ onBack }) {
  const { registerWithPasswordOnly, isRegisteringWithPasswordOnly } = useCurrentUser();
  const [username, setUsername] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [touched, setTouched] = reactExports.useState(false);
  const [usernameError, setUsernameError] = reactExports.useState("");
  const { t, isRTL } = useLanguage();
  const qc = useQueryClient();
  const rules = checkPassword(password);
  const allRulesMet = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = username.trim().length > 0 && allRulesMet && passwordsMatch;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setUsernameError("");
    if (!username.trim()) {
      ue.error(t.usernameRequired2);
      return;
    }
    if (!allRulesMet) {
      ue.error(t.passwordTooWeak);
      return;
    }
    if (!passwordsMatch) {
      ue.error(t.passwordMismatch);
      return;
    }
    try {
      await registerWithPasswordOnly({
        username: username.trim(),
        password,
        email: email.trim() || void 0,
        bio: bio.trim()
      });
      ue.success(t.welcomeToast);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("reserved") || msg.includes("réservé") || msg.includes("محجوز")) {
        setUsernameError(t.usernameReservedError);
      } else {
        ue.error(t.registrationFailed);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.3 },
      dir: isRTL ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onBack,
            className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4",
            "data-ocid": "password-register.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
              t.backToLogin
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl font-semibold text-foreground mb-1", children: t.passwordRegisterTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5 leading-relaxed", children: t.passwordRegisterSubtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => void handleSubmit(e),
            className: "space-y-4",
            "data-ocid": "password-register.form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "preg-username", className: "text-sm font-medium", children: [
                  t.username,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "preg-username",
                    placeholder: t.usernamePlaceholder,
                    value: username,
                    onChange: (e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError("");
                    },
                    disabled: isRegisteringWithPasswordOnly,
                    maxLength: 32,
                    required: true,
                    autoComplete: "username",
                    "data-ocid": "password-register.username_input",
                    className: `bg-secondary border-input ${usernameError ? "border-destructive focus-visible:ring-destructive/30" : ""}`
                  }
                ),
                usernameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-1",
                    "data-ocid": "password-register.username_reserved_error",
                    children: usernameError
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "preg-email", className: "text-sm font-medium", children: t.emailLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "preg-email",
                    type: "email",
                    placeholder: "example@email.com",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    disabled: isRegisteringWithPasswordOnly,
                    maxLength: 254,
                    autoComplete: "email",
                    "data-ocid": "password-register.email_input",
                    className: "bg-secondary border-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "preg-password", className: "text-sm font-medium", children: [
                  t.passwordLabel,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "preg-password",
                      type: showPassword ? "text" : "password",
                      placeholder: t.passwordPlaceholder,
                      value: password,
                      onChange: (e) => {
                        setPassword(e.target.value);
                        setTouched(true);
                      },
                      disabled: isRegisteringWithPasswordOnly,
                      maxLength: 128,
                      required: true,
                      autoComplete: "new-password",
                      "data-ocid": "password-register.password_input",
                      className: "bg-secondary border-input pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword((v) => !v),
                      className: "absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      "data-ocid": "password-register.password_toggle",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                (touched || password.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    transition: { duration: 0.2 },
                    className: "pt-2 space-y-1 pl-1",
                    "data-ocid": "password-register.password_rules",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { label: t.passwordRuleMinLength, met: rules.minLength }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { label: t.passwordRuleUppercase, met: rules.uppercase }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { label: t.passwordRuleLowercase, met: rules.lowercase }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { label: t.passwordRuleDigit, met: rules.digit })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "preg-confirm-password",
                    className: "text-sm font-medium",
                    children: [
                      t.confirmPasswordLabel,
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "preg-confirm-password",
                      type: showConfirm ? "text" : "password",
                      placeholder: t.confirmPasswordPlaceholder,
                      value: confirmPassword,
                      onChange: (e) => setConfirmPassword(e.target.value),
                      disabled: isRegisteringWithPasswordOnly,
                      maxLength: 128,
                      required: true,
                      autoComplete: "new-password",
                      "data-ocid": "password-register.confirm_password_input",
                      className: `bg-secondary border-input pr-10 ${confirmPassword.length > 0 && !passwordsMatch ? "border-destructive focus-visible:ring-destructive/30" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirm((v) => !v),
                      className: "absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showConfirm ? "Hide password" : "Show password",
                      "data-ocid": "password-register.confirm_password_toggle",
                      children: showConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                confirmPassword.length > 0 && !passwordsMatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-1",
                    "data-ocid": "password-register.password_mismatch_error",
                    children: t.passwordMismatch
                  }
                ),
                confirmPassword.length > 0 && passwordsMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-500 flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                  " ",
                  t.passwordLabel,
                  " ✓"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "preg-bio", className: "text-sm font-medium", children: [
                  t.bio,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: t.bioOptional })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "preg-bio",
                    placeholder: t.bioPlaceholder,
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    disabled: isRegisteringWithPasswordOnly,
                    rows: 2,
                    maxLength: 280,
                    "data-ocid": "password-register.bio_input",
                    className: "bg-secondary border-input resize-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  bio.length,
                  "/280"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isRegisteringWithPasswordOnly || !canSubmit,
                  className: "w-full h-11",
                  "data-ocid": "password-register.submit_button",
                  children: isRegisteringWithPasswordOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                    t.joiningLabel
                  ] }) : t.joinButton
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function PasswordRegistrationForm() {
  const { registerWithPassword, isRegisteringWithPassword } = useCurrentUser();
  const [username, setUsername] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [touched, setTouched] = reactExports.useState(false);
  const [usernameError, setUsernameError] = reactExports.useState("");
  const { t, isRTL } = useLanguage();
  const qc = useQueryClient();
  const rules = checkPassword(password);
  const allRulesMet = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = username.trim().length > 0 && allRulesMet && passwordsMatch;
  const isSubmitting = isRegisteringWithPassword;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setUsernameError("");
    if (!username.trim()) {
      ue.error(t.usernameRequired2);
      return;
    }
    if (!allRulesMet) {
      ue.error(t.passwordTooWeak);
      return;
    }
    if (!passwordsMatch) {
      ue.error(t.passwordMismatch);
      return;
    }
    try {
      await registerWithPassword({
        username: username.trim(),
        password,
        email: email.trim() || void 0,
        bio: bio.trim()
      });
      ue.success(t.welcomeToast);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("reserved") || msg.includes("réservé") || msg.includes("محجوز")) {
        setUsernameError(t.usernameReservedError);
      } else {
        ue.error(t.registrationFailed);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full max-w-sm",
      dir: isRTL ? "rtl" : "ltr",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: t.passwordSectionTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.passwordSectionSubtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20",
            "data-ocid": "registration.security_msg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none mt-0.5", children: "🔒" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-400 leading-relaxed", children: t.securityProtectionMsg })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => void handleSubmit(e),
            className: "space-y-4",
            "data-ocid": "registration.form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-username", className: "text-sm font-medium", children: [
                  t.username,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "reg-username",
                    placeholder: t.usernamePlaceholder,
                    value: username,
                    onChange: (e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError("");
                    },
                    disabled: isSubmitting,
                    maxLength: 32,
                    required: true,
                    autoComplete: "username",
                    "data-ocid": "registration.username_input",
                    className: `bg-secondary border-input ${usernameError ? "border-destructive focus-visible:ring-destructive/30" : ""}`
                  }
                ),
                usernameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-1",
                    "data-ocid": "registration.username_reserved_error",
                    children: usernameError
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-email", className: "text-sm font-medium", children: t.emailLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "reg-email",
                    type: "email",
                    placeholder: "example@email.com",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    disabled: isSubmitting,
                    maxLength: 254,
                    autoComplete: "email",
                    "data-ocid": "registration.email_input",
                    className: "bg-secondary border-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-password", className: "text-sm font-medium", children: [
                  t.passwordLabel,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-password",
                      type: showPassword ? "text" : "password",
                      placeholder: t.passwordPlaceholder,
                      value: password,
                      onChange: (e) => {
                        setPassword(e.target.value);
                        setTouched(true);
                      },
                      disabled: isSubmitting,
                      maxLength: 128,
                      required: true,
                      autoComplete: "new-password",
                      "data-ocid": "registration.password_input",
                      className: "bg-secondary border-input pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword((v) => !v),
                      className: "absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      "data-ocid": "registration.password_toggle",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                (touched || password.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    transition: { duration: 0.2 },
                    className: "pt-2 space-y-1 pl-1",
                    "data-ocid": "registration.password_rules",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RuleRow,
                        {
                          label: t.passwordRuleMinLength,
                          met: rules.minLength
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RuleRow,
                        {
                          label: t.passwordRuleUppercase,
                          met: rules.uppercase
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RuleRow,
                        {
                          label: t.passwordRuleLowercase,
                          met: rules.lowercase
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RuleRow, { label: t.passwordRuleDigit, met: rules.digit })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "reg-confirm-password",
                    className: "text-sm font-medium",
                    children: [
                      t.confirmPasswordLabel,
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "reg-confirm-password",
                      type: showConfirm ? "text" : "password",
                      placeholder: t.confirmPasswordPlaceholder,
                      value: confirmPassword,
                      onChange: (e) => setConfirmPassword(e.target.value),
                      disabled: isSubmitting,
                      maxLength: 128,
                      required: true,
                      autoComplete: "new-password",
                      "data-ocid": "registration.confirm_password_input",
                      className: `bg-secondary border-input pr-10 ${confirmPassword.length > 0 && !passwordsMatch ? "border-destructive focus-visible:ring-destructive/30" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirm((v) => !v),
                      className: "absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": showConfirm ? "Hide password" : "Show password",
                      "data-ocid": "registration.confirm_password_toggle",
                      children: showConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                confirmPassword.length > 0 && !passwordsMatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-1",
                    "data-ocid": "registration.password_mismatch_error",
                    children: t.passwordMismatch
                  }
                ),
                confirmPassword.length > 0 && passwordsMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-500 flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                  " ",
                  t.passwordLabel,
                  " ✓"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-bio", className: "text-sm font-medium", children: [
                  t.bio,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: t.bioOptional })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "reg-bio",
                    placeholder: t.bioPlaceholder,
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    disabled: isSubmitting,
                    rows: 2,
                    maxLength: 280,
                    "data-ocid": "registration.bio_input",
                    className: "bg-secondary border-input resize-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  bio.length,
                  "/280"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isSubmitting || !canSubmit,
                  className: "w-full h-11",
                  "data-ocid": "registration.submit_button",
                  children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                    t.joiningLabel
                  ] }) : t.joinButton
                }
              )
            ]
          }
        )
      ] })
    }
  );
}
function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = reactExports.useState("password");
  const [passwordView, setPasswordView] = reactExports.useState("login");
  reactExports.useEffect(() => {
    if (status === "authenticated") {
      void navigate({ to: "/" });
    }
  }, [status, navigate]);
  const explainer = II_EXPLAINER[language] ?? II_EXPLAINER.en;
  const features = [
    {
      icon: Shield,
      title: t.featureDigitalSovereignty,
      desc: t.featureDigitalSovereigntyDesc
    },
    {
      icon: Lock,
      title: t.featureEncryptedMessages,
      desc: t.featureEncryptedMessagesDesc
    },
    {
      icon: Eye,
      title: t.featureVisibilityControl,
      desc: t.featureVisibilityControlDesc
    },
    {
      icon: Fingerprint,
      title: t.featureNoBiometrics,
      desc: t.featureNoBiometricsDesc
    }
  ];
  if (status === "registering") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordRegistrationForm, {}) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col lg:flex-row",
      "data-ocid": "login-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex lg:flex-1 bg-card border-r border-border flex-col items-center justify-center px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
            className: "max-w-sm w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-semibold text-foreground tracking-tight", children: t.appName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4", children: [
                t.tagline,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t.taglineHighlight })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg leading-relaxed mb-10", children: t.loginSubtitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -16 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.3 + i * 0.1, duration: 0.4 },
                  className: "flex items-start gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-4 h-4 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: f.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: f.desc })
                    ] })
                  ]
                },
                f.title
              )) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 lg:w-[480px] lg:flex-none flex flex-col items-center justify-center px-4 sm:px-8 py-10 pt-safe", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
            className: "w-full max-w-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8 lg:hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-semibold text-foreground tracking-tight", children: t.appName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 text-center", children: t.loginSubtitle })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex rounded-xl bg-muted/50 border border-border p-1 mb-6 gap-1",
                    "data-ocid": "login.tab_switcher",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setActiveTab("password");
                            setPasswordView("login");
                          },
                          className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "password" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
                          "data-ocid": "login.password_tab",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3.5 h-3.5" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.loginWithPasswordTab }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: t.passwordLoginButton })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setActiveTab("ii"),
                          className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "ii" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`,
                          "data-ocid": "login.ii_tab",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.loginWithIITab })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: activeTab === "password" ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { children: passwordView === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PasswordLoginForm,
                  {
                    onShowRegister: () => setPasswordView("register")
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PasswordOnlyRegistrationForm,
                  {
                    onBack: () => setPasswordView("login")
                  }
                ) }, "password-tab") : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -16 },
                    transition: { duration: 0.3 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl font-semibold text-foreground mb-2", children: t.signInSecurely }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: t.signInDesc }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          onClick: login,
                          disabled: isLoggingIn || isInitializing,
                          className: "w-full h-12 sm:h-12 text-base font-semibold metallic-border transition-smooth",
                          "data-ocid": "login-button",
                          children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                            t.connecting
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                            t.continueWithII
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed text-center", children: explainer }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-4 leading-relaxed", children: t.loginDisclaimer }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-5 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-primary" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: t.securedBy })
                      ] }) })
                    ]
                  },
                  "ii-tab"
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 lg:hidden grid grid-cols-2 gap-3", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2 bg-card border border-border rounded-xl p-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-3.5 h-3.5 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground leading-tight", children: f.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2", children: f.desc })
                    ] })
                  ]
                },
                f.title
              )) })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  LoginPage as default
};
