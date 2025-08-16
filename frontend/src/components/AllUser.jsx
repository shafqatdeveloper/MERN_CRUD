import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { allUser, deleteuser } from "../ApiCalls.jsx";

function descendingComparator(a, b, orderBy) {
  const av = (a?.[orderBy] ?? "").toString().toLowerCase();
  const bv = (b?.[orderBy] ?? "").toString().toLowerCase();
  if (bv < av) return -1;
  if (bv > av) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const AllUser = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const openToast = (message, type = "success") => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
  };

  const getAllUsers = async () => {
    try {
      setFetchError("");
      setLoading(true);
      const resp = await allUser();
      setRows(Array.isArray(resp?.data) ? resp.data : []);
    } catch (err) {
      setFetchError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filtered = useMemo(() => {
    if (!debouncedQuery) return rows;
    return rows.filter((r) => {
      const hay = `${r?.name ?? ""} ${r?.email ?? ""} ${r?.username ?? ""} ${r?.phone ?? ""}`.toLowerCase();
      return hay.includes(debouncedQuery);
    });
  }, [rows, debouncedQuery]);

  const sorted = useMemo(() => stableSort(filtered, getComparator(order, orderBy)), [filtered, order, orderBy]);

  const paged = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage]
  );

  const openDeleteConfirm = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };
  const closeDeleteConfirm = () => {
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteuser(toDeleteId);
      // optimistic update
      setRows((prev) => prev.filter((r) => r._id !== toDeleteId));
      openToast("User deleted successfully.", "success");
    } catch (err) {
      openToast(err?.response?.data?.message || "Delete failed.", "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  // UI helpers
  const SortHeader = ({ id, label }) => {
    const active = orderBy === id;
    const dir = active ? order : "asc";
    return (
      <button
        type="button"
        onClick={() => handleRequestSort(id)}
        className="group inline-flex items-center gap-1 font-semibold text-slate-700"
        aria-sort={active ? (order === "asc" ? "ascending" : "descending") : "none"}
      >
        {label}
        <span
          className={`transition-transform text-slate-400 group-hover:text-slate-600 ${
            active && order === "desc" ? "rotate-180" : ""
          }`}
        >
          ▲
        </span>
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">All Users</h1>
          <button
            onClick={getAllUsers}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            title="Refresh"
          >
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, username, phone"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 pl-9 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          </div>
          <RouterLink
            to="/adduser"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 transition"
          >
            <span className="text-lg leading-none">＋</span> Add User
          </RouterLink>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{fetchError}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        <div className="overflow-auto max-h-[560px]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-700">
                <th className="px-4 py-3"><SortHeader id="name" label="Name" /></th>
                <th className="px-4 py-3"><SortHeader id="email" label="Email" /></th>
                <th className="px-4 py-3"><SortHeader id="username" label="Username" /></th>
                <th className="px-4 py-3"><SortHeader id="phone" label="Phone" /></th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`s-${i}`} className="border-t border-slate-100">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-5 w-full rounded bg-slate-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : paged.length > 0
                ? paged.map((u, idx) => (
                    <tr
                      key={u._id}
                      className={`${idx % 2 === 1 ? "bg-slate-50/40" : ""} border-t border-slate-100 hover:bg-slate-50`}
                    >
                      <td className="px-4 py-3">{u?.name || "—"}</td>
                      <td className="px-4 py-3 max-w-[280px] truncate">{u?.email || "—"}</td>
                      <td className="px-4 py-3">{u?.username || "—"}</td>
                      <td className="px-4 py-3">{u?.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <RouterLink
                            to={`/edituser/${u._id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
                            title="Edit"
                          >
                            Edit
                          </RouterLink>
                          <button
                            onClick={() => openDeleteConfirm(u._id)}
                            className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                        No users found{debouncedQuery ? " for this search." : "."}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium">
                {total === 0 ? 0 : page * rowsPerPage + 1}–
                {Math.min(total, page * rowsPerPage + rowsPerPage)}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600">
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  className="ml-2 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
                >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className={`px-2 py-1 rounded-lg border ${
                    page === 0 ? "border-slate-200 text-slate-300" : "border-slate-300 hover:bg-slate-100"
                  }`}
                  aria-label="First page"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`px-2 py-1 rounded-lg border ${
                    page === 0 ? "border-slate-200 text-slate-300" : "border-slate-300 hover:bg-slate-100"
                  }`}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                <span className="px-2 text-sm text-slate-600">
                  Page <span className="font-medium">{page + 1}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={`px-2 py-1 rounded-lg border ${
                    page >= totalPages - 1
                      ? "border-slate-200 text-slate-300"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                  aria-label="Next page"
                >
                  ›
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className={`px-2 py-1 rounded-lg border ${
                    page >= totalPages - 1
                      ? "border-slate-200 text-slate-300"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Delete user?</h2>
            </div>
            <div className="px-5 py-4 text-slate-700">
              This action can’t be undone. Are you sure you want to delete this user?
            </div>
            <div className="px-5 py-4 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition ${
          toast.open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className={`min-w-[260px] max-w-[90vw] rounded-xl px-4 py-3 text-white shadow-lg ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default AllUser;
