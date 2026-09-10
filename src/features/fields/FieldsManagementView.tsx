import { useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  Sprout,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  Layers,
  Map,
  CheckCircle2,
} from "lucide-react";
import { PageHeader, FilterPills, MetricCard } from "@/components/ui";
import { useFields, cropFilterOptions } from "./hooks/useFields";
import { FieldFormModal } from "./components/FieldFormModal";
import { DeleteFieldDialog } from "./components/DeleteFieldDialog";
import { FieldDetailsModal } from "./components/FieldDetailsModal";
import type { Field, CreateFieldDTO, UpdateFieldDTO } from "@/types/field";
import { formatDate } from "@/lib/utils";

const DISTRICT_FILTER_OPTIONS = [
  "All",
  "Matara",
  "Galle",
  "Hambantota",
  "Kandy",
  "Nuwara Eliya",
  "Kurunegala",
  "Anuradhapura",
  "Colombo",
];

export function FieldsManagementView() {
  const {
    fields,
    pagination,
    totalCount,
    isLoading,
    isError,
    error,
    metrics,
    refetch,
    searchQuery,
    setSearchQuery,
    cropFilter,
    setCropFilter,
    districtFilter,
    setDistrictFilter,
    page,
    setPage,
    limit,
    setLimit,
    createField,
    updateField,
    deleteField,
    deletingFieldId,
  } = useFields();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [fieldToView, setFieldToView] = useState<Field | null>(null);

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleOpenAdd = () => {
    setEditingField(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (field: Field) => {
    setEditingField(field);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (field: Field) => {
    setFieldToDelete(field);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenDetails = (field: Field) => {
    setFieldToView(field);
    setIsDetailsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateFieldDTO | UpdateFieldDTO) => {
    if (editingField) {
      await updateField(editingField.id, data as UpdateFieldDTO);
      showToast(`Field "${data.field_name}" updated successfully.`);
    } else {
      await createField(data as CreateFieldDTO);
      showToast(`Field "${data.field_name}" registered successfully.`);
    }
  };

  const handleDeleteConfirm = async (fieldId: number | string) => {
    await deleteField(fieldId);
    showToast("Field parcel deleted successfully.");
  };

  const startItem = totalCount === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, totalCount);

  return (
    <div className="space-y-6 md:space-y-8 font-sans animate-in fade-in duration-300">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#062419] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Fields Management"
        description="Agricultural land parcels, crop allocations, GPS boundaries, and farmer ownership"
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-normal hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
              title="Refresh fields"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#062419] hover:bg-[#0a3828] text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Total Registered Fields"
          value={isLoading ? "..." : metrics.totalFields}
          footer="Active precision parcels"
        />
        <MetricCard
          title="Total Managed Land"
          value={isLoading ? "..." : `${metrics.totalAreaManaged} ha`}
          footer={`≈ ${(metrics.totalAreaManaged * 2.471).toFixed(1)} acres`}
        />
        <MetricCard
          title="Farming Clients"
          value={isLoading ? "..." : metrics.uniqueFarmers}
          footer="Unique registered owners"
        />
        <MetricCard
          title="Dominant Crop Profile"
          value={isLoading ? "..." : metrics.dominantCrop}
          footer="Top cultivated variety"
        />
      </div>

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error || "Failed to load fields from the server."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100 rounded-lg text-rose-700 font-medium transition-colors cursor-pointer text-[11px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters Toolbar & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Crop Filter Pills */}
        <FilterPills
          items={cropFilterOptions}
          active={cropFilter}
          onChange={(crop) => setCropFilter(crop)}
        />

        {/* Search Input & District Dropdown */}
        <div className="flex items-center gap-3">
          {/* District Selector */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
          >
            {DISTRICT_FILTER_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Districts" : d}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search field, farmer, city..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Fields Data Table */}
      <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-normal text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Field Name / ID</th>
              <th className="py-3.5 px-5">Farmer / Owner</th>
              <th className="py-3.5 px-5">Location / Division</th>
              <th className="py-3.5 px-5">Crop Type</th>
              <th className="py-3.5 px-5">Area</th>
              <th className="py-3.5 px-5">Registered</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    <span>Loading agricultural fields...</span>
                  </div>
                </td>
              </tr>
            ) : fields.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                      <Map className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">No fields found</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {searchQuery || cropFilter !== "All" || districtFilter !== "All"
                          ? "No fields match your current filter and search criteria."
                          : "Start by registering your first agricultural field parcel."}
                      </p>
                    </div>
                    {searchQuery || cropFilter !== "All" || districtFilter !== "All" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setCropFilter("All");
                          setDistrictFilter("All");
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-normal transition-colors cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="px-4 py-2 bg-[#062419] hover:bg-[#0a3828] text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow-xs"
                      >
                        + Add First Field
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              fields.map((f) => {
                const isBusyDeleting = deletingFieldId === f.id;
                const initials = (f.farmer?.fullName || "FA")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={f.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(f)}
                  >
                    {/* Field Identifier & Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 font-semibold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {f.field_name || f.fieldName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            ID #{f.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Farmer / Owner */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-700 shrink-0 border border-slate-200">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-800 font-medium truncate max-w-[140px]">
                            {f.farmer?.fullName || `Farmer #${f.farmer_id}`}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {f.farmer?.mobile || f.farmer?.email || "No contact"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Division / District */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-medium">{f.district || "Matara"}</p>
                        <p className="text-[10px] text-slate-400">
                          {f.city || f.village || f.province || "Southern"}
                        </p>
                      </div>
                    </td>

                    {/* Crop Type Badge */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {f.crop_type || f.cropType}
                      </span>
                    </td>

                    {/* Area */}
                    <td className="py-4 px-5">
                      <div>
                        <span className="font-semibold text-slate-900">{f.area} ha</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {(f.area * 2.471).toFixed(1)} ac
                        </span>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-5 text-slate-500 text-[11px]">
                      {formatDate(f.created_at || f.createdAt)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(f)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Field Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(f)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Field"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(f)}
                          disabled={isBusyDeleting}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Field"
                        >
                          {isBusyDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-normal">
        <div>
          Showing <span className="font-medium text-slate-800">{startItem}</span> to{" "}
          <span className="font-medium text-slate-800">{endItem}</span> of{" "}
          <span className="font-medium text-slate-800">{totalCount}</span> fields
        </div>

        {/* Page controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!pagination.hasPrevPage || isLoading}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-slate-600"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === p
                    ? "bg-[#062419] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={!pagination.hasNextPage || isLoading}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-slate-600"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-slate-700 text-xs outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <FieldFormModal
        isOpen={isFormModalOpen}
        field={editingField}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteFieldDialog
        isOpen={isDeleteDialogOpen}
        field={fieldToDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deletingFieldId === fieldToDelete?.id}
      />

      <FieldDetailsModal
        isOpen={isDetailsModalOpen}
        field={fieldToView}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(field) => {
          setEditingField(field);
          setIsFormModalOpen(true);
        }}
      />
    </div>
  );
}

export default FieldsManagementView;
