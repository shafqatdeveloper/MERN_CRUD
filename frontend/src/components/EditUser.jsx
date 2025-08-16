import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editSingleUser, getuser } from "../ApiCalls.jsx";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userDetails = async () => {
      try {
        setLoading(true);
        const response = await getuser(id); // fixed typo
        setUser(response.data);
        setInitial(response.data);
      } catch (err) {
        setFormError(
          err?.response?.data?.message || "Failed to load user. Try again."
        );
      } finally {
        setLoading(false);
      }
    };
    userDetails();
  }, [id]);

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setUser((u) => ({ ...u, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!user.name.trim()) next.name = "Name is required.";
    if (!user.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      next.email = "Enter a valid email.";
    if (!user.username.trim()) next.username = "Username is required.";
    if (!user.phone.trim()) next.phone = "Phone is required.";
    else if (!/^\+?[0-9]{7,15}$/.test(user.phone))
      next.phone = "Enter a valid phone (7–15 digits).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const isDirty = useMemo(() => {
    if (!initial) return false;
    return (
      initial.name !== user.name ||
      initial.email !== user.email ||
      initial.username !== user.username ||
      initial.phone !== user.phone
    );
  }, [initial, user]);

  const canSubmit = useMemo(() => {
    return (
      !saving &&
      isDirty &&
      user.name.trim() &&
      user.email.trim() &&
      user.username.trim() &&
      user.phone.trim()
    );
  }, [saving, isDirty, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    try {
      setSaving(true);
      await editSingleUser(id, user);
      navigate(-1); // go back to previous page; or navigate("/")
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          "Could not update the user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-slate-200">
          <div className="px-6 md:px-8 py-6 md:py-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Edit User
              </h1>
              <p className="text-slate-500 mt-1">
                Update the details and save your changes.
              </p>
            </div>

            {formError ? (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {formError}
              </div>
            ) : null}

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-11 bg-slate-100 rounded-xl" />
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={user.name}
                      onChange={onValueChange}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "name-error" : undefined
                      }
                      className={`w-full rounded-xl border px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-4 focus:ring-sky-100 focus:border-sky-500 ${
                        errors.name
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300"
                      }`}
                      placeholder="Jane Doe"
                      required
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={onValueChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={`w-full rounded-xl border px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-4 focus:ring-sky-100 focus:border-sky-500 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300"
                      }`}
                      placeholder="jane@example.com"
                      required
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={user.username}
                      onChange={onValueChange}
                      aria-invalid={!!errors.username}
                      aria-describedby={
                        errors.username ? "username-error" : undefined
                      }
                      className={`w-full rounded-xl border px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-4 focus:ring-sky-100 focus:border-sky-500 ${
                        errors.username
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300"
                      }`}
                      placeholder="jane_d"
                      required
                    />
                    {errors.username && (
                      <p
                        id="username-error"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={user.phone}
                      onChange={onValueChange}
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      className={`w-full rounded-xl border px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-4 focus:ring-sky-100 focus:border-sky-500 ${
                        errors.phone
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300"
                      }`}
                      placeholder="+923001234567"
                      required
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 ${
                      canSubmit
                        ? "bg-sky-600 hover:bg-sky-700 focus:ring-sky-200"
                        : "bg-sky-300 cursor-not-allowed"
                    }`}
                  >
                    {saving ? "Saving..." : isDirty ? "Save Changes" : "No Changes"}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Last step: review before saving.
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} — Admin Portal
        </p>
      </div>
    </div>
  );
};

export default EditUser;
