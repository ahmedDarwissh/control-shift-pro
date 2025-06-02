// This file, located at the project root (Sidebar.tsx),
// re-exports the default export from the actual component in './components/Sidebar'.
// This ensures that if an alias like '@components/Sidebar' (or similar)
// resolves to this root file, it correctly provides a default export.
import ActualSidebarComponent from './components/Sidebar';
export default ActualSidebarComponent;