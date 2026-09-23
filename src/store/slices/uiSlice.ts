import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";

export type EntityType = "DIVISION" | "FIELD" | "MISSION" | "PILOT" | "FARMER" | null;

export interface SelectedEntity {
  type: EntityType;
  id: string | number | null;
}

export interface ActiveLayersState {
  satellite: boolean;
  ndvi: boolean;
  zones: boolean;
  pilots: boolean;
  missions: boolean;
  weather: boolean;
  [key: string]: boolean;
}

export interface UiState {
  // GIS & Map state
  selectedEntity: SelectedEntity;
  activeLayers: ActiveLayersState;
  mapCenter: [number, number] | null;
  mapZoom: number | null;

  // Modals & Drawers
  activeModal: string | null;
  selectedRecordId: number | string | null;

  // Filter & Search caching
  pilotFilters: {
    search: string;
    status: string;
    page: number;
    limit: number;
  };
  fieldFilters: {
    search: string;
    cropType: string;
    district: string;
    page: number;
    limit: number;
  };
  farmerFilters: {
    search: string;
    page: number;
    limit: number;
  };
  requestFilters: {
    search: string;
    status: string;
    priority: string;
    page: number;
    limit: number;
  };
}

const initialState: UiState = {
  selectedEntity: { type: null, id: null },
  activeLayers: {
    satellite: false,
    ndvi: false,
    zones: true,
    pilots: true,
    missions: true,
    weather: false,
  },
  mapCenter: null,
  mapZoom: null,

  activeModal: null,
  selectedRecordId: null,

  pilotFilters: {
    search: "",
    status: "All",
    page: 1,
    limit: 9,
  },
  fieldFilters: {
    search: "",
    cropType: "All",
    district: "All",
    page: 1,
    limit: 10,
  },
  farmerFilters: {
    search: "",
    page: 1,
    limit: 10,
  },
  requestFilters: {
    search: "",
    status: "ALL",
    priority: "ALL",
    page: 1,
    limit: 10,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedEntity: (
      state,
      action: PayloadAction<{ type: EntityType; id: string | number | null } | null>,
    ) => {
      if (!action.payload) {
        state.selectedEntity = { type: null, id: null };
      } else {
        state.selectedEntity = action.payload;
      }
    },
    toggleLayer: (state, action: PayloadAction<string>) => {
      const layer = action.payload;
      state.activeLayers[layer] = !state.activeLayers[layer];
    },
    setLayerState: (state, action: PayloadAction<{ layer: string; enabled: boolean }>) => {
      state.activeLayers[action.payload.layer] = action.payload.enabled;
    },
    setMapViewport: (
      state,
      action: PayloadAction<{ center: [number, number]; zoom?: number }>,
    ) => {
      state.mapCenter = action.payload.center;
      if (action.payload.zoom !== undefined) {
        state.mapZoom = action.payload.zoom;
      }
    },
    openModal: (
      state,
      action: PayloadAction<{ modal: string; recordId?: number | string | null }>,
    ) => {
      state.activeModal = action.payload.modal;
      state.selectedRecordId = action.payload.recordId ?? null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.selectedRecordId = null;
    },
    setPilotFilters: (state, action: PayloadAction<Partial<UiState["pilotFilters"]>>) => {
      state.pilotFilters = { ...state.pilotFilters, ...action.payload };
    },
    setFieldFilters: (state, action: PayloadAction<Partial<UiState["fieldFilters"]>>) => {
      state.fieldFilters = { ...state.fieldFilters, ...action.payload };
    },
    setFarmerFilters: (state, action: PayloadAction<Partial<UiState["farmerFilters"]>>) => {
      state.farmerFilters = { ...state.farmerFilters, ...action.payload };
    },
    setRequestFilters: (state, action: PayloadAction<Partial<UiState["requestFilters"]>>) => {
      state.requestFilters = { ...state.requestFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.pilotFilters = initialState.pilotFilters;
      state.fieldFilters = initialState.fieldFilters;
      state.farmerFilters = initialState.farmerFilters;
      state.requestFilters = initialState.requestFilters;
    },
  },
});

export const {
  setSelectedEntity,
  toggleLayer,
  setLayerState,
  setMapViewport,
  openModal,
  closeModal,
  setPilotFilters,
  setFieldFilters,
  setFarmerFilters,
  setRequestFilters,
  resetFilters,
} = uiSlice.actions;

// Base selector for UI
const selectUiDomain = (state: { ui: UiState }) => state.ui;

// Memoized Selectors for Granular Component Subscriptions
export const selectSelectedEntity = createSelector(
  [selectUiDomain],
  (ui) => ui.selectedEntity,
);

export const selectActiveLayers = createSelector(
  [selectUiDomain],
  (ui) => ui.activeLayers,
);

export const selectMapViewport = createSelector(
  [selectUiDomain],
  (ui) => ({ center: ui.mapCenter, zoom: ui.mapZoom }),
);

export const selectActiveModal = createSelector(
  [selectUiDomain],
  (ui) => ({ activeModal: ui.activeModal, selectedRecordId: ui.selectedRecordId }),
);

export const selectPilotFilters = createSelector(
  [selectUiDomain],
  (ui) => ui.pilotFilters,
);

export const selectFieldFilters = createSelector(
  [selectUiDomain],
  (ui) => ui.fieldFilters,
);

export const selectFarmerFilters = createSelector(
  [selectUiDomain],
  (ui) => ui.farmerFilters,
);

export const selectRequestFilters = createSelector(
  [selectUiDomain],
  (ui) => ui.requestFilters,
);
