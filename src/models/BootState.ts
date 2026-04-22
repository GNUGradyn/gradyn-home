enum BootState {
    BIOS,
    OsLoad,
    Booted
}

export const INITIAL_BOOT_STATE = new URLSearchParams(window.location.search).get("noboot") == null ? BootState.BIOS : BootState.Booted;

export default BootState;
